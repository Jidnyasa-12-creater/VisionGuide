import { Mic, MicOff } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function VoiceButton({ onResult, size = 'md' }: VoiceButtonProps) {
  const { isListening, startListening, stopListening } = useSpeech();

  const sizeClass = {
    sm: 'p-3 text-sm',
    md: 'p-4',
    lg: 'p-6 text-xl',
  }[size];

  const iconSize = { sm: 20, md: 26, lg: 36 }[size];

  const handleClick = () => {
    if (isListening) stopListening();
    else startListening(onResult);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClass} rounded-full font-semibold transition-all duration-200
        flex items-center justify-center gap-3
        focus:outline-none focus:ring-4 focus:ring-primary-500/50
        ${isListening
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse glow'
          : 'bg-gradient-to-br from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 text-white glow'}
      `}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <MicOff size={iconSize} /> : <Mic size={iconSize} />}
      {size === 'lg' && (
        <span>{isListening ? 'Listening… tap to stop' : 'Tap to Speak'}</span>
      )}
    </button>
  );
}
