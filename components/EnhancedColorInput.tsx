"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { colorNames, colorPalettes } from "@/lib/colors";
import {
  generateColorHarmony,
  getColorInfo,
  generateCompletePalette,
} from "@/lib/colorUtils";
import chroma from "chroma-js";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Palette,
  Droplets,
  Eye,
  Copy,
  RefreshCw,
  Sparkles,
  Contrast,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EnhancedColorInputProps {
  onColorChange: (color: string, colorName: string, palette: any) => void;
  onSecondaryColorChange: (color: string | undefined) => void;
  initialColor?: string;
}

export default function EnhancedColorInput({
  onColorChange,
  onSecondaryColorChange,
  initialColor = "#F6F0C2",
}: EnhancedColorInputProps) {
  const [inputColor, setInputColor] = useState(initialColor);
  const [secondaryColor, setSecondaryColor] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState("");
  const [secondaryError, setSecondaryError] = useState("");
  const [colorName, setColorName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSecondaryInput, setShowSecondaryInput] = useState(false);
  const [activeTab, setActiveTab] = useState("picker");
  const [colorInfo, setColorInfo] = useState<any>(null);
  const [harmony, setHarmony] = useState<any>(null);
  const [hslValues, setHslValues] = useState([0, 0, 0]);

  const inputRef = useRef<HTMLInputElement>(null);
  const { isPremium } = useSubscription();
  const { toast } = useToast();

  // Parse and validate color input
  const parseColorInput = useCallback((input: string): string | null => {
    input = input.trim().toLowerCase();

    if (chroma.valid(input)) {
      return chroma(input).hex();
    }

    const rgbMatch = input.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      return chroma(rgbMatch.slice(1).map(Number)).hex();
    }

    const hslMatch = input.match(/^hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)$/);
    if (hslMatch) {
      const [h, s, l] = hslMatch.slice(1).map(Number);
      return chroma.hsl(h, s / 100, l / 100).hex();
    }

    return null;
  }, []);

  // Find closest named color
  const findClosestNamedColor = useCallback((inputHex: string) => {
    let closestColor = "";
    let closestDistance = Infinity;
    let closestPalette = "";
    let closestShade = 0;

    Object.entries(colorPalettes).forEach(([paletteName, palette]) => {
      Object.entries(palette).forEach(([shade, hexValue]) => {
        const distance = chroma.distance(inputHex, hexValue, "lab");
        if (distance < closestDistance) {
          closestDistance = distance;
          closestColor = hexValue;
          closestPalette = paletteName;
          closestShade = parseInt(shade);
        }
      });
    });

    return {
      name: `${closestPalette} ${closestShade}`,
      palette: colorPalettes[closestPalette],
    };
  }, []);

  // Validate and process color
  const validateColor = useCallback(
    (input: string, isSecondary: boolean = false) => {
      const parsedColor = parseColorInput(input);
      if (parsedColor) {
        if (isSecondary) {
          setSecondaryError("");
          onSecondaryColorChange(parsedColor);
          setSecondaryColor(parsedColor);
        } else {
          setError("");
          const { name, palette } = findClosestNamedColor(parsedColor);
          setColorName(name);
          onColorChange(parsedColor, name, palette);

          // Update color info and harmony
          setColorInfo(getColorInfo(parsedColor));
          setHarmony(generateColorHarmony(parsedColor));

          // Update HSL values for sliders
          const hsl = chroma(parsedColor).hsl();
          setHslValues([hsl[0] || 0, hsl[1] * 100, hsl[2] * 100]);
        }
        return true;
      } else {
        const errorMessage =
          "Invalid color input. Please enter a valid hex, RGB, or HSL color.";
        if (isSecondary) {
          setSecondaryError(errorMessage);
        } else {
          setError(errorMessage);
          setColorName("");
        }
        return false;
      }
    },
    [
      parseColorInput,
      findClosestNamedColor,
      onColorChange,
      onSecondaryColorChange,
    ]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, isSecondary: boolean = false) => {
      const value = e.target.value;
      if (isSecondary) {
        setSecondaryColor(value);
        validateColor(value, true);
      } else {
        setInputColor(value);
        const filtered = colorNames.filter((name) =>
          name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      }
    },
    [validateColor]
  );

  // Handle suggestion clicks
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setInputColor(suggestion);
      setShowSuggestions(false);
      validateColor(suggestion);
    },
    [validateColor]
  );

  // Generate random color
  const generateRandomColor = useCallback(
    (isSecondary: boolean = false) => {
      const randomColor = chroma.random().hex();
      if (isSecondary) {
        setSecondaryColor(randomColor);
        validateColor(randomColor, true);
      } else {
        setInputColor(randomColor);
        validateColor(randomColor);
      }
    },
    [validateColor]
  );

  // Handle HSL slider changes
  const handleHslChange = useCallback(
    (index: number, value: number[]) => {
      const newHsl = [...hslValues];
      newHsl[index] = value[0];
      const newColor = chroma
        .hsl(newHsl[0], newHsl[1] / 100, newHsl[2] / 100)
        .hex();
      setInputColor(newColor);
      validateColor(newColor);
    },
    [hslValues, validateColor]
  );

  // Copy color to clipboard
  const copyToClipboard = useCallback(
    (color: string) => {
      navigator.clipboard.writeText(color).then(() => {
        toast({
          title: "Color copied!",
          description: `${color} copied to clipboard`,
        });
      });
    },
    [toast]
  );

  // Generate harmony color
  const generateHarmonyColor = useCallback(
    (harmonyType: keyof typeof harmony, index: number) => {
      if (harmony && harmony[harmonyType]) {
        const color = harmony[harmonyType][index];
        setInputColor(color);
        validateColor(color);
      }
    },
    [harmony, validateColor]
  );

  // Initialize with default color
  useEffect(() => {
    validateColor(inputColor);
  }, [inputColor, validateColor]);

  return (
    <div className="space-y-6">
      {/* Main Color Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Palette Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="picker">Color Picker</TabsTrigger>
              <TabsTrigger value="input">Text Input</TabsTrigger>
              <TabsTrigger value="harmony">Harmony</TabsTrigger>
            </TabsList>

            <TabsContent value="picker" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                      style={{ backgroundColor: inputColor }}
                      onClick={() => inputRef.current?.click()}
                    />
                    <Input
                      ref={inputRef}
                      type="color"
                      value={inputColor}
                      onChange={(e) => {
                        setInputColor(e.target.value);
                        validateColor(e.target.value);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={inputColor}
                      onChange={(e) => handleInputChange(e)}
                      className="font-mono"
                      placeholder="#000000"
                    />
                    {colorName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {colorName}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateRandomColor()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* HSL Sliders */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">
                      Hue: {Math.round(hslValues[0])}°
                    </label>
                    <Slider
                      value={[hslValues[0]]}
                      onValueChange={(value) => handleHslChange(0, value)}
                      max={360}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Saturation: {Math.round(hslValues[1])}%
                    </label>
                    <Slider
                      value={[hslValues[1]]}
                      onValueChange={(value) => handleHslChange(1, value)}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Lightness: {Math.round(hslValues[2])}%
                    </label>
                    <Slider
                      value={[hslValues[2]]}
                      onValueChange={(value) => handleHslChange(2, value)}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="input" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter color (hex, RGB, HSL, or name):
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={inputColor}
                      onChange={(e) => handleInputChange(e)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 200)
                      }
                      placeholder="#F6F0C2 or rgb(246, 240, 194) or khaki"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => generateRandomColor()}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="mt-2 border rounded-md bg-background shadow-lg max-h-40 overflow-auto">
                      {suggestions.slice(0, 10).map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full px-3 py-2 text-left hover:bg-muted text-sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {error && (
                    <p className="text-sm text-destructive mt-1">{error}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="harmony" className="space-y-4">
              {harmony && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Complementary</h4>
                      <div className="flex gap-2">
                        {harmony.complementary.map(
                          (color: string, index: number) => (
                            <button
                              key={index}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                generateHarmonyColor("complementary", index)
                              }
                              title={color}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Triadic</h4>
                      <div className="flex gap-2">
                        {harmony.triadic.map((color: string, index: number) => (
                          <button
                            key={index}
                            className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              generateHarmonyColor("triadic", index)
                            }
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Analogous</h4>
                      <div className="flex gap-2">
                        {harmony.analogous.map(
                          (color: string, index: number) => (
                            <button
                              key={index}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                generateHarmonyColor("analogous", index)
                              }
                              title={color}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Monochromatic</h4>
                      <div className="flex gap-2">
                        {harmony.monochromatic.map(
                          (color: string, index: number) => (
                            <button
                              key={index}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                generateHarmonyColor("monochromatic", index)
                              }
                              title={color}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Color Information */}
      {colorInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Color Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">HEX</label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {colorInfo.hex}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(colorInfo.hex)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">RGB</label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    rgb({colorInfo.rgb.map(Math.round).join(", ")})
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `rgb(${colorInfo.rgb.map(Math.round).join(", ")})`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">HSL</label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    hsl({Math.round(colorInfo.hsl[0])},{" "}
                    {Math.round(colorInfo.hsl[1] * 100)}%,{" "}
                    {Math.round(colorInfo.hsl[2] * 100)}%)
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `hsl(${Math.round(colorInfo.hsl[0])}, ${Math.round(
                          colorInfo.hsl[1] * 100
                        )}%, ${Math.round(colorInfo.hsl[2] * 100)}%)`
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Luminance</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {Math.round(colorInfo.luminance * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Secondary Color */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Secondary Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSecondaryInput(!showSecondaryInput);
                if (showSecondaryInput) {
                  setSecondaryColor(undefined);
                  onSecondaryColorChange(undefined);
                }
              }}
            >
              {showSecondaryInput ? "Remove Secondary" : "Add Secondary"}
            </Button>

            {showSecondaryInput && (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: secondaryColor || "#ffffff" }}
                />
                <Input
                  type="color"
                  value={secondaryColor || "#ffffff"}
                  onChange={(e) => {
                    setSecondaryColor(e.target.value);
                    validateColor(e.target.value, true);
                  }}
                  className="w-12 h-8"
                />
                <Input
                  type="text"
                  value={secondaryColor || ""}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="#000000"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateRandomColor(true)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {secondaryError && (
            <p className="text-sm text-destructive mt-2">{secondaryError}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
