import React from 'react';
import { Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types/Recipe';

interface FavoritesListProps {
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onToggleFavorite
}) => {
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Aucune recette favorite pour le moment</p>
        <p className="text-gray-400 text-sm mt-2">
          Utilisez le cœur sur les recettes pour les ajouter à vos favoris
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        Mes Recettes Favorites ({favorites.length})
      </h2>
      
      <div className="space-y-4">
        {favorites.map((recipe) => (
          <div
            key={recipe.idMeal}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 
                     p-4 flex items-center gap-4 cursor-pointer"
            onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
          >
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-16 h-16 rounded-lg object-cover"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{recipe.strMeal}</h3>
              <p className="text-sm text-gray-600">{recipe.strCategory} • {recipe.strArea}</p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe);
              }}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 
                       transition-all duration-200"
              title="Retirer des favoris"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};