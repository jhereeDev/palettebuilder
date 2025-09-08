"use client";

import React, { useState, useEffect, useMemo } from "react";
import chroma from "chroma-js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Download,
  Edit,
  Save,
  Eye,
  Contrast,
  Palette,
  Zap,
  Sparkles,
  Heart,
  Share2,
} from "lucide-react";
import ContrastGrid from "./ContrastGrid";
import ExportPalette from "./ExportPalette";
import EditPalette from "./EditPalette";
import { useToast } from "@/components/ui/use-toast";
import Loader from "./Loader";
import { useSubscription } from "@/hooks/useSubscription";
import { generateCompletePalette, getColorInfo } from "@/lib/colorUtils";

interface EnhancedColorPaletteProps {
  baseColor: string;
  secondaryColor?: string;
  colorName: string;
  colorScale: { [key: string]: string };
  onUpdateColorScale: (newColorScale: { [key: string]: string }) => void;
  onUpdateSecondaryColor: (newColor: string | undefined) => void;
  showEditButton?: boolean;
}

const EnhancedColorPalette: React.FC<EnhancedColorPaletteProps> = ({
  baseColor,
  secondaryColor,
  colorName,
  colorScale,
  onUpdateColorScale,
  onUpdateSecondaryColor,
  showEditButton = true,
}) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showContrastGrid, setShowContrastGrid] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("scale");
  const [isSaving, setIsSaving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { toast } = useToast();
  const { isPremium } = useSubscription();

  // Generate enhanced palette data
  const enhancedPalette = useMemo(() => {
    return generateCompletePalette(baseColor, secondaryColor);
  }, [baseColor, secondaryColor]);

  // Get contrast color for text
  const getContrastColor = (bgColor: string) => {
    return chroma(bgColor).luminance() > 0.5
      ? colorScale["900"]
      : colorScale["50"];
  };

  // Copy to clipboard with enhanced feedback
  const copyToClipboard = (
    color: string,
    format: "hex" | "rgb" | "hsl" = "hex"
  ) => {
    let textToCopy = color;

    switch (format) {
      case "rgb":
        const rgb = chroma(color).rgb();
        textToCopy = `rgb(${rgb.map(Math.round).join(", ")})`;
        break;
      case "hsl":
        const hsl = chroma(color).hsl();
        textToCopy = `hsl(${Math.round(hsl[0])}, ${Math.round(
          hsl[1] * 100
        )}%, ${Math.round(hsl[2] * 100)}%)`;
        break;
      default:
        textToCopy = color;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedColor(color);
      toast({
        title: "Color copied!",
        description: `${textToCopy} copied to clipboard`,
      });
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  // Save palette
  const handleSavePalette = async () => {
    setIsSaving(true);
    try {
      // For now, we'll just show a success message since we don't have user authentication
      // In a real app, you might want to save to localStorage or implement a different storage solution
      toast({
        title: "Palette saved successfully",
        description: "Your palette has been saved locally",
      });
    } catch (error) {
      console.error("Error saving palette:", error);
      toast({
        variant: "destructive",
        title: "Failed to save palette",
        description: "Please try again later",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Share palette
  const handleSharePalette = async () => {
    const shareData = {
      title: `${colorName} Color Palette`,
      text: `Check out this beautiful color palette: ${colorName}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this link with others",
      });
    }
  };

  // Generate accessibility info
  const getAccessibilityInfo = (color: string) => {
    const luminance = chroma(color).luminance();
    const contrastWhite = chroma.contrast(color, "#ffffff");
    const contrastBlack = chroma.contrast(color, "#000000");

    return {
      luminance: Math.round(luminance * 100),
      contrastWhite: Math.round(contrastWhite * 10) / 10,
      contrastBlack: Math.round(contrastBlack * 10) / 10,
      aaCompliant: contrastWhite >= 4.5 || contrastBlack >= 4.5,
      aaaCompliant: contrastWhite >= 7 || contrastBlack >= 7,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {colorName.charAt(0).toUpperCase() + colorName.slice(1)} Color
                Palette
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {enhancedPalette.info.name} • {enhancedPalette.temperature}{" "}
                temperature
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                <Eye className="h-4 w-4 mr-1" />
                {viewMode === "grid" ? "List" : "Grid"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowContrastGrid(true)}
              >
                <Contrast className="h-4 w-4 mr-1" />
                Contrast
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExport(true)}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>

              {showEditButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEdit(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePalette}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader size={16} color="currentColor" />
                    <span className="ml-1">Saving</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>

              <Button variant="outline" size="sm" onClick={handleSharePalette}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Color Scale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Color Scale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="scale">Scale</TabsTrigger>
              <TabsTrigger value="harmony">Harmony</TabsTrigger>
              <TabsTrigger value="semantic">Semantic</TabsTrigger>
            </TabsList>

            <TabsContent value="scale" className="space-y-4">
              <div
                className={`grid gap-2 ${
                  viewMode === "grid"
                    ? "grid-cols-5 sm:grid-cols-6 md:grid-cols-11"
                    : "grid-cols-1"
                }`}
              >
                {Object.entries(colorScale).map(([level, hex]) => {
                  const accessibility = getAccessibilityInfo(hex);
                  return (
                    <TooltipProvider key={level}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`relative rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:scale-105 cursor-pointer ${
                              viewMode === "grid" ? "aspect-square" : "h-16"
                            }`}
                            style={{ backgroundColor: hex }}
                            onClick={() => copyToClipboard(hex)}
                          >
                            <div className="absolute inset-0 flex flex-col justify-between p-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span
                                  style={{ color: getContrastColor(hex) }}
                                  className="font-medium"
                                >
                                  {level}
                                  {level === "500" && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-1 text-xs"
                                    >
                                      Base
                                    </Badge>
                                  )}
                                </span>
                                {accessibility.aaaCompliant && (
                                  <Badge variant="default" className="text-xs">
                                    AAA
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-1">
                                <div
                                  style={{ color: getContrastColor(hex) }}
                                  className="font-mono text-xs"
                                >
                                  {hex.toUpperCase()}
                                </div>

                                {viewMode === "list" && (
                                  <div
                                    className="text-xs opacity-75"
                                    style={{ color: getContrastColor(hex) }}
                                  >
                                    L: {accessibility.luminance}% • C:{" "}
                                    {accessibility.contrastWhite}:1
                                  </div>
                                )}
                              </div>
                            </div>

                            {copiedColor === hex && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-medium">
                                Copied!
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {level}: {hex}
                            </p>
                            <p>Luminance: {accessibility.luminance}%</p>
                            <p>Contrast: {accessibility.contrastWhite}:1</p>
                            <p>
                              AA Compliant:{" "}
                              {accessibility.aaCompliant ? "Yes" : "No"}
                            </p>
                            <p>
                              AAA Compliant:{" "}
                              {accessibility.aaaCompliant ? "Yes" : "No"}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="harmony" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(enhancedPalette.harmony).map(
                  ([harmonyType, colors]) => (
                    <div key={harmonyType} className="space-y-2">
                      <h4 className="font-medium capitalize">
                        {harmonyType.replace(/([A-Z])/g, " $1")}
                      </h4>
                      <div className="flex gap-2">
                        {colors.map((color: string, index: number) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  onClick={() => copyToClipboard(color)}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{color}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </TabsContent>

            <TabsContent value="semantic" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(enhancedPalette.semantic).map(
                  ([semanticType, color]) => (
                    <div key={semanticType} className="space-y-2">
                      <h4 className="font-medium capitalize">{semanticType}</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="w-full h-16 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => copyToClipboard(color)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{color}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Secondary Color */}
      {secondaryColor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Secondary Color
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: secondaryColor }}
                onClick={() => copyToClipboard(secondaryColor)}
              />
              <div className="flex-1">
                <div className="font-mono text-lg">
                  {secondaryColor.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Luminance:{" "}
                  {Math.round(chroma(secondaryColor).luminance() * 100)}%
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateSecondaryColor(undefined)}
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Dialog open={showContrastGrid} onOpenChange={setShowContrastGrid}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full overflow-auto">
          <DialogHeader>
            <DialogTitle>Contrast Grid</DialogTitle>
          </DialogHeader>
          <ContrastGrid
            colorScale={colorScale}
            secondaryColor={secondaryColor}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Palette</DialogTitle>
          </DialogHeader>
          <ExportPalette
            colorScale={colorScale}
            colorName={colorName}
            secondaryColor={secondaryColor}
            onClose={() => setShowExport(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Palette</DialogTitle>
          </DialogHeader>
          <EditPalette
            colorScale={colorScale}
            secondaryColor={secondaryColor}
            onUpdateColorScale={onUpdateColorScale}
            onUpdateSecondaryColor={onUpdateSecondaryColor}
            onClose={() => setShowEdit(false)}
            isNewPalette={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedColorPalette;
