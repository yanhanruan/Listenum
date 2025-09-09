// "use client"

// import { useState, useRef, useEffect } from "react"; // 1. Import useEffect
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Search } from "lucide-react";

// type Props = {
//   value: string;
//   onChange: (val: string) => void;
//   onCheck: () => boolean;
//   currentNumber: string;
// };

// export default function NumberInput({ value, onChange, onCheck, currentNumber }: Props) {
//   const [isChecking, setIsChecking] = useState(false);
//   const { toast } = useToast();
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!isChecking) {
//       inputRef.current?.focus();
//     }
//   }, [isChecking]);

//   const handleCheck = async () => {
//     setIsChecking(true);
    
//     setTimeout(() => {
//       const isCorrect = onCheck();

//       if (isCorrect) {
//         toast({
//           variant:"success",
//           title: "Correct! 🎉",
//           description: `Well done! The answer was ${currentNumber}.`,
//           duration: 1500,
//         });
//       } else {
//         toast({
//           variant: "destructive",
//           title: "Wrong! 😔",
//           description: "Try again! Listen carefully to the audio.",
//           duration: 2000,
//         });
//       }

//       setIsChecking(false);
      
//     }, 300);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !isChecking && value.trim()) {
//       handleCheck();
//     }
//   };

//   return (
//     <div className="relative">
//       <h2 className="text-4xl font-bold mb-6 text-[#141414]">
//         {currentNumber.length} digit{currentNumber.length > 1 ? 's' : ''} number
//       </h2>
      
//       <div className="flex gap-2 relative">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//           <Input
//             ref={inputRef} // 
//             type="text"
//             placeholder="Type the number here"
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             onKeyPress={handleKeyPress}
//             className="pl-10 bg-[#f2f2f2] border-0 transition-all duration-200"
//             disabled={isChecking}
//           />
//         </div>
//         <Button 
//           className={`px-6 transition-all duration-300 ${
//             isChecking 
//               ? 'bg-gray-400 cursor-not-allowed' 
//               : 'bg-[#789978] hover:bg-[#6a8a6a] active:bg-[#5a7a5a]'
//           } text-white`}
//           onClick={handleCheck}
//           disabled={isChecking || !value.trim()}
//         >
//           {isChecking ? (
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//               Checking...
//             </div>
//           ) : (
//             'Check'
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }


// 文件: components/NumberInput.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useEffect } from "react";
// ...其他 imports

type Props = {
  value: string;
  onChange: (val: string) => void;
  onCheck: () => void; // 回调函数
  currentNumber: string;
  isChecking: boolean; // 从 props 接收
};

export default function NumberInput({ value, onChange, onCheck, currentNumber, isChecking }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isChecking) {
      inputRef.current?.focus();
    }
  }, [isChecking]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChecking && value.trim()) {
      onCheck();
    }
  };

  return (
    <div className="relative">
      <h2 className="text-4xl ...">
        {currentNumber.length} digit{currentNumber.length > 1 ? 's' : ''} number
      </h2>
      
      <div className="flex gap-2 relative">
        <div className="relative flex-1">
          {/* ... Search Icon ... */}
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type the number here"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 ..."
            disabled={isChecking}
          />
        </div>
        <Button 
          className={`px-6 ...`}
          onClick={onCheck}
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