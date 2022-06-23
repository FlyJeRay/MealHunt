import { useState } from "react"
import { mealData, mealDefaultData } from "../../../mealTypes";
import { Link } from 'react-router-dom';

export const ContextDisplayTest = () => {
  const [mealsData, setMealsData] = useState<mealData[]>([mealDefaultData]);

  const pullData = async () => {
    const data: string | null = localStorage.getItem('fjr_mealhunt_mealidlist');

    const ids: string[] = typeof data === 'string' ? data.split(' ') : [];
    console.log('ids:', ids);

    const temp_meals: mealData[] = [];

    if (ids.length !== 0) {
      for (let i = 0; i < ids.length; i++) {
        if (ids[i] !== '') {
          const data: Response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ids[i]}`);
          const json: mealData = await data.json();
    
          temp_meals.push(json);
        }
      };
    }

    setMealsData(temp_meals);
  }

  const display = () => {
    const arr: mealData[] = mealsData;
    if (arr.length !== 0 && !(arr.length == 1 && arr[0].meals[0].idMeal == '-1')) {
      const jsxarr: JSX.Element[] = [];
      arr.forEach((val, i) => {
        jsxarr.push(
          <div key={`${i}-${val.meals[0].idMeal}`}>
            <h4>{val.meals[0].strMeal}</h4>
            <p>{val.meals[0].idMeal}</p>
          </div>
        );
      })
      return jsxarr;
    }
    else {
      return <p>no meals</p>
    }
  }

  return(
    <div>
      <Link to="/">main page</Link>
      <button onClick={pullData}>Display Meals</button>

      <div>
        {
          display()
        }
      </div>
    </div>
  )
}