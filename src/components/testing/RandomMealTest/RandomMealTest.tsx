import { useEffect, useState } from 'react';

type mealData = {
  meals: [
    {
      idMeal: string,
      strMeal: string
    }
  ]
}

const mealDefaultData: mealData = {
  meals: [
    {
      idMeal: '0',
      strMeal: 'hamburger'
    }
  ]
}

export const RandomMealTest = () => {
  const [meal, setMeal] = useState<mealData>(mealDefaultData);

  useEffect(() => { pullData() }, []);

  const pullData = async () => {
    const data: Response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const json: mealData = await data.json();

    setMeal(json);
  }

  return (
    <div>
      <h4>{meal.meals[0].strMeal}</h4>
      <p>{meal.meals[0].idMeal}</p>
    </div>
  )
}