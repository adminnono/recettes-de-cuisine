import { useState, useEffect } from 'react';
import { Recipe, ApiResponse } from '../types/Recipe';

export const useRecipes = (searchTerm: string) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchRecipes = async () => {
      if (!searchTerm.trim()) {
        setRecipes([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la recherche');
        }

        const data: ApiResponse = await response.json();
        setRecipes(data.meals || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchRecipes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return {
    recipes,
    loading,
    error,
  };
};