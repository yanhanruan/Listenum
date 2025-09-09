// "use client";

// import { useState, useCallback, useEffect, useRef } from "react";
// import AudioControls, { AudioControlsHandle } from "@/components/audio-controls";
// import { usePolly } from "@/hooks/usePolly";
// import TabsSelector from "./components/TabsSelector";
// import NumberInput from "./components/NumberInput";
// import Illustration from "@/components/illustration";
// import { generateRandomNumber } from "@/lib/utils";

// export default function ListenumApp() {
//   const [inputValue, setInputValue] = useState("");
//   const [currentNumber, setCurrentNumber] = useState("");
//   const [tabValue, setTabValue] = useState("number");
//   const audioControlsRef = useRef<AudioControlsHandle>(null);

//   // Ref to track if the initial audio has been handled to prevent autoplay on load.
//   const hasHandledFirstAudio = useRef(false);

//   const { audioUrl, isLoading } = usePolly(currentNumber);

//   const generateNewNumber = useCallback(() => {
//     const newNumber = generateRandomNumber();
//     setCurrentNumber(newNumber);
//     setInputValue("");
//   }, []);
  
//   // Generate the first number on component mount.
//   useEffect(() => {
//     generateNewNumber();
//   }, [generateNewNumber]);

//   // Handles autoplay for new audio clips.
//   useEffect(() => {
//     if (audioUrl && !isLoading) {
//       // Skip the very first audio clip to prevent autoplay on initial load.
//       if (!hasHandledFirstAudio.current) {
//         hasHandledFirstAudio.current = true;
//         return;
//       }
      
//       // Autoplay subsequent audio clips (e.g., after a correct answer).
//       audioControlsRef.current?.play();
//     }
//   }, [audioUrl, isLoading]);

//   // Checks the user's answer.
//   const handleCheck = useCallback(() => {
//     const isCorrect = inputValue.trim() === currentNumber;

//     if (isCorrect) {
//       // After a correct answer, generate a new number, which triggers the autoplay effect.
//       setTimeout(() => {
//         generateNewNumber();
//       }, 1500);
//     } else {
//       // If incorrect, replay the current audio.
//       audioControlsRef.current?.replay();
//     }

//     return isCorrect;
//   }, [inputValue, currentNumber, generateNewNumber]);
  
//   if (!currentNumber) {
//     return null;
//   }

//   return (
//     <>
//       <main className="max-w-4xl mx-auto px-4 py-8">
//         <TabsSelector value={tabValue} onChange={setTabValue} />

//         <h1 className="text-3xl font-semibold mb-8 text-[#141414]">
//           Listen to the number and type it out
//         </h1>

//         <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
//           <Illustration />
//           <NumberInput
//             value={inputValue}
//             onChange={setInputValue}
//             onCheck={handleCheck}
//             currentNumber={currentNumber}
//           />
//         </div>

//         <div className="bg-[#f2f2f2] p-1 rounded-lg flex items-center gap-4">
//           <AudioControls
//             ref={audioControlsRef}
//             audioUrl={audioUrl}
//             isLoading={isLoading}
//           />
//         </div>
//       </main>
//     </>
//   );
// }

// ----------------------------------------------------------------------------------------------------------------------------

// 文件: page.tsx

// "use client";

// import { useState, useCallback, useEffect, useRef } from "react";
// import AudioControls from "@/components/audio-controls";
// import NumberInput from "./components/NumberInput";
// import { useToast } from "@/hooks/use-toast";
// import { useTts } from "@/hooks/useTts"; // 导入我们强大的新 Hook
// import { generateRandomNumber } from "@/lib/utils";
// // ... 其他 imports

// export default function ListenumApp() {
//   const [inputValue, setInputValue] = useState("");
//   const [currentNumber, setCurrentNumber] = useState("");
//   const [isChecking, setIsChecking] = useState(false);
//   const { toast } = useToast();
  
