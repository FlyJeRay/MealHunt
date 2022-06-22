import { useContext, useEffect, useState } from "react"
import { MealsContext } from "../../../mealContext"
import { mealData, mealDefaultData } from "../../../mealTypes";
import { Link } from 'react-router-dom';

export const ContextDisplayTest = () => {
  const { contextData, setContextData } = useContext(MealsContext);
  const [mealsData, setMealsData] = useState<mealData[]>([mealDefaultData]);

  const pullData = async () => {
    const ids: string[] = contextData;
    const temp_meals: mealData[] = [];

    for (let i = 0; i < ids.length; i++) {
      const data: Response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ids[i]}`);
      const json: mealData = await data.json();

      temp_meals.push(json);
      console.log('++');
    };

    console.log(temp_meals.length);

    setMealsData(temp_meals);
  }

  const display = () => {
    const arr: mealData[] = mealsData;
    if (!(arr.length == 1 && arr[0].meals[0].idMeal == '-1')) {
      console.log('rendering elements from ', arr, ' with length ', arr.length);
      const jsxarr: JSX.Element[] = [];
      arr.forEach(val => {
        console.log(val);
        jsxarr.push(
          <div key={val.meals[0].idMeal}>
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


  console.log('render');
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