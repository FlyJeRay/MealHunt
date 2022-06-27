import { useEffect, useState } from "react"
import { mealData, mealDefaultData, singleMealData } from "../../mealTypes";
import { parseIngredients } from "../../IngredientsParser";
import Select from 'react-select';

import './DisplayPage.css'
import { rso_pullAreas, rso_pullCategories, rso_pullMainIngredients, selectOptions } from "../../ReactSelectOptions";

export const DisplayPage = () => {
  const [mealsData, setMealsData] = useState<mealData[]>([mealDefaultData]);

  const [categoriesOptions, setCategoriesOptions] = useState<selectOptions>([ { value: '', label: '' } ]);
  const [areasOptions, setAreasOptions] = useState<selectOptions>([ { value: '', label: '' } ]);
  const [ingredientsOptions, setIngredientsOptions] = useState<selectOptions>([ { value: '', label: '' } ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');

  useEffect(() => { 
    pullData();
    pullOptions();
  }, []);
  
  const pullOptions = async() => {
    // Using functions that are exported from src/ReactSelectOptions.ts
    // They are also used insrc/components/RandomMealPage/ RandomMealPage.tsx
    const categories: selectOptions = await rso_pullCategories();
    setCategoriesOptions(categories);

    const areas: selectOptions = await rso_pullAreas();
    setAreasOptions(areas);

    const ingredients: selectOptions = await rso_pullMainIngredients();
    setIngredientsOptions(ingredients);
  }

  const pullData = async () => {
    const data: string | null = localStorage.getItem('fjr_mealhunt_mealidlist');

    const ids: string[] = typeof data === 'string' ? data.split(' ') : [];

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

  const removeMeal = (removedID: string) => {
    const data: string | null = localStorage.getItem('fjr_mealhunt_mealidlist');
    let ids: string[] = typeof data === 'string' ? data.split(' ') : [];

    ids = ids.filter(id => id !== removedID).filter(id => id !== '');

    localStorage.setItem('fjr_mealhunt_mealidlist', ids.join(' ') + ' ');
    pullData();
  }

  const display = () => {
    const arr: mealData[] = mealsData;

    if (arr.length !== 0 && !(arr.length === 1 && arr[0].meals[0].idMeal === '-1')) {
      const jsxarr: JSX.Element[] = [];

      arr.forEach((val, i) => {
        const meal: singleMealData = val.meals[0];
        
        const ingredients = parseIngredients(meal);

        if (
          (selectedArea !== '' && meal.strArea === selectedArea || selectedArea === '') &&
          (selectedCategory !== '' && meal.strCategory === selectedCategory || selectedCategory === '') &&
          (selectedIngredient !== '' && meal.strIngredient1 == selectedIngredient || selectedIngredient === '')
        ) {
          jsxarr.push(
            <div tabIndex={1} className="single_meal_block" key={`${i}-${meal.idMeal}`}>
              <h4 className="meal_title">{meal.strMeal}</h4>
              <p className="meal_subtitle">{meal.strArea} {meal.strCategory} meal</p>
              <div className="meal_info_hidden">
                {
                  meal.strYoutube != '' ? <a className="meal_yt_link" href={meal.strYoutube} target='_blank'>Check this meal on YouTube</a> : null
                }
                <p>Ingredients:</p>
                <ul>
                  {
                    ingredients.map((ing, i) => {
                      return( ing.amount > '' && ing.name > '' ? <li key={`ing${i}`}>{ing.name}: {ing.amount}</li> : null )
                    })
                  }
                </ul>
                <p>{meal.strInstructions}</p>
                <button className="remove_button" onClick={() => removeMeal(meal.idMeal)}>Remove</button>
              </div>
            </div>
          );
        }        
      })

      return (
        <div className="meal_list_block">
          { jsxarr }
        </div>
      );
    }
    else {
      return <p className="no_meals_text">We don't see any meals in your list!</p>
    }
  }

  return(
    <div>
      <div className="search_parameters_block">
        <Select defaultValue={{value: '', label: 'ANY CATEGORY'}} className='search_parameter_select' options={categoriesOptions} onChange={(event) => setSelectedCategory(event ? event.value : '')} placeholder='Select Meal Category' />
        <Select defaultValue={{value: '', label: 'ANY AREA'}} className='search_parameter_select' options={areasOptions} onChange={(event) => setSelectedArea(event ? event.value : '')} placeholder='Select Meal Area' />
        <Select defaultValue={{value: '', label: 'ANY MAIN INGREDIENT'}} className='search_parameter_select' options={ingredientsOptions} onChange={(event) => setSelectedIngredient(event ? event.value : '')} placeholder='Select Main Ingredient' /></div>
      <div>
        {
          display()
        }
      </div>
    </div>
  )
}