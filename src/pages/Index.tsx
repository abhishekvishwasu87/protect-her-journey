
import { useState } from "react";
import { Shield, Heart, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import EmergencyButton from "@/components/EmergencyButton";
import QuickActions from "@/components/QuickActions";
import SafetyTips from "@/components/SafetyTips";
import EmergencyContacts from "@/components/EmergencyContacts";
import AuthForm from "@/components/AuthForm";

const Index = () => {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const [isSOSActive, setIsSOSActive] = useState(false);

  const handleEmergencySOS = () => {
    setIsSOSActive(true);
    
    // Automatically deactivate after 5 seconds
    setTimeout(() => {
      setIsSOSActive(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading SafeGuard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SafeGuard
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user.user_metadata?.full_name || user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Emergency Section */}
        <section className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">Stay Safe, Stay Connected</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your personal safety companion with real emergency SMS alerts, location sharing, and peace of mind tools.
            </p>
          </div>
          
          <EmergencyButton 
            onActivate={handleEmergencySOS}
            isActive={isSOSActive}
          />
        </section>

        {/* Quick Actions Grid */}
        <QuickActions />

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <EmergencyContacts />
          
          {/* Safety Tips */}
          <SafetyTips />
        </div>

        {/* Safety Checklist */}
        <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span>Daily Safety Checklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Share your location with trusted contacts",
                "Check in with family/friends regularly",
                "Keep your phone charged and emergency contacts updated",
                "Stay aware of your surroundings",
                "Trust your instincts and prioritize your safety"
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-purple-100 mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-600">
            Remember: In a real emergency, always call your local emergency services first.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            SafeGuard is designed to complement, not replace, official emergency services.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
