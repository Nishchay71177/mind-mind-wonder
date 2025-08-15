import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MoodTracker from "@/components/MoodTracker";
import heroImage from "@/assets/hero-wellness.jpg";
import { Heart, MessageCircle, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-wellness overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          src={heroImage}
          alt="Peaceful wellness background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Mind<span className="text-therapeutic">Guard</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl">
            Your AI-powered mental health companion. Track your mood, get personalized insights, 
            and access support whenever you need it.
          </p>
        </div>

        <div className="animate-slide-up delay-300 mb-12">
          <MoodTracker />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl animate-slide-up delay-500">
          <FeatureCard
            icon={<Heart className="w-8 h-8 text-therapeutic" />}
            title="Mood Tracking"
            description="Daily check-ins with intelligent mood analysis"
          />
          <FeatureCard
            icon={<MessageCircle className="w-8 h-8 text-calm" />}
            title="AI Support"
            description="24/7 companion for guidance and conversation"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-wellness" />}
            title="Progress Insights"
            description="Personalized analytics for your wellness journey"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-card/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-float">
      <div className="mb-4 animate-pulse-soft">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
};

export default HeroSection;