"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // 1. Import the useToast hook
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onCheck: () => boolean;
  currentNumber: string;
};

export default function NumberInput({ value, onChange, onCheck, currentNumber }: Props) {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast(); // 2. Get the toast function from the hook

  const handleCheck = async () => {
    setIsChecking(true);
    
    // Short delay for UI feedback
    setTimeout(() => {
      const isCorrect = onCheck();

      // 3. Call toast with an object configuration
      if (isCorrect) {
        toast({
          variant:"success",
          title: "Correct! 🎉",
          description: `Well done! The answer was ${currentNumber}.`,
          duration: 1500,
        });
      } else {
        toast({
          variant: "destructive", // Use the destructive variant for errors
          title: "Wrong! 😔",
          description: "Try again! Listen carefully to the audio.",
          duration: 2000,
        });
      }

      setIsChecking(false);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking && value.trim()) {
      handleCheck();
    }
  };

  return (
    <div className="relative">
      <h2 className="text-4xl font-bold mb-6 text-[#141414]">
        {currentNumber.length} digit{currentNumber.length > 1 ? 's' : ''} number
      </h2>
      
      <div className="flex gap-2 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Type the number here"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-[#f2f2f2] border-0 transition-all duration-200"
            disabled={isChecking}
          />
        </div>
        <Button 
          className={`px-6 transition-all duration-300 ${
            isChecking 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#789978] hover:bg-[#6a8a6a] active:bg-[#5a7a5a]'
          } text-white`}
          onClick={handleCheck}
          disabled={isChecking || !value.trim()}
        >
          {isChecking ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Checking...
            </div>
          ) : (
            'Check'
          )}
        </Button>
      </div>
    </div>
  );
}