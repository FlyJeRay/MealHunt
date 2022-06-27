import { singleMealData } from "../mealTypes";

// I wanted to parse it with a loop, but, sadly, JS doesn't allow to use 
// checkedMeal[`strMeasure${i}`] and checkedMeal[`strIngredient${i}`]: it is required to have
// a string that is definetely in the object.

// And, sadly, ingredients are not an array.

// Exporting this function not to write it in both DisplayPage and RandomMealPage
export const parseIngredients = (checkedMeal: singleMealData): { amount: string, name: string }[] => {
  const ingredients: { amount: string, name: string }[] = [];

  if (checkedMeal.strIngredient1 > '') ingredients.push({ amount: checkedMeal.strMeasure1, name: checkedMeal.strIngredient1.charAt(0).toUpperCase() + checkedMeal.strIngredient1.slice(1) });
  if (checkedMeal.strIngredient2 > '') ingredients.push({ amount: checkedMeal.strMeasure2, name: checkedMeal.strIngredient2.charAt(0).toUpperCase() + checkedMeal.strIngredient2.slice(1) });
  if (checkedMeal.strIngredient3 > '') ingredients.push({ amount: checkedMeal.strMeasure3, name: checkedMeal.strIngredient3.charAt(0).toUpperCase() + checkedMeal.strIngredient3.slice(1) });
  if (checkedMeal.strIngredient4 > '') ingredients.push({ amount: checkedMeal.strMeasure4, name: checkedMeal.strIngredient4.charAt(0).toUpperCase() + checkedMeal.strIngredient4.slice(1) });
  if (checkedMeal.strIngredient5 > '') ingredients.push({ amount: checkedMeal.strMeasure5, name: checkedMeal.strIngredient5.charAt(0).toUpperCase() + checkedMeal.strIngredient5.slice(1) });
  if (checkedMeal.strIngredient6 > '') ingredients.push({ amount: checkedMeal.strMeasure6, name: checkedMeal.strIngredient6.charAt(0).toUpperCase() + checkedMeal.strIngredient6.slice(1) });
  if (checkedMeal.strIngredient7 > '') ingredients.push({ amount: checkedMeal.strMeasure7, name: checkedMeal.strIngredient7.charAt(0).toUpperCase() + checkedMeal.strIngredient7.slice(1) });
  if (checkedMeal.strIngredient8 > '') ingredients.push({ amount: checkedMeal.strMeasure8, name: checkedMeal.strIngredient8.charAt(0).toUpperCase() + checkedMeal.strIngredient8.slice(1) });
  if (checkedMeal.strIngredient9 > '') ingredients.push({ amount: checkedMeal.strMeasure9, name: checkedMeal.strIngredient9.charAt(0).toUpperCase() + checkedMeal.strIngredient9.slice(1) });
  if (checkedMeal.strIngredient10 > '') ingredients.push({ amount: checkedMeal.strMeasure10, name: checkedMeal.strIngredient10.charAt(0).toUpperCase() + checkedMeal.strIngredient10.slice(1) });
  if (checkedMeal.strIngredient11 > '') ingredients.push({ amount: checkedMeal.strMeasure11, name: checkedMeal.strIngredient11.charAt(0).toUpperCase() + checkedMeal.strIngredient11.slice(1) });
  if (checkedMeal.strIngredient12 > '') ingredients.push({ amount: checkedMeal.strMeasure12, name: checkedMeal.strIngredient12.charAt(0).toUpperCase() + checkedMeal.strIngredient12.slice(1) });
  if (checkedMeal.strIngredient13 > '') ingredients.push({ amount: checkedMeal.strMeasure13, name: checkedMeal.strIngredient13.charAt(0).toUpperCase() + checkedMeal.strIngredient13.slice(1) });
  if (checkedMeal.strIngredient14 > '') ingredients.push({ amount: checkedMeal.strMeasure14, name: checkedMeal.strIngredient14.charAt(0).toUpperCase() + checkedMeal.strIngredient14.slice(1) });
  if (checkedMeal.strIngredient15 > '') ingredients.push({ amount: checkedMeal.strMeasure15, name: checkedMeal.strIngredient15.charAt(0).toUpperCase() + checkedMeal.strIngredient15.slice(1) });
  if (checkedMeal.strIngredient16 > '') ingredients.push({ amount: checkedMeal.strMeasure16, name: checkedMeal.strIngredient16.charAt(0).toUpperCase() + checkedMeal.strIngredient16.slice(1) });
  if (checkedMeal.strIngredient17 > '') ingredients.push({ amount: checkedMeal.strMeasure17, name: checkedMeal.strIngredient17.charAt(0).toUpperCase() + checkedMeal.strIngredient17.slice(1) });
  if (checkedMeal.strIngredient18 > '') ingredients.push({ amount: checkedMeal.strMeasure18, name: checkedMeal.strIngredient18.charAt(0).toUpperCase() + checkedMeal.strIngredient18.slice(1) });
  if (checkedMeal.strIngredient19 > '') ingredients.push({ amount: checkedMeal.strMeasure19, name: checkedMeal.strIngredient19.charAt(0).toUpperCase() + checkedMeal.strIngredient19.slice(1) });
  if (checkedMeal.strIngredient20 > '') ingredients.push({ amount: checkedMeal.strMeasure20, name: checkedMeal.strIngredient20.charAt(0).toUpperCase() + checkedMeal.strIngredient20.slice(1) });

  return ingredients;
}