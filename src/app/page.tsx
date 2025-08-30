"use client"

import { useState } from "react"
import AudioControls from "@/components/audio-controls"
import { usePolly } from "@/hooks/usePolly"
import TabsSelector from "./components/TabsSelector"
import NumberInput from "./components/NumberInput"
import Illustration from "@/components/illustration"

export default function ListenumApp() {
  const [inputValue, setInputValue] = useState("")
  const audioUrl = usePolly("I like Zhiling Jiang.I like Zhiling Jiang.I like Zhiling Jiang.I like Zhiling Jiang.I like Zhiling Jiang");
  const [tabValue, setTabValue] = useState("number");

  const handleCheck = () => {
    console.log("Checking input value:", inputValue);
  };

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
          <NumberInput value={inputValue} onChange={setInputValue} onCheck={handleCheck} />
        </div>

        {/* Audio Player */}
        <div className="bg-[#f2f2f2] p-1 rounded-lg flex items-center gap-4">
          <AudioControls audioUrl={audioUrl} />
        </div>
      </main>
    </>
  )
}

