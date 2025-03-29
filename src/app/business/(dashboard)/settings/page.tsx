"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const modes = [
  { name: "Light", value: "light", icon: Sun },
  { name: "Dark", value: "dark", icon: Moon },
  { name: "System", value: "system", icon: Laptop },
];

const radiusOptions = [
  { name: "Small", value: "0.25rem" },
  { name: "Medium", value: "0.5rem" },
  { name: "Large", value: "0.75rem" },
  { name: "Extra Large", value: "1rem" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState<number>(1);
  const [radius, setRadius] = useState<string>("0.5rem");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const savedFontSize = parseFloat(localStorage.getItem("fontSize") || "1");
    const savedRadius = localStorage.getItem("radius") || "0.5rem";

    setFontSize(savedFontSize);
    setRadius(savedRadius);

    applyCustomSettings(savedFontSize, savedRadius);
  }, [mounted]);

  const applyCustomSettings = (fontSizeValue: number, radiusValue: string) => {
    const html = document.documentElement;
    html.style.setProperty("--font-size", `${fontSizeValue}rem`);
    html.style.setProperty("--radius", radiusValue);

    localStorage.setItem("fontSize", fontSizeValue.toString());
    localStorage.setItem("radius", radiusValue);
  };

  const handleModeChange = (value: string) => {
    setTheme(value);
    toast.success(`Mode set to ${modes.find((m) => m.value === value)?.name}`);
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    applyCustomSettings(newSize, radius);
    toast.success(`Font size set to ${newSize}rem`);
  };

  const handleRadiusChange = (value: string) => {
    setRadius(value);
    applyCustomSettings(fontSize, value);
    toast.success(
      `Radius set to ${radiusOptions.find((r) => r.value === value)?.name}`
    );
  };

  const handleReset = () => {
    const defaultMode = "system";
    const defaultFontSize = 1;
    const defaultRadius = "0.5rem";

    setTheme(defaultMode);
    setFontSize(defaultFontSize);
    setRadius(defaultRadius);
    applyCustomSettings(defaultFontSize, defaultRadius);
    toast.success("Settings reset to defaults");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto flex flex-col gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <Card className="w-full max-w-2xl bg-background">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="flex justify-center items-center pt-6 space-y-6">
              <RefreshCw className="animate-spin m-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto flex flex-col gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Card className="w-full max-w-2xl bg-background">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Mode</Label>
              <div className="grid grid-cols-3 gap-4 max-w-xs">
                {modes.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Button
                      key={m.value}
                      variant={theme === m.value ? "outline" : "ghost"}
                      className="flex flex-col items-center gap-2 h-auto py-3 text-black dark:text-white"
                      onClick={() => handleModeChange(m.value)}
                    >
                      <Icon className="h-5 w-5" />
                      <span >{m.name}</span>
                    </Button>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                Switch between light, dark, or system preference modes.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">
                Font Size ({fontSize}rem)
              </Label>
              <Slider
                value={[fontSize]}
                min={0.875}
                max={1.25}
                step={0.125}
                onValueChange={handleFontSizeChange}
                className="w-full max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Adjust the base font size (0.875rem to 1.25rem).
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Border Radius</Label>
              <Select value={radius} onValueChange={handleRadiusChange}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select radius" />
                </SelectTrigger>
                <SelectContent>
                  {radiusOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.name} ({r.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Adjust the corner radius of UI elements.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Preview</Label>
              <div className="p-4 bg-card rounded-md border flex flex-col gap-2">
                <Button className="w-fit">Sample Button</Button>
                <p className="text-sm text-muted-foreground">
                  This is a sample text to preview your settings.
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={handleReset} className="w-fit">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
