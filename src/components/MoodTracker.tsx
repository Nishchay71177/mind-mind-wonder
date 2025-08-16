import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface MoodEntry {
  id: string;
  mood_value: number;
  mood_label: string;
  mood_emoji: string;
  note?: string;
  created_at: string;
}

interface MoodTrackerProps {
  user: SupabaseUser;
}

const moods = [
  { value: 1, label: "Very Low", emoji: "😢", color: "#ef4444" },
  { value: 2, label: "Low", emoji: "😔", color: "#f97316" },
  { value: 3, label: "Neutral", emoji: "😐", color: "#eab308" },
  { value: 4, label: "Good", emoji: "😊", color: "#84cc16" },
  { value: 5, label: "Great", emoji: "😄", color: "#22c55e" },
];

const MoodTracker = ({ user }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [note, setNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMoodHistory();
  }, []);

  useEffect(() => {
    if (moodHistory.length > 0) {
      generateWeeklyData();
    }
  }, [moodHistory]);

  const loadMoodHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMoodHistory(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load mood history",
        variant: "destructive",
      });
    }
  };

  const generateWeeklyData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEntries = moodHistory.filter(entry => 
        entry.created_at.split('T')[0] === dateStr
      );
      
      const averageMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, entry) => sum + entry.mood_value, 0) / dayEntries.length
        : 0;
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: parseFloat(averageMood.toFixed(1)),
        date: dateStr
      });
    }
    
    setWeeklyData(last7Days);
  };

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood);
  };

  const handleSubmitMood = async () => {
    if (!selectedMood) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_value: selectedMood.value,
          mood_label: selectedMood.label,
          mood_emoji: selectedMood.emoji,
          note: note.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Mood logged!",
        description: `Your ${selectedMood.label.toLowerCase()} mood has been recorded.`,
      });

      // Reset form and close dialog
      setSelectedMood(null);
      setNote("");
      setIsDialogOpen(false);
      
      // Reload mood history
      loadMoodHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log mood entry",
        variant: "destructive",
      });
    }
  };

  const getBarColor = (moodValue: number) => {
    const mood = moods.find(m => m.value === Math.round(moodValue));
    return mood?.color || "#64748b";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMood?.value === mood.value ? "default" : "outline"}
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => handleMoodSelect(mood)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full" 
                disabled={!selectedMood}
                variant="default"
              >
                Log Mood
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Complete Your Mood Check-In</DialogTitle>
              </DialogHeader>
              {selectedMood && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{selectedMood.emoji}</div>
                    <h3 className="text-lg font-medium">Feeling {selectedMood.label}</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Add a note (optional)
                    </label>
                    <Textarea
                      placeholder="What's on your mind? How was your day?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSubmitMood} className="w-full">
                    Complete Check-In
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {weeklyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Mood Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 5]} />
                  <Bar dataKey="mood" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBarColor(entry.mood)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              {moods.map((mood) => (
                <div key={mood.value} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: mood.color }}
                  />
                  <span>{mood.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodTracker;