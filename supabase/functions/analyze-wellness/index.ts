import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    if (!groqApiKey) {
      throw new Error('GROQ API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log('Analyzing chat for wellness points for user:', user.id);

    // Analyze the conversation for wellness indicators
    const analysisPrompt = `
    Analyze this mental health conversation and rate the user's wellness on a scale of 1-10:
    - 1-3: Very concerning (negative thoughts, crisis indicators)
    - 4-5: Struggling (stress, anxiety, mild depression)
    - 6-7: Neutral (normal conversation, no strong indicators)
    - 8-10: Positive (good coping, gratitude, progress)

    Award points based on:
    - Positive coping strategies mentioned: +5 points
    - Expressing gratitude: +3 points
    - Seeking help appropriately: +4 points
    - Self-reflection and insight: +3 points
    - Concerning thoughts: -2 points

    Conversation messages: ${JSON.stringify(messages)}

    Respond with ONLY a JSON object: {"points": number, "reason": "brief explanation", "wellness_score": number}
    `;

    // Call Groq API for analysis
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a mental health assessment AI that provides wellness scoring.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', await response.text());
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = data.choices[0].message.content;
    
    console.log('Analysis result:', analysisResult);

    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(analysisResult);
    } catch (e) {
      // Fallback if JSON parsing fails
      analysis = { points: 2, reason: "General conversation participation", wellness_score: 6 };
    }

    // Store wellness points if any were awarded
    if (analysis.points && analysis.points !== 0) {
      await supabase
        .from('wellness_points')
        .insert({
          user_id: user.id,
          points: analysis.points,
          source: 'chat_analysis',
          description: analysis.reason
        });

      console.log(`Awarded ${analysis.points} wellness points: ${analysis.reason}`);
    }

    return new Response(JSON.stringify({ 
      success: true,
      points_awarded: analysis.points || 0,
      reason: analysis.reason,
      wellness_score: analysis.wellness_score
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-wellness function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});