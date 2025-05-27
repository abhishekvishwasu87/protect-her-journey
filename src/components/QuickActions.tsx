
import { Phone, MapPin, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const QuickActions = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const shareLocation = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      });
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { data: contacts } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id);

      if (!contacts || contacts.length === 0) {
        toast({
          title: "No Emergency Contacts",
          description: "Please add emergency contacts first.",
          variant: "destructive",
        });
        return;
      }

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      await supabase.functions.invoke('send-emergency-sms', {
        body: {
          contacts,
          message: "I'm sharing my current location with you for safety.",
          location
        }
      });

      toast({
        title: "Location Shared",
        description: `Your location has been shared with ${contacts.length} emergency contact(s).`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to share location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const actions = [
    {
      icon: Phone,
      label: "Call 911",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      action: () => {
        window.open('tel:911', '_self');
      }
    },
    {
      icon: MapPin,
      label: "Share Location",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      action: shareLocation
    },
    {
      icon: Shield,
      label: "Fake Call",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      action: () => {
        // Simulate incoming call screen
        const fakeCall = window.open('', '_blank', 'width=300,height=500');
        if (fakeCall) {
          fakeCall.document.write(`
            <div style="background: black; color: white; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: Arial;">
              <div style="font-size: 24px; margin-bottom: 20px;">📞 Incoming Call</div>
              <div style="font-size: 18px; margin-bottom: 10px;">Mom</div>
              <div style="font-size: 14px; color: #ccc;">Mobile</div>
              <div style="margin-top: 50px;">
                <button onclick="window.close()" style="background: green; color: white; border: none; padding: 15px 30px; border-radius: 50px; margin: 10px; font-size: 16px;">Accept</button>
                <button onclick="window.close()" style="background: red; color: white; border: none; padding: 15px 30px; border-radius: 50px; margin: 10px; font-size: 16px;">Decline</button>
              </div>
            </div>
          `);
        }
        toast({
          title: "Fake Call Started",
          description: "Fake incoming call initiated to help you exit uncomfortable situations.",
        });
      }
    },
    {
      icon: Users,
      label: "Alert Contacts",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      action: async () => {
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to use this feature.",
            variant: "destructive",
          });
          return;
        }

        try {
          const { data: contacts } = await supabase
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', user.id);

          if (!contacts || contacts.length === 0) {
            toast({
              title: "No Emergency Contacts",
              description: "Please add emergency contacts first.",
              variant: "destructive",
            });
            return;
          }

          await supabase.functions.invoke('send-emergency-sms', {
            body: {
              contacts,
              message: "This is a safety check-in. I wanted to let you know my current status.",
              location: null
            }
          });

          toast({
            title: "Contacts Alerted",
            description: `Safety check-in sent to ${contacts.length} emergency contact(s).`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to alert contacts. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  ];

  return (
    <section>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <Button
                onClick={action.action}
                className={`w-full h-20 flex flex-col space-y-2 ${action.color} ${action.hoverColor} text-white transition-all duration-200 hover:scale-105`}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
