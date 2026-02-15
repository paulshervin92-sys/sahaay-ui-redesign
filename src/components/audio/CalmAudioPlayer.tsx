import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border shadow-sm transition-all hover:shadow-md ${
          isEnabled
            ? "bg-primary text-primary-foreground"
            : "bg-surface text-foreground"
        }`}
        aria-label="Calm mode settings"
      >
        {volume === 0 || !isEnabled ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isExpanded && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-border bg-surface/95 backdrop-blur-sm p-4 shadow-lg space-y-3">
          {/* Toggle Control */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-foreground">
              Calm Mode
            </span>

            <Button
              onClick={handleToggle}
              disabled={isLoading}
              variant={isEnabled ? "default" : "outline"}
              size="sm"
              className="rounded-lg transition-all"
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
              <label className="text-xs font-medium text-muted-foreground">
                Volume
              </label>
              <span className="text-xs font-medium text-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              className="w-full"
              disabled={!isEnabled}
              aria-label="Adjust volume"
            />
          </div>

          {/* Info Text */}
          <p className="text-xs text-muted-foreground">
            Ambient sounds to help you relax and focus.
          </p>
        </div>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default CalmAudioPlayer;
