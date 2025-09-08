import chroma from "chroma-js";

// Enhanced color utility functions
export interface ColorHarmony {
  complementary: string[];
  triadic: string[];
  tetradic: string[];
  analogous: string[];
  splitComplementary: string[];
  monochromatic: string[];
}

export interface ColorInfo {
  hex: string;
  hsl: [number, number, number];
  rgb: [number, number, number];
  lab: [number, number, number];
  name: string;
  luminance: number;
  contrast: number;
}

// Generate proper color scales using modern color theory
export const generateColorScale = (
  baseColor: string,
  steps: number = 9
): { [key: string]: string } => {
  try {
    const color = chroma(baseColor);
    const scale = chroma
      .scale(["white", baseColor, "black"])
      .mode("oklch")
      .colors(steps);

    return {
      "50": scale[0],
      "100": scale[1],
      "200": scale[2],
      "300": scale[3],
      "400": scale[4],
      "500": baseColor,
      "600": scale[5],
      "700": scale[6],
      "800": scale[7],
      "900": scale[8],
    };
  } catch (error) {
    console.error("Error generating color scale:", error);
    return generateFallbackScale(baseColor);
  }
};

// Fallback scale generation
const generateFallbackScale = (
  baseColor: string
): { [key: string]: string } => {
  const color = chroma(baseColor);
  return {
    "50": color.brighten(2).hex(),
    "100": color.brighten(1.5).hex(),
    "200": color.brighten(1).hex(),
    "300": color.brighten(0.5).hex(),
    "400": color.brighten(0.2).hex(),
    "500": baseColor,
    "600": color.darken(0.2).hex(),
    "700": color.darken(0.5).hex(),
    "800": color.darken(1).hex(),
    "900": color.darken(1.5).hex(),
  };
};

// Generate color harmonies
export const generateColorHarmony = (baseColor: string): ColorHarmony => {
  const color = chroma(baseColor);
  const hue = color.get("hsl.h") || 0;

  return {
    complementary: [
      baseColor,
      chroma
        .hsl((hue + 180) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
    ],
    triadic: [
      baseColor,
      chroma
        .hsl((hue + 120) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
      chroma
        .hsl((hue + 240) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
    ],
    tetradic: [
      baseColor,
      chroma
        .hsl((hue + 90) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
      chroma
        .hsl((hue + 180) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
      chroma
        .hsl((hue + 270) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
    ],
    analogous: [
      chroma
        .hsl((hue - 30) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
      baseColor,
      chroma
        .hsl((hue + 30) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
    ],
    splitComplementary: [
      baseColor,
      chroma
        .hsl((hue + 150) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
      chroma
        .hsl((hue + 210) % 360, color.get("hsl.s"), color.get("hsl.l"))
        .hex(),
    ],
    monochromatic: [
      chroma
        .hsl(hue, color.get("hsl.s"), Math.min(1, color.get("hsl.l") + 0.3))
        .hex(),
      chroma
        .hsl(hue, color.get("hsl.s"), Math.max(0, color.get("hsl.l") - 0.1))
        .hex(),
      chroma
        .hsl(hue, color.get("hsl.s"), Math.max(0, color.get("hsl.l") - 0.3))
        .hex(),
    ],
  };
};

// Get comprehensive color information
export const getColorInfo = (color: string): ColorInfo => {
  const chromaColor = chroma(color);
  return {
    hex: chromaColor.hex(),
    hsl: chromaColor.hsl(),
    rgb: chromaColor.rgb(),
    lab: chromaColor.lab(),
    name: getColorName(color),
    luminance: chromaColor.luminance(),
    contrast: chroma.contrast(color, "#ffffff"),
  };
};

// Enhanced color naming system
export const getColorName = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    "#ff0000": "Red",
    "#00ff00": "Green",
    "#0000ff": "Blue",
    "#ffff00": "Yellow",
    "#ff00ff": "Magenta",
    "#00ffff": "Cyan",
    "#ffffff": "White",
    "#000000": "Black",
    "#808080": "Gray",
    "#ffa500": "Orange",
    "#800080": "Purple",
    "#008000": "Green",
    "#ffc0cb": "Pink",
    "#a52a2a": "Brown",
    "#000080": "Navy",
    "#008080": "Teal",
    "#800000": "Maroon",
    "#808000": "Olive",
    "#c0c0c0": "Silver",
    "#ffd700": "Gold",
  };

  return colorMap[color.toLowerCase()] || "Custom Color";
};

// Generate accessible color combinations
export const generateAccessibleCombinations = (baseColor: string) => {
  const color = chroma(baseColor);
  const luminance = color.luminance();

  return {
    textOnLight: luminance > 0.5 ? "#000000" : "#ffffff",
    textOnDark: luminance > 0.5 ? "#ffffff" : "#000000",
    highContrast:
      luminance > 0.5 ? color.darken(2).hex() : color.brighten(2).hex(),
    lowContrast:
      luminance > 0.5 ? color.darken(0.5).hex() : color.brighten(0.5).hex(),
  };
};

// Generate gradient variations
export const generateGradients = (
  baseColor: string,
  secondaryColor?: string
) => {
  const primary = chroma(baseColor);
  const secondary = secondaryColor
    ? chroma(secondaryColor)
    : primary.set("hsl.h", "+180");

  return {
    linear: `linear-gradient(135deg, ${primary.hex()}, ${secondary.hex()})`,
    radial: `radial-gradient(circle, ${primary.hex()}, ${secondary.hex()})`,
    conic: `conic-gradient(from 0deg, ${primary.hex()}, ${secondary.hex()}, ${primary.hex()})`,
    mesh: `linear-gradient(45deg, ${primary.hex()}, ${secondary.hex()}, ${primary
      .alpha(0.8)
      .hex()}, ${secondary.alpha(0.8).hex()})`,
  };
};

// Color temperature analysis
export const getColorTemperature = (
  color: string
): "warm" | "cool" | "neutral" => {
  const chromaColor = chroma(color);
  const hue = chromaColor.get("hsl.h") || 0;

  if (hue >= 0 && hue <= 60) return "warm";
  if (hue >= 60 && hue <= 180) return "cool";
  if (hue >= 180 && hue <= 300) return "cool";
  if (hue >= 300 && hue <= 360) return "warm";

  return "neutral";
};

// Generate semantic color variations
export const generateSemanticColors = (baseColor: string) => {
  const color = chroma(baseColor);

  return {
    primary: baseColor,
    secondary: color.set("hsl.h", "+30").hex(),
    accent: color.set("hsl.h", "+60").hex(),
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    muted: color.desaturate(0.5).hex(),
    background: color.alpha(0.05).hex(),
    foreground: color.darken(2).hex(),
  };
};

// Export utility for generating all color variations
export const generateCompletePalette = (
  baseColor: string,
  secondaryColor?: string
) => {
  return {
    scale: generateColorScale(baseColor),
    harmony: generateColorHarmony(baseColor),
    info: getColorInfo(baseColor),
    accessible: generateAccessibleCombinations(baseColor),
    gradients: generateGradients(baseColor, secondaryColor),
    temperature: getColorTemperature(baseColor),
    semantic: generateSemanticColors(baseColor),
  };
};
