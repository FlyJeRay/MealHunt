import { useState } from 'react';
import { mealData, mealDefaultData } from '../../../mealTypes';
import { Link } from 'react-router-dom';

export const RandomMealTest = () => {
  const [meal, setMeal] = useState<mealData>(mealDefaultData);

  const pullData = async () => {
    const data: Response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const json: mealData = await data.json();

    setMeal(json);
  }

  const pushData = () => {
    const datastr: string | null = localStorage.getItem('fjr_mealhunt_mealidlist');
    const id = meal.meals[0].idMeal;
    if (!datastr?.split(' ').includes(id)) {
      const newdata: string = typeof datastr !== 'string' ? id + ' ' : datastr + id + ' ';
      console.log('newdata:', newdata);
      localStorage.setItem('fjr_mealhunt_mealidlist', newdata);
    }
  }

  const clearData = () => {
    localStorage.setItem('fjr_mealhunt_mealidlist', '');
  }
 
  return (
    <div>
      <Link to="/display">display</Link>
      <button onClick={clearData}>clear</button>
      {
        meal.meals[0].idMeal !== '-1' ? 
          <div>
            <h4>{meal.meals[0].strMeal}</h4> 
            <p>{meal.meals[0].idMeal}</p>
          </div> 
          : 
          null
      }
      {
        meal.meals[0].idMeal !== '0' ? 
          <div>
            <button onClick={pushData}>Push Meal</button>
            <button onClick={pullData}>Pull Meal</button>
          </div> 
          : 
          <button onClick={pullData}>Pull Meal</button>
      }
    </div>
  )
}