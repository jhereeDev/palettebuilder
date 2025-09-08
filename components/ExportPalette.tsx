import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import chroma from "chroma-js";
import { useSubscription } from "@/hooks/useSubscription";
import { Download, Copy, Code, Palette, FileText, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ExportPaletteProps {
  colorScale: { [key: string]: string };
  colorName: string;
  secondaryColor?: string;
  onClose: () => void;
}

const ExportPalette: React.FC<ExportPaletteProps> = ({
  colorScale,
  colorName,
  secondaryColor,
  onClose,
}) => {
  const { isPremium } = useSubscription();
  const { toast } = useToast();
  const generateTailwindHex = () => {
    const config = Object.entries(colorScale)
      .map(([level, hex]) => `      '${level}': '${hex}',`)
      .join("\n");
    const secondaryColorConfig = secondaryColor
      ? `\n    secondary: '${secondaryColor}',`
      : "";
    return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName}: {
${config}
        },${secondaryColorConfig}
      },
    },
  },
};`;
  };

  const generateTailwindOKLCH = () => {
    const config = Object.entries(colorScale)
      .map(([level, hex]) => {
        const oklch = chroma(hex).oklch();
        return `      '${level}': 'oklch(${oklch[0].toFixed(
          3
        )} ${oklch[1].toFixed(3)} ${oklch[2].toFixed(3)})',`;
      })
      .join("\n");
    const secondaryColorConfig = secondaryColor
      ? `\n    secondary: 'oklch(${chroma(secondaryColor)
          .oklch()
          .map((v) => v.toFixed(3))
          .join(" ")}))',`
      : "";
    return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName}: {
${config}
        },${secondaryColorConfig}
      },
    },
  },
};`;
  };

  const generateTailwindHSL = () => {
    const config = Object.entries(colorScale)
      .map(([level, hex]) => {
        const hsl = chroma(hex).hsl();
        return `      '${level}': 'hsl(${Math.round(hsl[0])} ${Math.round(
          hsl[1] * 100
        )}% ${Math.round(hsl[2] * 100)}%)',`;
      })
      .join("\n");
    const secondaryColorConfig = secondaryColor
      ? `\n    secondary: 'hsl(${chroma(secondaryColor)
          .hsl()
          .map((v, i) => (i === 0 ? Math.round(v) : Math.round(v * 100) + "%"))
          .join(" ")}))',`
      : "";
    return `module.exports = {
  theme: {
    extend: {
      colors: {
        ${colorName}: {
${config}
        },${secondaryColorConfig}
      },
    },
  },
};`;
  };

  const generateSCSS = () => {
    const variables = Object.entries(colorScale)
      .map(([level, hex]) => `$${colorName}-${level}: ${hex};`)
      .join("\n");
    const secondaryColorVariable = secondaryColor
      ? `\n$secondary-color: ${secondaryColor};`
      : "";
    return `${variables}${secondaryColorVariable}`;
  };

  const generateCSSHex = () => {
    const variables = Object.entries(colorScale)
      .map(([level, hex]) => `  --${colorName}-${level}: ${hex};`)
      .join("\n");
    const secondaryColorVariable = secondaryColor
      ? `\n  --secondary-color: ${secondaryColor};`
      : "";
    return `:root {
${variables}${secondaryColorVariable}
}`;
  };

  const generateCSSRGB = () => {
    const variables = Object.entries(colorScale)
      .map(([level, hex]) => {
        const rgb = chroma(hex).rgb();
        return `  --${colorName}-${level}: ${rgb[0]}, ${rgb[1]}, ${rgb[2]};`;
      })
      .join("\n");
    const secondaryColorVariable = secondaryColor
      ? `\n  --secondary-color: ${chroma(secondaryColor).rgb().join(", ")};`
      : "";
    return `:root {
${variables}${secondaryColorVariable}
}`;
  };

  const generateSVG = () => {
    const swatches = Object.entries(colorScale)
      .map(
        ([level, hex], index) =>
          `  <rect x="0" y="${
            index * 50
          }" width="100" height="50" fill="${hex}" />`
      )
      .join("\n");
    const secondarySwatch = secondaryColor
      ? `\n  <rect x="0" y="${
          Object.keys(colorScale).length * 50
        }" width="100" height="50" fill="${secondaryColor}" />`
      : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="${
      (Object.keys(colorScale).length + (secondaryColor ? 1 : 0)) * 50
    }">
${swatches}${secondarySwatch}
</svg>`;
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    toast({
      title: "File downloaded!",
      description: `${filename} has been downloaded`,
    });
  };

  const copyToClipboard = (content: string, format: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: `${format} format copied`,
      });
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="css" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="css" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            CSS
          </TabsTrigger>
          <TabsTrigger value="tailwind" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Tailwind
          </TabsTrigger>
          <TabsTrigger value="scss" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SCSS
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Other
          </TabsTrigger>
        </TabsList>

        <TabsContent value="css" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                CSS Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">HEX Format</h4>
                    <Badge variant="secondary">Standard</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          generateCSSHex(),
                          `${colorName}-variables-hex.css`
                        )
                      }
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(generateCSSHex(), "CSS HEX")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">RGB Format</h4>
                    <Badge variant="secondary">Modern</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          generateCSSRGB(),
                          `${colorName}-variables-rgb.css`
                        )
                      }
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(generateCSSRGB(), "CSS RGB")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tailwind" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tailwind CSS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">HEX Format</h4>
                    <Badge variant="secondary">Standard</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          generateTailwindHex(),
                          `${colorName}-tailwind-hex.js`
                        )
                      }
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(generateTailwindHex(), "Tailwind HEX")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">OKLCH Format</h4>
                    <Badge variant="default">Modern</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          generateTailwindOKLCH(),
                          `${colorName}-tailwind-oklch.js`
                        )
                      }
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          generateTailwindOKLCH(),
                          "Tailwind OKLCH"
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">HSL Format</h4>
                    <Badge variant="secondary">Alternative</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          generateTailwindHSL(),
                          `${colorName}-tailwind-hsl.js`
                        )
                      }
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(generateTailwindHSL(), "Tailwind HSL")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                SCSS Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">SCSS Variables</h4>
                  <Badge variant="secondary">Sass</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      downloadFile(
                        generateSCSS(),
                        `${colorName}-variables.scss`
                      )
                    }
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateSCSS(), "SCSS")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Other Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">SVG Palette</h4>
                  <Badge variant="secondary">Figma Ready</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      downloadFile(generateSVG(), `${colorName}-palette.svg`)
                    }
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateSVG(), "SVG")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExportPalette;