//   // 使用 useTts Hook
//   const { state: ttsState, actions: ttsActions } = useTts(currentNumber);

//   const hasHandledFirstAudio = useRef(false);

//   const handlePlayPause = useCallback(() => {
//     if(ttsState.isPlaying) {
//         ttsActions.pause();
//     } else {
//         ttsActions.play();
//     }
// }, [ttsState.isPlaying, ttsActions.play, ttsActions.pause]);

//   // 生成新号码的逻辑
//   const generateNewNumber = useCallback(() => {
//     const newNumber = generateRandomNumber();
//     setCurrentNumber(newNumber);
//     setInputValue("");
//   }, []);
  
//   // 首次加载时生成号码
//   useEffect(() => {
//     generateNewNumber();
//   }, [generateNewNumber]);

//   // 自动播放逻辑
//   useEffect(() => {
//     if (!ttsState.isLoading && (ttsState.audioUrl || ttsState.isBrowserTts)) {
//       if (!hasHandledFirstAudio.current) {
//         hasHandledFirstAudio.current = true;
//         return;
//       }
//       ttsActions.play();
//     }
//   }, [ttsState.isLoading, ttsState.audioUrl, ttsState.isBrowserTts, ttsActions.play]);


//   // 检查答案的逻辑 (包含 Toast 和状态管理)
//   const handleCheck = useCallback(() => {
//     if (isChecking) return;
//     setIsChecking(true);
    
//     setTimeout(() => {
//       const isCorrect = inputValue.trim() === currentNumber;

//       if (isCorrect) {
//         toast({
//           variant:"success",
//           title: "Correct! 🎉",
//           description: `Well done! The answer was ${currentNumber}.`,
//           duration: 1500,
//         });
//         // 延迟生成新号码，给提示留出显示时间
//         setTimeout(generateNewNumber, 1500);
//       } else {
//         toast({
//           variant: "destructive",
//           title: "Wrong! 😔",
//           description: "Try again! Listen carefully to the audio.",
//           duration: 2000,
//         });
//         ttsActions.replay(); // 答案错误时重听
//       }

//       setIsChecking(false);
//     }, 300);
//   }, [isChecking, inputValue, currentNumber, toast, generateNewNumber, ttsActions.replay]);
  
//   if (!currentNumber) {
//     return null; // 或者显示一个加载指示器
//   }

  

//   return (
//     <>
//       <main className="max-w-4xl mx-auto px-4 py-8">
//         {/* ... TabsSelector, h1, Illustration (保持不变) ... */}
        
//         <NumberInput
//           value={inputValue}
//           onChange={setInputValue}
//           onCheck={handleCheck}
//           currentNumber={currentNumber}
//           isChecking={isChecking}
//         />

//         <div className="bg-[#f2f2f2] p-1 rounded-lg flex items-center gap-4 mt-8">
//           {/* 仅在需要时渲染 audio 元素 */}
//           {ttsState.audioUrl && (
//             <audio 
//               ref={ttsActions.attachAudioRef} 
//               src={ttsState.audioUrl} 
//               preload="auto"
//               // 可以将 playbackRate 直接绑定
//               onRateChange={(e) => ttsActions.changeSpeed(e.currentTarget.playbackRate)}
//             />
//           )}
//           <AudioControls
//             state={ttsState}
//             actions={{
//                 onPlayPause: handlePlayPause,
//                 onReplay: ttsActions.replay,
//                 onSeek: ttsActions.seek,
//                 onChangeSpeed: ttsActions.changeSpeed,
//             }}
//           />
//         </div>
//       </main>
//     </>
//   );
// }


// pages/enhanced-listenum-app.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { EnhancedAudioControls, AudioControlsHandle } from "@/components/enhanced-audio-controls";
import EnhancedNumberInput from "@/components/enhanced-number-input";
import { useEnhancedTTS } from "@/hooks/useEnhancedTTS";
import { useNumberInput } from "@/hooks/useNumberInput";
import TabsSelector from "./components/TabsSelector";
import Illustration from "@/components/illustration";
import { generateRandomNumber } from "@/lib/utils";

