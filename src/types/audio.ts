export interface AudioState {
    isPlaying: boolean;
    progress: number;
    duration: number;
    playbackRate: number;
    isLoading: boolean;
    error?: string;
  }
  
  export interface TTSProvider {
    id: 'aws' | 'browser';
    speak(text: string, options?: TTSOptions): Promise<TTSResult>;
  }
  
  export interface TTSOptions {
    playbackRate?: number;
    voice?: string;
    lang?: string;
  }
  
  export interface TTSResult {
    type: 'url' | 'direct';
    audioUrl?: string;
    duration?: number;
    provider: 'aws' | 'browser';
  }