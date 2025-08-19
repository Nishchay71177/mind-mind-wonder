import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, BookOpen, Headphones, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const WellnessHub = () => {
  const resources = [
    {
      title: "Mindfulness Meditation",
      description: "Guided meditation sessions to help you find peace and clarity",
      icon: <Headphones className="w-6 h-6" />,
      category: "Meditation",
      rating: 4.8,
      duration: "5-20 min"
    },
    {
      title: "Breathing Exercises",
      description: "Simple breathing techniques for stress relief and relaxation",
      icon: <Heart className="w-6 h-6" />,
      category: "Breathing",
      rating: 4.9,
      duration: "3-10 min"
    },
    {
      title: "Mental Health Articles",
      description: "Evidence-based articles on mental health and wellbeing",
      icon: <BookOpen className="w-6 h-6" />,
      category: "Reading",
      rating: 4.7,
      duration: "5-15 min"
    },
    {
      title: "Community Support",
      description: "Connect with others on similar wellness journeys",
      icon: <Users className="w-6 h-6" />,
      category: "Community",
      rating: 4.6,
      duration: "Ongoing"
    }
  ];

  const quickTips = [
    "Take 3 deep breaths when feeling overwhelmed",
    "Practice gratitude by listing 3 things you're thankful for",
    "Step outside for a few minutes to get fresh air",
    "Reach out to a friend or family member",
    "Listen to calming music or nature sounds"
  ];

  return (
    <main className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-wellness" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Wellness Hub</h1>
              <p className="text-muted-foreground">Your mental health resource center</p>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-wellness" />
              Quick Wellness Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="p-4 bg-card/50 rounded-lg border">
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-therapeutic/10 rounded-lg text-therapeutic">
                      {resource.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{resource.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 fill-current" />
                          {resource.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Duration: {resource.duration}
                  </span>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Resources */}
        <Card className="mt-8 border-therapeutic/20">
          <CardHeader>
            <CardTitle className="text-therapeutic">Need Immediate Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you're experiencing a mental health crisis, please reach out for professional help:
            </p>
            <div className="space-y-2">
              <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
              <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
              <p><strong>Emergency Services:</strong> 911</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default WellnessHub;