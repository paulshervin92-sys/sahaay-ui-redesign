import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";

const Settings = () => {
  const { settings, updateSettings, exportData, deleteAllData } = useUser();
  const [fontScale, setFontScale] = useState(settings.fontScale);

  const handleFontScale = async (value: number[]) => {
    const next = value[0];
    setFontScale(next);
    await updateSettings({ fontScale: next });
  };

  const requestNotifications = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") return;
    await Notification.requestPermission();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Control comfort, privacy, and reminders.</p>
      </div>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Accessibility</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Reduce motion</p>
              <p className="text-xs text-muted-foreground">Minimize animations and transitions.</p>
            </div>
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => updateSettings({ reduceMotion: checked })}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Text size</p>
            <p className="text-xs text-muted-foreground">Adjust for easier reading.</p>
            <div className="mt-3">
              <Slider min={0.9} max={1.3} step={0.05} value={[fontScale]} onValueChange={handleFontScale} />
              <p className="mt-2 text-xs text-muted-foreground">Current scale: {fontScale.toFixed(2)}x</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Reminders</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Daily check-in reminder</p>
              <p className="text-xs text-muted-foreground">Gentle nudge to care for yourself.</p>
            </div>
            <Switch
              checked={settings.remindersEnabled}
              onCheckedChange={(checked) => updateSettings({ remindersEnabled: checked })}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              className="w-[160px]"
            />
            <Button variant="secondary" onClick={requestNotifications}>
              Allow notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="space-y-5 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Privacy</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Private mode</p>
              <p className="text-xs text-muted-foreground">Keep new entries only on this device.</p>
            </div>
            <Switch
              checked={settings.privateMode}
              onCheckedChange={(checked) => updateSettings({ privateMode: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Offline sync</p>
              <p className="text-xs text-muted-foreground">Sync when you reconnect.</p>
            </div>
            <Switch
              checked={settings.offlineSync}
              onCheckedChange={(checked) => updateSettings({ offlineSync: checked })}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportData}>
              Export my data
            </Button>
            <Button variant="destructive" onClick={deleteAllData}>
              Delete my data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
