export type mealData = {
  meals: [
    {
      idMeal: string,
      strMeal: string
    }
  ]
}

export const mealDefaultData: mealData = {
  meals: [
    {
      idMeal: '-1',
      strMeal: 'hamburger'
    }
  ]
}