import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WellnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    title: string;
    description: string;
    duration: string;
    category: string;
    type: 'meditation' | 'chat' | 'progress';
  };
}

const WellnessModal = ({ isOpen, onClose, resource }: WellnessModalProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          setProgress(((300 - newTime) / 300) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast({
        title: "Session Complete! 🎉",
        description: "Great job on completing your wellness session.",
      });
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(300);
    setProgress(0);
  };

  const renderContent = () => {
    switch (resource.type) {
      case 'meditation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-calm rounded-full flex items-center justify-center">
                <div className="text-4xl animate-pulse-soft">🧘‍♀️</div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Mindful Breathing</h3>
              <p className="text-muted-foreground">Focus on your breath and let go of tension</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-therapeutic">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={progress} className="mt-2" />
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleStart}
                    variant="therapeutic"
                    size="lg"
                  >
                    {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="lg">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {isActive && (
                  <div className="mt-4 p-4 bg-calm-light rounded-lg animate-fade-in">
                    <p className="text-center text-sm text-foreground">
                      Breathe in slowly through your nose... hold... and breathe out through your mouth.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'chat':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <div className="text-4xl">🤖</div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">AI Wellness Companion</h3>
              <p className="text-muted-foreground">Your supportive AI friend is here to listen</p>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>MindGuard:</strong> Hello! I'm here to support you today. How are you feeling?
                </p>
              </div>
              <div className="bg-therapeutic-light p-4 rounded-lg ml-8">
                <p className="text-sm">I'm feeling a bit overwhelmed with my studies lately.</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>MindGuard:</strong> That sounds challenging. It's completely normal to feel overwhelmed sometimes. 
                  Would you like to talk about what's specifically causing you stress?
                </p>
              </div>
            </div>

            <Button className="w-full bg-gradient-primary">
              Continue Conversation
            </Button>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-wellness rounded-full flex items-center justify-center">
                <div className="text-4xl">📊</div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Weekly Progress</h3>
              <p className="text-muted-foreground">Your mental wellness journey overview</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">85%</div>
                  <div className="text-sm text-muted-foreground">Check-in Rate</div>
                  <Badge variant="secondary" className="mt-1">Excellent</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-wellness">7.2</div>
                  <div className="text-sm text-muted-foreground">Avg Mood</div>
                  <Badge variant="secondary" className="mt-1">Good</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-therapeutic">12</div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                  <Badge variant="secondary" className="mt-1">Active</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-calm">4</div>
                  <div className="text-sm text-muted-foreground">Streak Days</div>
                  <Badge variant="secondary" className="mt-1">Growing</Badge>
                </CardContent>
              </Card>
            </div>

            <Button className="w-full bg-gradient-primary">
              <CheckCircle className="w-4 h-4 mr-2" />
              View Detailed Report
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="secondary">{resource.category}</Badge>
            {resource.title}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default WellnessModal;