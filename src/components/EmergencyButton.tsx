
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmergencyButtonProps {
  onActivate: () => void;
  isActive: boolean;
}

const EmergencyButton = ({ onActivate, isActive }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed(true);
    setTimeout(() => {
      onActivate();
      setIsPressed(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Pulsing rings when active */}
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
          {isActive ? 'Emergency services contacted' : 'Press and hold to activate'}
        </p>
      </div>
    </div>
  );
};

export default EmergencyButton;
