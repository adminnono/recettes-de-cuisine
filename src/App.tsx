import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { RecipeCard } from "./components/RecipeCard";
import { FavoritesList } from "./components/FavoritesList";
import { RecipeDetail } from "./components/RecipeDetail";
import { useRecipes } from "./hooks/useRecipes";
import { Recipe } from "./types/Recipe";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("favoriteRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  const { recipes, loading, error } = useRecipes(searchTerm);

  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.idMeal !== recipe.idMeal);
    } else {
      newFavorites = [...favorites, recipe];
    }

    setFavorites(newFavorites);
    localStorage.setItem("favoriteRecipes", JSON.stringify(newFavorites));
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some((fav) => fav.idMeal === recipeId);
  };

  useEffect(() => {
    setSearchTerm("chicken");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ChefHat className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cuisin’&Co</h1>
                <p className="text-gray-600">
                  Découvrez de délicieuses recettes
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                showFavorites
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-50"
              }`}
            >
              {showFavorites
                ? "Voir toutes les recettes"
                : `Mes favoris (${favorites.length})`}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showFavorites && (
          <div className="mb-8">
            <SearchBar
              searchTerm={searchTerm}
              setSearchQuery={setSearchTerm}
              placeholder="Rechercher une recette (ex: chicken, pasta, cake...)"
            />
          </div>
        )}

        {showFavorites ? (
          <FavoritesList
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <div>
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                <span className="ml-3 text-gray-600">
                  Recherche en cours...
                </span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 font-medium">
                    Erreur lors de la recherche
                  </p>
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && recipes.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-gray-600">
                    Aucune recette trouvée pour "{searchTerm}"
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Essayez avec d'autres mots-clés
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && searchTerm === "" && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Commencez votre recherche de recettes
                </p>
                <p className="text-gray-500">
                  Tapez le nom d'un plat ou d'un ingrédient
                </p>
              </div>
            )}

            {recipes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.idMeal}
                    recipe={recipe}
                    isFavorite={isFavorite(recipe.idMeal)}
                    onToggleFavorite={() => toggleFavorite(recipe)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("favoriteRecipes");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.idMeal !== recipe.idMeal);
    } else {
      newFavorites = [...favorites, recipe];
    }

    setFavorites(newFavorites);
    localStorage.setItem("favoriteRecipes", JSON.stringify(newFavorites));
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some((fav) => fav.idMeal === recipeId);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/recipe/:id"
          element={
            <RecipeDetail
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
