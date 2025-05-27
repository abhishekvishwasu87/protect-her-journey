
import { useState } from "react";
import { Shield, ChevronRight, Home, Car, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SafetyTips = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', name: 'General', icon: Shield },
    { id: 'home', name: 'Home Safety', icon: Home },
    { id: 'travel', name: 'Travel Safety', icon: Car },
    { id: 'public', name: 'Public Places', icon: MapPin }
  ];

  const tips = {
    general: [
      "Trust your instincts - if something feels wrong, remove yourself from the situation",
      "Stay alert and aware of your surroundings at all times",
      "Keep your phone charged and easily accessible",
      "Share your location with trusted friends and family",
      "Learn basic self-defense techniques"
    ],
    home: [
      "Always lock doors and windows, even when you're home",
      "Install good lighting around entrances and walkways",
      "Don't open the door for unexpected visitors",
      "Have a security system or doorbell camera if possible",
      "Keep emergency numbers easily accessible"
    ],
    travel: [
      "Research your destination and safe areas beforehand",
      "Share your travel itinerary with someone you trust",
      "Keep copies of important documents in separate places",
      "Use reputable transportation services",
      "Stay in well-lit, populated areas when walking"
    ],
    public: [
      "Stay in well-lit, populated areas",
      "Keep your belongings secure and close to your body",
      "Avoid wearing expensive jewelry or displaying valuables",
      "Be cautious with strangers who approach you",
      "Have an exit strategy and know where you are"
    ]
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-purple-500" />
          <span>Safety Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                ${selectedCategory === category.id 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                  : 'hover:bg-purple-50'
                }
              `}
            >
              <category.icon className="w-4 h-4 mr-1" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Tips List */}
        <div className="space-y-3">
          {tips[selectedCategory as keyof typeof tips].map((tip, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        {/* Emergency Reminder */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium text-red-800">Emergency Reminder</span>
          </div>
          <p className="text-sm text-red-700">
            In case of immediate danger, call your local emergency services (911, 112, etc.) immediately.
            These tips are for prevention and general safety awareness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyTips;
