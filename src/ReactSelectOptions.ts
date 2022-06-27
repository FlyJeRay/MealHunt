import { mealAreas, mealCategories, mealIngredients } from "./mealTypes";

export type selectOptions = [ { value: string, label: string } ]

export const rso_pullCategories = async (): Promise<selectOptions> => {
  const categoriesData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
  const categoriesJSON: mealCategories = await categoriesData.json();

  const categoryOptions: selectOptions = [ { value: '', label: 'ANY CATEGORY' } ];

  categoriesJSON.meals.forEach(val => {
    categoryOptions.push( { value: val.strCategory, label: val.strCategory.toUpperCase() } );
  });

  return categoryOptions;
}

export const rso_pullAreas = async (): Promise<selectOptions> => {
  const areasData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const areasJSON: mealAreas = await areasData.json();

  const areasOptions: selectOptions = [ { value: '', label: 'ANY AREA' } ];

  areasJSON.meals.forEach(val => {
    areasOptions.push( { value: val.strArea, label: val.strArea.toUpperCase() } );
  });

  return areasOptions;
}

export const rso_pullMainIngredients = async (): Promise<selectOptions> => {
  const ingredientsData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
  const ingredientsJSON: mealIngredients = await ingredientsData.json();

  const ingredientsOptions: selectOptions = [ { value: '', label: 'ANY MAIN INGREDIENT' } ];

  ingredientsJSON.meals.forEach(val => {
    ingredientsOptions.push( { value: val.strIngredient, label: val.strIngredient.toUpperCase() } );
  });

  return ingredientsOptions;
}