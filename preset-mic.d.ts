export interface PresetMicOptions {
  onlyFinal?: boolean;
  lang?: string;
}

export type TranscriptionCallback = (text: string, event?: SpeechRecognitionEvent) => void;
export type ErrorCallback = (error: any) => void;
export type VoidCallback = () => void;

export default class PresetMic {
  constructor(options?: PresetMicOptions);
  start(): Promise<void>;
  stop(): void;
  on(event: 'transcription', callback: TranscriptionCallback): void;
  on(event: 'start' | 'stop', callback: VoidCallback): void;
  on(event: 'error', callback: ErrorCallback): void;
}
