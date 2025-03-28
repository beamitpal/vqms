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
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sun, Moon, Laptop, RotateCcw } from "lucide-react";
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
  const [accentColor, setAccentColor] = useState<string>("#1e40af");
  const [fontSize, setFontSize] = useState<number>(1);
  const [radius, setRadius] = useState<string>("0.5rem");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (!mounted) return; 

    const savedAccentColor = localStorage.getItem("accentColor") || "#1e40af";
    const savedFontSize = parseFloat(localStorage.getItem("fontSize") || "1");
    const savedRadius = localStorage.getItem("radius") || "0.5rem";

    setAccentColor(savedAccentColor);
    setFontSize(savedFontSize);
    setRadius(savedRadius);

    applyCustomSettings(savedAccentColor, savedFontSize, savedRadius);
  }, [mounted]);

  const applyCustomSettings = (
    accentColorValue: string,
    fontSizeValue: number,
    radiusValue: string
  ) => {
    const html = document.documentElement;
    html.style.setProperty("--primary", accentColorValue);
    html.style.setProperty("--font-size", `${fontSizeValue}rem`);
    html.style.setProperty("--radius", radiusValue);

    localStorage.setItem("accentColor", accentColorValue);
    localStorage.setItem("fontSize", fontSizeValue.toString());
    localStorage.setItem("radius", radiusValue);
  };


  const handleModeChange = (value: string) => {
    setTheme(value);
    toast.success(`Mode set to ${modes.find((m) => m.value === value)?.name}`);
  };


  const handleAccentColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setAccentColor(newColor);
    applyCustomSettings(newColor, fontSize, radius);
    toast.success("Accent color updated");
  };


  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    applyCustomSettings(accentColor, newSize, radius);
    toast.success(`Font size set to ${newSize}rem`);
  };

 
  const handleRadiusChange = (value: string) => {
    setRadius(value);
    applyCustomSettings(accentColor, fontSize, value);
    toast.success(`Radius set to ${radiusOptions.find((r) => r.value === value)?.name}`);
  };


  const handleReset = () => {
    const defaultMode = "system";
    const defaultAccentColor = "#1e40af";
    const defaultFontSize = 1;
    const defaultRadius = "0.5rem";

    setTheme(defaultMode);
    setAccentColor(defaultAccentColor);
    setFontSize(defaultFontSize);
    setRadius(defaultRadius);
    applyCustomSettings(defaultAccentColor, defaultFontSize, defaultRadius);
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
              <CardTitle className="text-2xl font-semibold">Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6">
          
              <div>Loading settings...</div>
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
            <CardDescription>Customize the look and feel of the application.</CardDescription>
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
                      variant={theme === m.value ? "default" : "outline"}
                      className="flex flex-col items-center gap-2 h-auto py-3"
                      onClick={() => handleModeChange(m.value)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{m.name}</span>
                    </Button>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                Switch between light, dark, or system preference modes.
              </p>
            </div>

            
            <div className="space-y-2">
              <Label className="text-base font-medium">Accent Color</Label>
              <Input
                type="color"
                value={accentColor}
                onChange={handleAccentColorChange}
                className="w-16 h-10 p-1"
              />
              <p className="text-sm text-muted-foreground">
                Choose a custom accent color for the UI.
              </p>
            </div>

          
            <div className="space-y-2">
              <Label className="text-base font-medium">Font Size ({fontSize}rem)</Label>
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