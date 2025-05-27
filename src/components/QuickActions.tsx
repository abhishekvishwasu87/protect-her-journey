
import { Phone, MapPin, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const QuickActions = () => {
  const { toast } = useToast();

  const actions = [
    {
      icon: Phone,
      label: "Call Emergency",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      action: () => {
        toast({
          title: "Emergency Call",
          description: "Redirecting to emergency services...",
        });
      }
    },
    {
      icon: MapPin,
      label: "Share Location",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      action: () => {
        toast({
          title: "Location Shared",
          description: "Your current location has been shared with emergency contacts.",
        });
      }
    },
    {
      icon: Shield,
      label: "Fake Call",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      action: () => {
        toast({
          title: "Fake Call Started",
          description: "Incoming fake call initiated to help you exit uncomfortable situations.",
        });
      }
    },
    {
      icon: Users,
      label: "Alert Contacts",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      action: () => {
        toast({
          title: "Contacts Alerted",
          description: "Your emergency contacts have been notified of your status.",
        });
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
