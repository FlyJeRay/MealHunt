import { useEffect, useState } from 'react';
import { mealAreas, mealCategories, mealData, mealDefaultData, mealIngredients, shortMealData, singleMealData } from '../../mealTypes';
import Select from 'react-select';

import './RandomMealPage.css'
import { parseIngredients } from '../IngredientsParser';

type selectOptions = [ { value: string, label: string } ]

function shuffle(arr: singleMealData[]) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

export const RandomMealPage = () => {
  const [meal, setMeal] = useState<mealData>(mealDefaultData);

  const [statusText, setStatusText] = useState<string>('');

  const [categoriesOptions, setCategoriesOptions] = useState<selectOptions>([ { value: '', label: '' } ]);
  const [areasOptions, setAreasOptions] = useState<selectOptions>([ { value: '', label: '' } ]);
  const [ingredientsOptions, setIngredientsOptions] = useState<selectOptions>([ { value: '', label: '' } ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');

  useEffect(() => { 
    pullCategories();
    pullAreas();
    pullMainIngredients();
  }, []);

  const pullCategories = async () => {
    const categoriesData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const categoriesJSON: mealCategories = await categoriesData.json();

    const tempCategories: selectOptions = [ { value: '', label: 'ANY CATEGORY' } ];
    categoriesJSON.meals.forEach(val => {
      tempCategories.push( { value: val.strCategory, label: val.strCategory.toUpperCase() } );
    });
    setCategoriesOptions(tempCategories);
  }

  const pullAreas = async () => {
    const areasData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const areasJSON: mealAreas = await areasData.json();

    const tempAreas: selectOptions = [ { value: '', label: 'ANY AREA' } ];
    areasJSON.meals.forEach(val => {
      tempAreas.push( { value: val.strArea, label: val.strArea.toUpperCase() } );
    });
    setAreasOptions(tempAreas);
  }

  const pullMainIngredients = async () => {
    const ingredientsData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const ingredientsJSON: mealIngredients = await ingredientsData.json();

    const tempIngredients: selectOptions = [ { value: '', label: 'ANY MAIN INGREDIENT' } ];
    ingredientsJSON.meals.forEach(val => {
      tempIngredients.push( { value: val.strIngredient, label: val.strIngredient.toUpperCase() } );
    });
    setIngredientsOptions(tempIngredients);
  }

  const pullData = async () => {
    // resultJSON is the final output value
    let resultJSON: mealData = {} as mealData;
    setStatusText('Loading..');

    if (selectedCategory !== '' || selectedArea !== '' || selectedIngredient !== '') {
      // Both values will be assigned later, fetchedType will be used in filters
      let shortData: Response = new Response();
      let fetchedType: string = '';

      // Because TheMealDB doesn't allow to fetch data with multiple parameters (example: category + area),
      // we'll need to do a lot of magic here.

      // At first - fetching the 'primary' list (category > area > ingredient), and setting fetchedType for future filters.
      if (selectedCategory !== '') {
        shortData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`);
        fetchedType = 'category';
      }
      else if (selectedArea !== '') {
        shortData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`);
        fetchedType = 'area';
      }
      else if (selectedIngredient !== '') {
        shortData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredient}`);
        fetchedType = 'ingredient';
      }

      // If fetching with parameters, TheMealDB returns not the full data of meals - only name, image and ID. 
      // So, we create a separate 'short' JSON file with separate shortMealData type.
      const shortJSON: shortMealData = await shortData.json();
      // And the tempData is made with mealData[] type, which is also not convenient to use, but 
      // there is no other options using this API.
      let tempData: mealData[] = [];

      // Fetching full data of meals from shortJSON and pushing them to tempData
      for (let i = 0; i < shortJSON.meals.length; i++) {
        const data: Response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${shortJSON.meals[i].idMeal}`);
        const json: mealData = await data.json();

        tempData.push(json);
      }

      // If user selected more than one searching parameter, filtering the array
      if (selectedCategory !== '' && fetchedType !== 'category') {
        tempData = tempData.filter(meal => meal.meals[0].strCategory === selectedCategory);
      }
      if (selectedArea !== '' && fetchedType !== 'area') {
        tempData = tempData.filter(meal => meal.meals[0].strArea === selectedArea)
      };
      if (selectedIngredient !== '' && fetchedType !== 'ingredient') {
        tempData = tempData.filter(meal => meal.meals[0].strIngredient1 === selectedIngredient)
      };

      // Pushing meals to more convenient type
      let providedMeals: singleMealData[] = [];

      tempData.forEach(meal => {
        providedMeals.push(meal.meals[0]);
      });

      // Shuffling the array to get randomised meal
      resultJSON.meals = shuffle(providedMeals);

      // If there are no meals - showing error + random meal
      if (resultJSON === undefined || resultJSON.meals === undefined || resultJSON.meals[0] === undefined || resultJSON.meals[0].idMeal === undefined) {
        const data: Response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        resultJSON = await data.json();
        setStatusText("Sorry, but we couldn't find such meal in our database.");
      }
      // If everything works fine, clearing status paragraph.
      else {
        setStatusText('');
      }
    }

    // If there are no searching parameters - just giving the random meal.
    else {
      const data: Response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      resultJSON = await data.json();
      setStatusText('');
    }

    setMeal(resultJSON);
  }

  const pushData = () => {
    const datastr: string | null = localStorage.getItem('fjr_mealhunt_mealidlist');
    const id = meal.meals[0].idMeal;
    
    if (!datastr?.split(' ').includes(id)) {
      const newdata: string = typeof datastr !== 'string' ? id + ' ' : datastr + id + ' ';
      localStorage.setItem('fjr_mealhunt_mealidlist', newdata);
    }
  }

  const clearData = () => {
    localStorage.setItem('fjr_mealhunt_mealidlist', '');
  }

  const displayPulledMeal = (): JSX.Element | null => {
    if (meal.meals[0].idMeal !== '-1') {
      const checkedMeal: singleMealData = meal.meals[0];

      const ingredients: { amount: string, name: string }[] = parseIngredients(checkedMeal);

      return (
        <div className='information_block'>
          <h2 className='meal_title'>{checkedMeal.strMeal}</h2>
          <p className='meal_subtitle'>{checkedMeal.strArea} {checkedMeal.strCategory} meal</p>
          {
            checkedMeal.strYoutube != '' ? <a className='meal_yt_link' href={checkedMeal.strYoutube} target='_blank'>Check this meal on YouTube</a> : null
          }
          <p>Ingredients:</p>
          <ul>
            {
              ingredients.map((ing, i) => {
                return( ing.amount > '' && ing.name > '' ? <li key={`ing${i}`}>{ing.name}: {ing.amount}</li> : null )
              })
            }
          </ul>
          <p>{checkedMeal.strInstructions}</p>
        </div>
      )
    }
    else {
      return null;
    }
  }

  const displayButtons = (): JSX.Element => {
    const mealDisplayed: boolean = meal.meals[0].idMeal !== '-1';
    return (
      <div className='buttons_block'>
        { mealDisplayed ? <button onClick={pushData}>Save Meal to My List</button> : null }
        <button onClick={pullData}>Pull Meal</button>
        <button onClick={clearData}>Clear My List</button>
      </div>
    )
  }
 
  return (
    <div>
      <div className='search_parameters_block'>
        <Select defaultValue={{value: '', label: 'ANY CATEGORY'}} className='search_parameter_select' options={categoriesOptions} onChange={(event) => setSelectedCategory(event ? event.value : '')} placeholder='Select Meal Category' />
        <Select defaultValue={{value: '', label: 'ANY AREA'}} className='search_parameter_select' options={areasOptions} onChange={(event) => setSelectedArea(event ? event.value : '')} placeholder='Select Meal Area' />
        <Select defaultValue={{value: '', label: 'ANY MAIN INGREDIENT'}} className='search_parameter_select' options={ingredientsOptions} onChange={(event) => setSelectedIngredient(event ? event.value : '')} placeholder='Select Main Ingredient' />
      </div>
      <div className='main_block'>
        { statusText !== '' ? <p className='status_text'>{statusText}</p> : null }
        { statusText === '' ? displayPulledMeal() : null }
      </div>
      <div>
        { displayButtons() }
      </div>
    </div>
  )
}