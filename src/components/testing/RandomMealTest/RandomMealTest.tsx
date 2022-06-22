import { useContext, useState } from 'react';
import { MealsContext } from '../../../mealContext';
import { mealData, mealDefaultData } from '../../../mealTypes';
import { Link } from 'react-router-dom';

export const RandomMealTest = () => {
  const [meal, setMeal] = useState<mealData>(mealDefaultData);
  const { contextData, setContextData } = useContext(MealsContext);

  const pullData = async () => {
    const data: Response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const json: mealData = await data.json();

    setMeal(json);
  }

  const pushData = () => {
    setContextData([...contextData, meal.meals[0].idMeal]);
  }
 
  return (
    <div>
      <Link to="/display">display</Link>
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