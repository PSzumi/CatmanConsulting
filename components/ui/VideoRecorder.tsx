"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Circle,
  Square,
  RotateCcw,
  Check,
  X,
  Play,
  Pause,
  AlertCircle,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoRecorderProps {
  onVideoReady: (videoBlob: Blob | null, videoUrl: string | null) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

type RecordingState = "idle" | "preview" | "recording" | "recorded" | "playing";

export function VideoRecorder({
  onVideoReady,
  maxDuration = 60,
  className,
}: VideoRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      setState("preview");
    } catch (err) {
      console.error("Camera access error:", err);
      setHasPermission(false);
      setError("Nie udało się uzyskać dostępu do kamery. Sprawdź uprawnienia przeglądarki.");
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    setTimeElapsed(0);

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp9,opus",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        recordedBlobRef.current = blob;

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
          videoRef.current.muted = false;
        }

        setState("recorded");
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setState("recording");

      // Start timer
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
      setError("Nie udało się rozpocząć nagrywania.");
    }
  }, [maxDuration]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    stopStream();
  }, [stopStream]);

  const retryRecording = useCallback(() => {
    recordedBlobRef.current = null;
    onVideoReady(null, null);
    if (videoRef.current) {
      videoRef.current.src = "";
    }
    startCamera();
  }, [onVideoReady, startCamera]);

  const confirmVideo = useCallback(() => {
    if (recordedBlobRef.current) {
      const url = URL.createObjectURL(recordedBlobRef.current);
      onVideoReady(recordedBlobRef.current, url);
    }
  }, [onVideoReady]);

  const cancelVideo = useCallback(() => {
    stopStream();
    if (timerRef.current) clearInterval(timerRef.current);
    recordedBlobRef.current = null;
    onVideoReady(null, null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
    }
    setState("idle");
    setTimeElapsed(0);
  }, [onVideoReady, stopStream]);

  const togglePlayback = useCallback(() => {
    if (!videoRef.current) return;

    if (state === "playing") {
      videoRef.current.pause();
      setState("recorded");
    } else {
      videoRef.current.play();
      setState("playing");
    }
  }, [state]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check for MediaRecorder support
  const isSupported = typeof window !== "undefined" && "MediaRecorder" in window;

  if (!isSupported) {
    return (
      <div className={cn("p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20", className)}>
        <div className="flex items-center gap-3 text-yellow-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Twoja przeglądarka nie wspiera nagrywania wideo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.button
            key="start-btn"
            type="button"
            onClick={startCamera}
            className="w-full p-6 rounded-2xl border-2 border-dashed border-gray-700 hover:border-[#8b1a1a]/50 bg-gray-900/30 hover:bg-gray-900/50 transition-all group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#8b1a1a]/20 flex items-center justify-center group-hover:bg-[#8b1a1a]/30 transition-colors">
                <Camera className="w-8 h-8 text-[#8b1a1a]" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white mb-1">Nagraj wiadomość wideo</p>
                <p className="text-sm text-gray-500">
                  Maks. {maxDuration} sekund. Bardziej osobiste niż tekst.
                </p>
              </div>
            </div>
          </motion.button>
        )}

        {(state === "preview" || state === "recording" || state === "recorded" || state === "playing") && (
          <motion.div
            key="recorder"
            className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Video element */}
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                onEnded={() => setState("recorded")}
              />

              {/* Recording indicator */}
              {state === "recording" && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  REC {formatTime(timeElapsed)} / {formatTime(maxDuration)}
                </div>
              )}

              {/* Playback overlay */}
              {(state === "recorded" || state === "playing") && (
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {state === "playing" ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </div>
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                {state === "preview" && (
                  <>
                    <motion.button
                      type="button"
                      onClick={cancelVideo}
                      className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={startRecording}
                      className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Circle className="w-6 h-6 fill-current" />
                    </motion.button>
                  </>
                )}

                {state === "recording" && (
                  <motion.button
                    type="button"
                    onClick={stopRecording}
                    className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Square className="w-6 h-6 fill-current" />
                  </motion.button>
                )}

                {(state === "recorded" || state === "playing") && (
                  <>
                    <motion.button
                      type="button"
                      onClick={retryRecording}
                      className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={confirmVideo}
                      className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={cancelVideo}
                      className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </div>

              {/* Duration indicator for recorded */}
              {(state === "recorded" || state === "playing") && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Nagranie: {formatTime(timeElapsed)}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
