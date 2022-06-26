import { MutableRefObject, useEffect, useRef, useState } from "react"
import { mealData, mealDefaultData } from "../../../mealTypes";
import { Link } from 'react-router-dom';

export const ContextDisplayTest = () => {
  const [mealsData, setMealsData] = useState<mealData[]>([mealDefaultData]);

  const statusTextRef = useRef() as MutableRefObject<HTMLParagraphElement>

  useEffect(() => { pullData() }, []);

  const pullData = async () => {
    const data: string | null = localStorage.getItem('fjr_mealhunt_mealidlist');
    statusTextRef.current.innerHTML = 'Loading..';

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

    if (arr.length !== 0 && !(arr.length === 1 && arr[0].meals[0].idMeal === '-1')) {
      const jsxarr: JSX.Element[] = [];

      arr.forEach((val, i) => {
        jsxarr.push(
          <div key={`${i}-${val.meals[0].idMeal}`}>
            <h4>{val.meals[0].strMeal}</h4>
            <p>{val.meals[0].idMeal}</p>
          </div>
        );
      })

      statusTextRef.current.innerHTML = '';
      return jsxarr;
    }
    else {
      return <p>No Meals</p>
    }
  }

  return(
    <div>
      <button onClick={pullData}>Display Meals</button>
      <p ref={statusTextRef}></p>
      <div>
        {
          display()
        }
      </div>
    </div>
  )
}