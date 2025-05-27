
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface EmergencyButtonProps {
  onActivate: () => void;
  isActive: boolean;
}

const EmergencyButton = ({ onActivate, isActive }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePress = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use emergency features.",
        variant: "destructive",
      });
      return;
    }

    setIsPressed(true);

    try {
      // Get user's current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Get user's emergency contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id);

      if (contactsError) throw contactsError;

      if (!contacts || contacts.length === 0) {
        toast({
          title: "No Emergency Contacts",
          description: "Please add emergency contacts before using SOS.",
          variant: "destructive",
        });
        setIsPressed(false);
        return;
      }

      // Get user profile for custom message
      const { data: profile } = await supabase
        .from('profiles')
        .select('emergency_message, full_name')
        .eq('id', user.id)
        .single();

      const message = profile?.emergency_message || 'Emergency! I need help. This is my current location.';
      const userName = profile?.full_name || 'Someone';

      // Create emergency alert record
      const { error: alertError } = await supabase
        .from('emergency_alerts')
        .insert({
          user_id: user.id,
          location_lat: location.lat,
          location_lng: location.lng,
          message: `${userName}: ${message}`,
          status: 'active'
        });

      if (alertError) throw alertError;

      // Send SMS to all emergency contacts
      const { error: smsError } = await supabase.functions.invoke('send-emergency-sms', {
        body: {
          contacts,
          message: `${userName}: ${message}`,
          location
        }
      });

      if (smsError) throw smsError;

      onActivate();
      toast({
        title: "Emergency Alert Sent!",
        description: `SMS sent to ${contacts.length} emergency contact(s) with your location.`,
      });

    } catch (error: any) {
      console.error('Emergency SOS error:', error);
      toast({
        title: "Emergency Alert Failed",
        description: error.message || "Failed to send emergency alert. Please try calling emergency services directly.",
        variant: "destructive",
      });
    } finally {
      setIsPressed(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {isActive && (
          <>
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25 scale-110"></div>
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50 scale-125 animation-delay-300"></div>
          </>
        )}
        
        <Button
          onClick={handlePress}
          disabled={isPressed || isActive}
          className={`
            w-32 h-32 rounded-full text-white font-bold text-lg shadow-2xl transform transition-all duration-200
            ${isPressed ? 'scale-95' : 'scale-100 hover:scale-105'}
            ${isActive 
              ? 'bg-red-600 animate-pulse' 
              : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }
          `}
        >
          <div className="flex flex-col items-center space-y-1">
            <AlertTriangle className="w-8 h-8" />
            <span className="text-sm">
              {isPressed ? 'SENDING...' : isActive ? 'ACTIVE' : 'SOS'}
            </span>
          </div>
        </Button>
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-gray-700 font-medium">Emergency SOS</p>
        <p className="text-sm text-gray-600">
          {isActive ? 'Emergency services contacted' : 'Press to send SMS alerts with location'}
        </p>
      </div>
    </div>
  );
};

export default EmergencyButton;
