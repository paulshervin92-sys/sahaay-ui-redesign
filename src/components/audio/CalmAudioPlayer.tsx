import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const STORAGE_KEYS = {
  ENABLED: "sahaay_calm_mode_enabled",
  VOLUME: "sahaay_calm_mode_volume",
} as const;

const DEFAULT_VOLUME = 0.3;

const CalmAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio element and load saved state
  useEffect(() => {
    // Create audio element only once
    if (!audioRef.current) {
      const audio = new Audio("/audio/calm-ambient.mp3");
      audio.loop = true;
      audio.volume = DEFAULT_VOLUME;
      audioRef.current = audio;

      // Handle audio errors
      audio.addEventListener("error", () => {
        console.error("Failed to load calm audio");
        setIsEnabled(false);
        setIsLoading(false);
      });

      // Audio loaded and ready
      audio.addEventListener("canplaythrough", () => {
        setIsLoading(false);
      });
    }

    // Load saved state from localStorage
    try {
      const savedEnabled = localStorage.getItem(STORAGE_KEYS.ENABLED);
      const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);

      if (savedVolume) {
        const vol = parseFloat(savedVolume);
        if (!isNaN(vol) && vol >= 0 && vol <= 1) {
          setVolume(vol);
          if (audioRef.current) {
            audioRef.current.volume = vol;
          }
        }
      }

      // Note: We don't auto-enable on mount to respect autoplay restrictions
      // User must explicitly enable calm mode after page load
      if (savedEnabled === "true") {
        // Just update state, don't auto-play
        setIsEnabled(false); // Reset to false, user must re-enable
      }
    } catch (error) {
      console.error("Failed to load calm mode settings:", error);
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("error", () => {});
        audioRef.current.removeEventListener("canplaythrough", () => {});
      }
    };
  }, []);

  // Handle toggle calm mode
  const handleToggle = async () => {
    if (!audioRef.current) return;

    const newEnabledState = !isEnabled;

    if (newEnabledState) {
      // Enable calm mode - play audio
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsEnabled(true);
        localStorage.setItem(STORAGE_KEYS.ENABLED, "true");
      } catch (error) {
        console.error("Failed to play audio:", error);
        setIsEnabled(false);
        localStorage.setItem(STORAGE_KEYS.ENABLED, "false");
        
        // Show user-friendly message
        alert("Unable to play audio. Please try again or check your browser settings.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Disable calm mode - pause audio
      audioRef.current.pause();
      setIsEnabled(false);
      localStorage.setItem(STORAGE_KEYS.ENABLED, "false");
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);

    if (audioRef.current) {
      audioRef.current.volume = vol;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, vol.toString());
    } catch (error) {
      console.error("Failed to save volume setting:", error);
    }
  };

  return (
    <Card className="rounded-xl bg-slate-900/60 backdrop-blur border border-slate-700 shadow-lg">
      <CardContent className="p-4 space-y-3">
        {/* Toggle Control */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX className="h-5 w-5 text-slate-400" />
            ) : (
              <Volume2 className="h-5 w-5 text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-200">
              Calm Mode
            </span>
          </div>

          <Button
            onClick={handleToggle}
            disabled={isLoading}
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            className={`rounded-lg transition-all ${
              isEnabled
                ? "bg-primary text-primary-foreground"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            aria-label={isEnabled ? "Disable calm mode" : "Enable calm mode"}
          >
            {isLoading ? (
              <span className="text-xs">Loading...</span>
            ) : isEnabled ? (
              <span className="text-xs">ON</span>
            ) : (
              <span className="text-xs">OFF</span>
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-400">
              Volume
            </label>
            <span className="text-xs text-slate-500">
              {Math.round(volume * 100)}%
            </span>
          </div>
          
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
            aria-label="Adjust calm mode volume"
          />
        </div>

        {/* Status Indicator */}
        {isEnabled && (
          <div className="flex items-center gap-2 pt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400">Playing ambient sounds</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalmAudioPlayer;
