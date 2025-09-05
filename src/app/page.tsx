"use client"

import { useState, useCallback, useEffect } from "react" // 1. Import useEffect
import AudioControls from "@/components/audio-controls"
import { usePolly } from "@/hooks/usePolly"
import TabsSelector from "./components/TabsSelector"
import NumberInput from "./components/NumberInput"
import Illustration from "@/components/illustration"
import { generateRandomNumber } from "@/lib/utils"



// 数字转换为语音文本的函数
const numberToSpeechText = (number: string): string => {
  return number.split('').join(', ');
};

export default function ListenumApp() {
  const [inputValue, setInputValue] = useState("")
  // 2. Initialize with a neutral, non-random value
  const [currentNumber, setCurrentNumber] = useState("");
  const [tabValue, setTabValue] = useState("number");

  // 3. Generate the number client-side after the initial render
  useEffect(() => {
    // This code only runs in the browser, not on the server.
    generateNewNumber();
  }, []); // The empty array [] ensures this runs only once on mount

  // Pass an empty string if currentNumber isn't ready yet to avoid errors
  const audioUrl = usePolly(currentNumber ? numberToSpeechText(currentNumber) : "");

  const generateNewNumber = useCallback(() => {
    const newNumber = generateRandomNumber();
    setCurrentNumber(newNumber);
    setInputValue(""); // 清空输入框
  }, []);

  const handleCheck = useCallback(() => {
    const isCorrect = inputValue.trim() === currentNumber;
    
    if (isCorrect) {
      // 显示正确提示，然后生成新数字
      setTimeout(() => {
        generateNewNumber();
      }, 1500); // 1.5秒后生成新数字
    }
    
    return isCorrect;
  }, [inputValue, currentNumber, generateNewNumber]);

  // Optional: You can add a loading state to prevent a flash of content
  if (!currentNumber) {
    return null; // or a loading spinner <Spinner />
  }

  return (
    <>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <TabsSelector value={tabValue} onChange={setTabValue} />

        <h1 className="text-3xl font-semibold mb-8 text-[#141414]">
          Listen to the number and type it out
        </h1>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
          <Illustration />
          <NumberInput 
            value={inputValue} 
            onChange={setInputValue} 
            onCheck={handleCheck}
            currentNumber={currentNumber} 
          />
        </div>

        {/* Audio Player */}
        <div className="bg-[#f2f2f2] p-1 rounded-lg flex items-center gap-4">
          <AudioControls audioUrl={audioUrl} />
        </div>
      </main>
    </>
  )
}