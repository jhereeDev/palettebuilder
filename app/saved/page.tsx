"use client";

import { useState, useEffect, useCallback } from "react";
import SavedColorPalette from "@/components/SavedColorPalette";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function SavedPalettes() {
  const [currentPage, setCurrentPage] = useState(1);
  const palettesPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedPalettes, setPaginatedPalettes] = useState<any[]>([]);
  const [palettes, setPalettes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserPalettes = useCallback(async () => {
    setIsLoading(true);
    try {
      // For now, we'll show a message that saved palettes are not available without authentication
      // In a real app, you might want to implement localStorage or a different storage solution
      setPalettes([]);
      setTotalPages(0);
      updatePaginatedPalettes([], 1);
      toast({
        title: "Saved palettes not available",
        description: "Please sign in to save and view your palettes",
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

  const updatePaginatedPalettes = (allPalettes: any[], page: number) => {
    const startIndex = (page - 1) * palettesPerPage;
    setPaginatedPalettes(
      allPalettes.slice(startIndex, startIndex + palettesPerPage)
    );
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/deletePalette/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete palette");
      }

      const updatedPalettes = palettes.filter((palette) => palette.id !== id);
      setPalettes(updatedPalettes);
      setTotalPages(Math.ceil(updatedPalettes.length / palettesPerPage));
      updatePaginatedPalettes(updatedPalettes, currentPage);
      toast({ title: "Palette deleted successfully" });
    } catch (error) {
      console.error("Error deleting palette:", error);
      toast({ variant: "destructive", title: "Failed to delete palette" });
    }
  };

  const handleUpdate = (id: string, updatedPalette: any) => {
    const updatedPalettes = palettes.map((palette) =>
      palette.id === id ? { ...palette, ...updatedPalette } : palette
    );
    setPalettes(updatedPalettes);
    updatePaginatedPalettes(updatedPalettes, currentPage);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1) ||
        (currentPage <= 3 && i <= maxVisiblePages) ||
        (currentPage >= totalPages - 2 && i >= totalPages - maxVisiblePages + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (currentPage > 3 && i === 2) ||
        (currentPage < totalPages - 2 && i === totalPages - 1)
      ) {
        items.push(<PaginationEllipsis key={`ellipsis-${i}`} />);
      }
    }

    return items;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    updatePaginatedPalettes(palettes, page);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleEditComplete = () => {
    fetchUserPalettes();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={48} color="#3B82F6" />
      </div>
    );
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
        <>
          {paginatedPalettes.map((palette) => (
            <SavedColorPalette
              key={palette.id}
              id={palette.id}
              name={palette.name}
              primaryColor={palette.primaryColor}
              secondaryColor={palette.secondaryColor}
              colorScale={JSON.parse(palette.colorScale)}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onEditComplete={handleEditComplete}
            />
          ))}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
