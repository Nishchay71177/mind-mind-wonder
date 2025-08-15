import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Heart, CheckCircle, Calendar } from "lucide-react";

export interface MoodEntry {
  id: string;
  mood: number;
  label: string;
  emoji: string;
  note?: string;
  timestamp: Date;
}

interface MoodTrackerProps {
  onMoodSelect?: (mood: MoodEntry) => void;
}

const MoodTracker = ({ onMoodSelect }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const moods = [
    { emoji: "😊", label: "Great", color: "bg-success", value: 5 },
    { emoji: "🙂", label: "Good", color: "bg-wellness", value: 4 },
    { emoji: "😐", label: "Okay", color: "bg-calm", value: 3 },
    { emoji: "😔", label: "Low", color: "bg-warning", value: 2 },
    { emoji: "😢", label: "Difficult", color: "bg-destructive", value: 1 },
  ];

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
  };

  const handleSubmitMood = () => {
    if (selectedMood === null) return;

    const selectedMoodData = moods.find(m => m.value === selectedMood);
    if (!selectedMoodData) return;

    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      label: selectedMoodData.label,
      emoji: selectedMoodData.emoji,
      note: note.trim() || undefined,
      timestamp: new Date(),
    };

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    const updatedEntries = [moodEntry, ...existingEntries].slice(0, 30); // Keep last 30 entries
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));

    onMoodSelect?.(moodEntry);
    
    toast({
      title: "Mood Logged! 🎉",
      description: `You're feeling ${selectedMoodData.label.toLowerCase()} today. Take care of yourself!`,
    });

    setIsDialogOpen(false);
    setSelectedMood(null);
    setNote("");
  };

  return (
    <Card className="p-8 backdrop-blur-sm bg-card/90 border-0 shadow-2xl">
      <h3 className="text-2xl font-semibold mb-6 text-card-foreground">
        How are you feeling today?
      </h3>
      
      <div className="flex gap-4 justify-center mb-6">
        {moods.map((mood) => (
          <Button
            key={mood.value}
            variant={selectedMood === mood.value ? "therapeutic" : "outline"}
            size="lg"
            className="h-16 w-16 rounded-full border-2 hover:scale-110 transition-all duration-300"
            onClick={() => handleMoodSelect(mood.value)}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </Button>
        ))}
      </div>

      {selectedMood && (
        <div className="text-center mb-4">
          <Badge variant="secondary" className="mb-2">
            Feeling {moods.find(m => m.value === selectedMood)?.label}
          </Badge>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-gradient-primary text-primary-foreground px-8 py-3 hover:scale-105 transition-all duration-300"
            disabled={selectedMood === null}
          >
            <Heart className="w-4 h-4 mr-2" />
            Check In Now
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-therapeutic" />
              Complete Your Check-In
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">
                {moods.find(m => m.value === selectedMood)?.emoji}
              </span>
              <p className="text-lg font-medium mt-2">
                You're feeling {moods.find(m => m.value === selectedMood)?.label}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Want to add a note? (Optional)
              </label>
              <Textarea
                placeholder="What's on your mind today?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleSubmitMood}
              className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Check-In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MoodTracker;