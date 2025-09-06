"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import AudioControls, { AudioControlsHandle } from "@/components/audio-controls";
import { usePolly } from "@/hooks/usePolly";
import TabsSelector from "./components/TabsSelector";
import NumberInput from "./components/NumberInput";
import Illustration from "@/components/illustration";
import { generateRandomNumber } from "@/lib/utils";

export default function ListenumApp() {
  const [inputValue, setInputValue] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [tabValue, setTabValue] = useState("number");
  const audioControlsRef = useRef<AudioControlsHandle>(null);

  // Ref to track if the initial audio has been handled to prevent autoplay on load.
  const hasHandledFirstAudio = useRef(false);

  const { audioUrl, isLoading } = usePolly(currentNumber);

  const generateNewNumber = useCallback(() => {
    const newNumber = generateRandomNumber();
    setCurrentNumber(newNumber);
    setInputValue("");
  }, []);
  
  // Generate the first number on component mount.
  useEffect(() => {
    generateNewNumber();
  }, [generateNewNumber]);

  // Handles autoplay for new audio clips.
  useEffect(() => {
    if (audioUrl && !isLoading) {
      // Skip the very first audio clip to prevent autoplay on initial load.
      if (!hasHandledFirstAudio.current) {
        hasHandledFirstAudio.current = true;
        return;
      }
      
      // Autoplay subsequent audio clips (e.g., after a correct answer).
      audioControlsRef.current?.play();
    }
  }, [audioUrl, isLoading]);

  // Checks the user's answer.
  const handleCheck = useCallback(() => {
    const isCorrect = inputValue.trim() === currentNumber;

    if (isCorrect) {
      // After a correct answer, generate a new number, which triggers the autoplay effect.
      setTimeout(() => {
        generateNewNumber();
      }, 1500);
    } else {
      // If incorrect, replay the current audio.
      audioControlsRef.current?.replay();
    }

    return isCorrect;
  }, [inputValue, currentNumber, generateNewNumber]);
  
  if (!currentNumber) {
    return null;
  }

  return (
    <>
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

        <div className="bg-[#f2f2f2] p-1 rounded-lg flex items-center gap-4">
          <AudioControls
            ref={audioControlsRef}
            audioUrl={audioUrl}
            isLoading={isLoading}
          />
        </div>
      </main>
    </>
  );
}