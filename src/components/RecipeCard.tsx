import React, { useState } from 'react';
import { Heart, MapPin, Tag, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Recipe, Ingredient } from '../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  const openYouTube = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (recipe.strYoutube) {
      window.open(recipe.strYoutube, '_blank');
    }
  };

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.idMeal}`);
  };

  return (
    <div>
      <div 
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 
                 transform hover:scale-[1.02] cursor-pointer group overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <div className="relative h-48 bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 
                       ${isFavorite 
                         ? 'bg-red-500 text-white shadow-lg transform scale-110' 
                         : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
                       }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* YouTube Button */}
          {recipe.strYoutube && (
            <button
              onClick={openYouTube}
              className="absolute top-3 left-3 p-2 rounded-full bg-red-600 text-white 
                       opacity-0 group-hover:opacity-100 transition-all duration-200 
                       hover:scale-110 hover:bg-red-700"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 
                       transition-colors duration-200">
            {recipe.strMeal}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4 text-orange-500" />
              <span>{recipe.strCategory}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>{recipe.strArea}</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
            {recipe.strInstructions}
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Cliquez pour voir plus de détails</span>
          </div>
        </div>
      </div>
    </div>
  );
};