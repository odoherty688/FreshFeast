export const mockRecipeList = {
    data: {
        hits: [
          {
            recipe: {
              label: 'Test Recipe 2',
              images: { REGULAR: { url: 'https://example.com/regular2.jpg' }, SMALL: { url: 'https://example.com/small2.jpg' }, THUMBNAIL: { url: 'https://example.com/thumbnail2.jpg' }},
              ingredientLines: ['Ingredient 3', 'Ingredient 4'],
              cuisineType: ['cuisine1'],
              mealType: ['meal1'],
              dishType: ['dish1', 'dish2'],
              calories: 200.4,
              dietLabels: ['diet1', 'diet2'],
              healthLabels: ['health1', 'health2'],
              cautions: ['caution1', 'caution2'],
              co2EmissionsClass: 'low',
              totalCO2Emissions: 100,
              uri: 'https://example.com/recipe_2',
            }
          },
          {
            recipe: {
              label: 'Test Recipe 3',
              images: { REGULAR: { url: 'https://example.com/regular3.jpg' }, SMALL: { url: 'https://example.com/small3.jpg' }, THUMBNAIL: { url: 'https://example.com/thumbnail3.jpg' }},
              ingredientLines: ['Ingredient 5', 'Ingredient 6'],
              cuisineType: ['cuisine1'],
              mealType: ['meal1'],
              dishType: ['dish1', 'dish2'],
              calories: 200.4,
              dietLabels: ['diet1', 'diet2'],
              healthLabels: ['health1', 'health2'],
              cautions: ['caution1', 'caution2'],
              co2EmissionsClass: 'low',
              totalCO2Emissions: 100,
              uri: 'https://example.com/recipe_3',
            }
          }
        ]
      },
      status: 200
}

export const mockRecipe = {
    data: {
        hits: [
          {
            recipe: {
              label: 'Test Recipe 1',
              images: { REGULAR: { url: 'https://example.com/regular.jpg' }, SMALL: { url: 'https://example.com/small.jpg' }, THUMBNAIL: { url: 'https://example.com/thumbnail.jpg' }},
              ingredientLines: ['Ingredient 1', 'Ingredient 2'],
              cuisineType: ['cuisine1'],
              mealType: ['meal1'],
              dishType: ['dish1', 'dish2'],
              calories: 200.4,
              dietLabels: ['diet1', 'diet2'],
              healthLabels: ['health1', 'health2'],
              cautions: ['caution1', 'caution2'],
              co2EmissionsClass: 'low',
              totalCO2Emissions: 100,
              uri: 'https://example.com/recipe_1',
            }
          }
        ]
      },
      status: 200
}

export const mockRecipeSingle = {
  data: {
    recipe: {
      label: 'Test Recipe 1',
      images: { REGULAR: { url: 'https://example.com/regular.jpg' }, SMALL: { url: 'https://example.com/small.jpg' }, THUMBNAIL: { url: 'https://example.com/thumbnail.jpg' }},
      ingredientLines: ['Ingredient 1', 'Ingredient 2'],
      ingredients: [{ food: 'ingredient A' }, { food: 'ingredient B' }],
      cuisineType: ['cuisine1'],
      mealType: ['meal1'],
      dishType: ['dish1', 'dish2'],
      calories: 200.4,
      dietLabels: ['diet1', 'diet2'],
      healthLabels: ['health1', 'health2'],
      cautions: ['caution1', 'caution2'],
      co2EmissionsClass: 'low',
      totalCO2Emissions: 100,
      uri: 'https://example.com/recipe_1',
    }
  },
  status: 200
}

export const mockNoRecipesFound = {
  data: {
    hits: []
  },
  status: 200
}

export const mockRecipeFail = {
    data: {

    },
    status: 400
}