export default function EnhancedListenumApp() {
  const [currentNumber, setCurrentNumber] = useState("");
  const [tabValue, setTabValue] = useState("number");
  const audioControlsRef = useRef<AudioControlsHandle>(null);
  
  // 使用数据管理hooks
  const numberInput = useNumberInput();
  const { audioUrl, ttsResult, audioStore, regenerateAudio } = useEnhancedTTS(currentNumber);
  
  // 用于跟踪是否是首次加载，防止自动播放
  const hasHandledFirstAudio = useRef(false);

  const generateNewNumber = useCallback(() => {
    const newNumber = generateRandomNumber();
    setCurrentNumber(newNumber);
    numberInput.reset();
  }, [numberInput.reset]);
  
  // 初始化时生成第一个数字
  useEffect(() => {
    generateNewNumber();
  }, [generateNewNumber]);

  // 处理自动播放逻辑
  useEffect(() => {
    if ((audioUrl || ttsResult?.type === 'direct') && !audioStore.isLoading) {
      // 跳过首次加载时的自动播放
      if (!hasHandledFirstAudio.current) {
        hasHandledFirstAudio.current = true;
        return;
      }
      
      // 自动播放后续的音频（例如答对后的新题目）
      setTimeout(() => {
        audioControlsRef.current?.play();
      }, 100);
    }
  }, [audioUrl, ttsResult, audioStore.isLoading]);

  // 检查用户答案
  const handleCheck = useCallback(() => {
    const isCorrect = numberInput.inputValue.trim() === currentNumber;

    if (isCorrect) {
      // 答对后延迟生成新数字
      setTimeout(() => {
        generateNewNumber();
      }, 1500);
    } else {
      // 答错后重播当前音频
      setTimeout(() => {
        audioControlsRef.current?.replay();
      }, 500);
    }

    return isCorrect;
  }, [numberInput.inputValue, currentNumber, generateNewNumber]);

  // 处理播放速度变化（主要用于Browser TTS）
  const handlePlaybackRateChange = useCallback(async (rate: number) => {
    if (ttsResult?.type === 'direct') {
      // Browser TTS需要重新生成音频
      await regenerateAudio(rate);
    }
  }, [ttsResult, regenerateAudio]);
  
  if (!currentNumber) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <TabsSelector value={tabValue} onChange={setTabValue} />

      <h1 className="text-3xl font-semibold mb-8 text-[#141414]">
        Listen to the number and type it out
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <Illustration />
        <EnhancedNumberInput
          currentNumber={currentNumber}
          numberInput={numberInput}
          onCheck={handleCheck}
        />
      </div>

      <div className="bg-[#f2f2f2] p-1 rounded-lg flex items-center gap-4">
        <EnhancedAudioControls
          ref={audioControlsRef}
          audioUrl={audioUrl}
          ttsResult={ttsResult}
          currentText={currentNumber}
          audioStore={audioStore}
          onPlaybackRateChange={handlePlaybackRateChange}
        />
      </div>

      {/* 调试信息 (可选) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>Current Number: {currentNumber}</p>
          <p>Input Value: {numberInput.inputValue}</p>
          <p>TTS Provider: {ttsResult?.provider || 'none'}</p>
          <p>TTS Type: {ttsResult?.type || 'none'}</p>
          <p>Audio Store - Playing: {audioStore.isPlaying}</p>
          <p>Audio Store - Loading: {audioStore.isLoading}</p>
          <p>Audio Store - Progress: {audioStore.progress.toFixed(1)}s / {audioStore.duration.toFixed(1)}s</p>
          <p>Audio Store - Rate: {audioStore.playbackRate}x</p>
          {audioStore.error && <p className="text-red-600">Error: {audioStore.error}</p>}
        </div>
      )} */}
    </main>
  );
}