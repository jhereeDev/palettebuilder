"use client";

import { useEffect, useState } from "react";
import chroma from "chroma-js";
import EnhancedColorInput from "@/components/EnhancedColorInput";
import EnhancedColorPalette from "@/components/EnhancedColorPalette";
import SampleComponents from "@/components/SampleComponents";
import { colorPalettes } from "@/lib/colors";
import { generateColorScale } from "@/lib/colorUtils";

export default function Home() {
  const [baseColor, setBaseColor] = useState("#F6F0C2");
  const [secondaryColor, setSecondaryColor] = useState<string | undefined>(
    undefined
  );
  const [colorName, setColorName] = useState("khaki 200");
  const [colorScale, setColorScale] = useState({});
  const [isValidColor, setIsValidColor] = useState(true);

  // Use the enhanced color scale generation from colorUtils

  const handleColorChange = (color: string, name: string, palette: any) => {
    setBaseColor(color);
    setColorName(name);
    // Use the provided palette if it exists, otherwise generate a new one
    const newColorScale =
      Object.keys(palette).length > 0 ? palette : generateColorScale(color);
    setColorScale(newColorScale);
    setIsValidColor(!!color);
  };

  const handleSecondaryColorChange = (color: string | undefined) => {
    setSecondaryColor(color);
  };

  // Generate initial color scale
  useEffect(() => {
    const initialScale =
      colorPalettes[colorName.toLowerCase()] || generateColorScale(baseColor);
    setColorScale(initialScale);
  }, [baseColor, colorName]);

  // Reset color palette when secondary color is removed
  useEffect(() => {
    if (secondaryColor === undefined) {
      const newColorScale = generateColorScale(baseColor);
      setColorScale(newColorScale);
    }
  }, [secondaryColor, baseColor]);

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {colorName.charAt(0).toUpperCase() + colorName.slice(1)} Color Palette
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create beautiful, accessible color palettes with advanced color theory
          and harmony tools
        </p>
      </div>

      <EnhancedColorInput
        onColorChange={handleColorChange}
        onSecondaryColorChange={handleSecondaryColorChange}
        initialColor={baseColor}
      />

      {isValidColor && (
        <>
          <EnhancedColorPalette
            baseColor={baseColor}
            secondaryColor={secondaryColor}
            colorName={colorName}
            colorScale={colorScale}
            onUpdateColorScale={setColorScale}
            onUpdateSecondaryColor={handleSecondaryColorChange}
          />
          <SampleComponents
            baseColor={baseColor}
            secondaryColor={secondaryColor}
            colorScale={colorScale}
          />
        </>
      )}
    </main>
  );
}
