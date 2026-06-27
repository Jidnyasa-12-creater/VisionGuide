import { Camera, Play, Square, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { useCamera } from '../../hooks/useCamera';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  label?: string;
}

export function CameraCapture({ onCapture, label = 'Capture & Analyze' }: CameraCaptureProps) {
  const { videoRef, startCamera, stopCamera, captureFrame, hasCamera, error } = useCamera();

  // Attach stream to video element when ready
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleCapture = () => {
    const blob = captureFrame();
    if (blob) onCapture(blob);
    else {
      // If no camera, send a placeholder blob
      onCapture(new Blob(['demo'], { type: 'image/jpeg' }));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Video feed */}
      <div className="relative rounded-2xl overflow-hidden bg-surface-900 border border-surface-700 aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${hasCamera ? 'block' : 'hidden'}`}
        />
        {!hasCamera && (
          <div className="flex flex-col items-center gap-3 text-slate-400 p-8">
            <Camera size={52} className="opacity-30" />
            <p className="text-sm text-center">
              {error || 'Camera not started. Click Start Camera below.'}
            </p>
          </div>
        )}
        {hasCamera && (
          <div className="absolute top-3 left-3">
            <span className="badge bg-red-500/90 text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!hasCamera ? (
          <button onClick={startCamera} className="btn-primary flex items-center gap-2 flex-1">
            <Play size={18} /> Start Camera
          </button>
        ) : (
          <button onClick={stopCamera} className="btn-ghost flex items-center gap-2">
            <Square size={18} /> Stop
          </button>
        )}
        <button
          onClick={handleCapture}
          className="btn-primary flex items-center gap-2 flex-1"
        >
          <Zap size={18} /> {label}
        </button>
      </div>
    </div>
  );
}
