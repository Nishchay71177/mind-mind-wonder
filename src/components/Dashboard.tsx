import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Book, Users, Brain, MessageSquare, Target } from "lucide-react";
import { useState } from "react";
import WellnessModal from "@/components/WellnessModal";
import { useToast } from "@/hooks/use-toast";
import meditationIcon from "@/assets/meditation-icon.jpg";
import chatIcon from "@/assets/chat-support-icon.jpg";
import progressIcon from "@/assets/progress-icon.jpg";

const Dashboard = () => {
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const { toast } = useToast();
  const weeklyMood = [
    { day: "Mon", mood: 4, color: "bg-success" },
    { day: "Tue", mood: 3, color: "bg-wellness" },
    { day: "Wed", mood: 5, color: "bg-success" },
    { day: "Thu", mood: 2, color: "bg-warning" },
    { day: "Fri", mood: 4, color: "bg-success" },
    { day: "Sat", mood: 3, color: "bg-wellness" },
    { day: "Sun", mood: 4, color: "bg-success" },
  ];

  const resources = [
    {
      title: "Mindfulness Meditation",
      description: "5-minute guided breathing exercise",
      duration: "5 min",
      icon: meditationIcon,
      category: "Meditation",
      type: 'meditation' as const
    },
    {
      title: "AI Wellness Chat",
      description: "Talk to your mental health companion",
      duration: "Available 24/7",
      icon: chatIcon,
      category: "Support",
      type: 'chat' as const
    },
    {
      title: "Progress Review",
      description: "Weekly wellness insights and trends",
      duration: "10 min",
      icon: progressIcon,
      category: "Analytics",
      type: 'progress' as const
    }
  ];

  const handleResourceClick = (resource: any) => {
    setSelectedResource(resource);
  };

  const handleAIConversation = () => {
    toast({
      title: "AI Companion Ready! 🤖",
      description: "Starting your conversation with MindGuard AI...",
    });
    // In a real app, this would navigate to a chat interface
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Your Wellness Dashboard</h2>
          <p className="text-xl text-muted-foreground">Track your progress and access support tools</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Mood Tracking */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-therapeutic" />
                Weekly Mood Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-4 h-32">
                {weeklyMood.map((day) => (
                  <div key={day.day} className="text-center flex-1">
                    <div
                      className={`mx-auto mb-2 rounded ${day.color} transition-all duration-300 hover:scale-110`}
                      style={{ height: `${day.mood * 20}px`, width: '20px' }}
                    />
                    <span className="text-sm text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-wellness" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Check-ins</span>
                  <span className="text-sm font-medium">6/7</span>
                </div>
                <Progress value={86} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Meditation</span>
                  <span className="text-sm font-medium">4/5</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Sleep Quality</span>
                  <span className="text-sm font-medium">7.2/10</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-foreground">Wellness Resources</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={resource.icon}
                      alt={resource.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{resource.category}</Badge>
                    <span className="text-sm text-muted-foreground">{resource.duration}</span>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-gradient-primary hover:scale-105 transition-all duration-300"
                    onClick={() => handleResourceClick(resource)}
                  >
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Companion */}
        <Card className="bg-gradient-calm">
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-16 h-16 text-calm mx-auto mb-4 animate-pulse-soft" />
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Need someone to talk to?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Your AI companion is here to listen, provide support, and offer personalized guidance 
              based on your mental health journey.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              onClick={handleAIConversation}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Conversation
            </Button>
          </CardContent>
        </Card>

        {/* Wellness Modal */}
        {selectedResource && (
          <WellnessModal
            isOpen={!!selectedResource}
            onClose={() => setSelectedResource(null)}
            resource={selectedResource}
          />
        )}
      </div>
    </section>
  );
};

export default Dashboard;