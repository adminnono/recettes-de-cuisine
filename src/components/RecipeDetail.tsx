import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Tag, ExternalLink, Clock, Users } from 'lucide-react';
import { Recipe, ApiResponse, Ingredient } from '../types/Recipe';

interface RecipeDetailProps {
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: (recipeId: string) => boolean;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  favorites,
  onToggleFavorite,
  isFavorite
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement de la recette');
        }

        const data: ApiResponse = await response.json();
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        } else {
          setError('Recette non trouvée');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const getIngredients = (recipe: Recipe): Ingredient[] => {
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
      const measure = recipe[`strMeasure${i}` as keyof Recipe];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || ''
        });
      }
    }
    return ingredients;
  };

  const handleToggleFavorite = () => {
    if (recipe) {
      onToggleFavorite(recipe);
    }
  };

  const openYouTube = () => {
    if (recipe?.strYoutube) {
      window.open(recipe.strYoutube, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 
                          border-orange-200 border-t-orange-600"></div>
            <p className="text-gray-600 mt-4">Chargement de la recette...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-orange-600 hover:text-orange-700 
                     transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour à la recherche
          </button>
          
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-600 font-medium text-lg">Erreur</p>
              <p className="text-red-500 mt-2">{error || 'Recette non trouvée'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(recipe);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 
                     transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour à la recherche
          </button>
          
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 
                       ${isFavorite(recipe.idMeal)
                         ? 'bg-red-500 text-white shadow-lg hover:bg-red-600' 
                         : 'bg-white text-gray-600 border border-gray-200 hover:text-red-500 hover:border-red-200'
                       }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite(recipe.idMeal) ? 'fill-current' : ''}`} />
            {isFavorite(recipe.idMeal) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </button>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* En-tête de la recette */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">{recipe.strMeal}</h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <span>{recipe.strCategory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{recipe.strArea}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Ingrédients */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="h-6 w-6 text-orange-500" />
                    Ingrédients ({ingredients.length})
                  </h2>
                  
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between items-center py-3 px-4 
                                                bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-gray-900">{ingredient.name}</span>
                        <span className="text-sm text-orange-600 font-medium">
                          {ingredient.measure}
                        </span>
                      </div>
                    ))}
                  </div>

                  {recipe.strYoutube && (
                    <button
                      onClick={openYouTube}
                      className="mt-6 w-full bg-red-600 text-white py-3 px-4 rounded-xl 
                               hover:bg-red-700 transition-colors duration-200 flex items-center 
                               justify-center gap-2 font-medium"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Voir la vidéo YouTube
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-orange-500" />
                  Instructions de préparation
                </h2>
                
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                    {recipe.strInstructions.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="mb-4">
                          {paragraph.trim()}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};