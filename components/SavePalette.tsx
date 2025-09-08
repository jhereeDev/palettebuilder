"use client";

import { useState, useEffect, useCallback } from "react";
import SavedColorPalette from "@/components/SavedColorPalette";
import { useToast } from "@/components/ui/use-toast";

export default function SavedPalettes() {
  const [palettes, setPalettes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserPalettes = useCallback(async () => {
    setIsLoading(true);
    try {
      // For now, we'll show a message that saved palettes are not available without authentication
      // In a real app, you might want to implement localStorage or a different storage solution
      setPalettes([]);
      toast({
        title: "Saved palettes not available",
        description: "Authentication is currently disabled",
      });
    } catch (error) {
      console.error("Error fetching palettes:", error);
      toast({ variant: "destructive", title: "Failed to load palettes" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUserPalettes();
  }, [fetchUserPalettes]);

  const handleDelete = (id: string) => {
    setPalettes(palettes.filter((palette) => palette.id !== id));
  };

  const handleUpdate = (id: string, updatedPalette: any) => {
    setPalettes(
      palettes.map((palette) =>
        palette.id === id ? { ...palette, ...updatedPalette } : palette
      )
    );
  };

  const handleEditComplete = () => {
    fetchUserPalettes();
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading palettes...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Saved Palettes</h1>
      {palettes.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            You haven&apos;t saved any palettes yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Authentication is currently disabled. All features are available
            without signing in.
          </p>
        </div>
      ) : (
        palettes.map((palette) => (
          <SavedColorPalette
            key={palette.id}
            id={palette.id}
            name={palette.name}
            primaryColor={palette.primaryColor}
            secondaryColor={palette.secondaryColor}
            colorScale={palette.colorScale}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onEditComplete={handleEditComplete}
          />
        ))
      )}
    </div>
  );
}
