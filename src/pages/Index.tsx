import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, LogOut, BarChart3 } from "lucide-react";
import AuthWrapper from "@/components/AuthWrapper";
import AIChat from "@/components/AIChat";
import MoodTracker from "@/components/MoodTracker";
import Auth from "./Auth";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat' | 'mood'>('dashboard');
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const DashboardView = ({ user }: { user: SupabaseUser }) => (
    <main className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-therapeutic" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">MindGuard</h1>
              <p className="text-muted-foreground">Welcome back!</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('chat')}>
            <CardHeader className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-therapeutic" />
              <CardTitle>AI Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Chat with MindGuard, your AI mental health companion
              </p>
              <Button className="w-full">Start Conversation</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('mood')}>
            <CardHeader className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-calm" />
              <CardTitle>Mood Tracking</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Track your daily mood and see your wellness progress
              </p>
              <Button variant="outline" className="w-full">Track Mood</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = '/wellness'}>
            <CardHeader className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-wellness" />
              <CardTitle>Wellness Hub</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Access resources, tips, and wellness tools
              </p>
              <Button variant="outline" className="w-full">
                Explore Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Mental Health Journey</h2>
            <p className="text-muted-foreground">
              MindGuard is here to support your mental wellness journey. Start by tracking your mood 
              or having a conversation with our AI companion. Remember, seeking help is a sign of strength, 
              and you're not alone in this journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );

  return (
    <AuthWrapper
      fallback={<Auth />}
    >
      {(user: SupabaseUser) => {
        if (currentView === 'chat') {
          return (
            <div className="min-h-screen bg-gradient-wellness p-4">
              <div className="container mx-auto max-w-4xl">
                <AIChat user={user} onBack={() => setCurrentView('dashboard')} />
              </div>
            </div>
          );
        }

        if (currentView === 'mood') {
          return (
            <div className="min-h-screen bg-gradient-wellness p-4">
              <div className="container mx-auto max-w-4xl">
                <div className="flex items-center mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentView('dashboard')}
                    className="mr-4"
                  >
                    ← Back to Dashboard
                  </Button>
                  <h1 className="text-2xl font-bold">Mood Tracking</h1>
                </div>
                <MoodTracker user={user} />
              </div>
            </div>
          );
        }

        return <DashboardView user={user} />;
      }}
    </AuthWrapper>
  );
};

export default Index;
