import { useEffect, useState } from 'react';
import { mealAreas, mealCategories, mealData, mealDefaultData, mealIngredients, shortMealData, singleMealData } from '../../mealTypes';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import './RandomMealPage.css'

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
      console.log('newdata:', newdata);
      localStorage.setItem('fjr_mealhunt_mealidlist', newdata);
    }
  }

  const clearData = () => {
    localStorage.setItem('fjr_mealhunt_mealidlist', '');
  }

  const displayPulledMeal = (): JSX.Element | null => {
    if (meal.meals[0].idMeal !== '-1') {
      const checkedMeal: singleMealData = meal.meals[0];

      // I wanted to parse it with a loop, but, sadly, JS doesn't allow to use 
      // checkedMeal[`strMeasure${i}`] and checkedMeal[`strIngredient${i}`]: it is required to have
      // a string that is definetely in the object.

      // And, sadly, ingredients are not an array.

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

      return (
        <div className='information_block'>
          <h2 className='meal_title'>{checkedMeal.strMeal}</h2>
          <p className='meal_subtitle'>{checkedMeal.strArea} {checkedMeal.strCategory} meal</p>
          {
            checkedMeal.strYoutube != '' ? <a href={checkedMeal.strYoutube} target='_blank'>Check this meal on YouTube</a> : null
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
      <Link to="/display">Display Tab</Link>
      <div className='search_parameters_block'>
        <Select className='search_parameter_select' options={categoriesOptions} onChange={(event) => setSelectedCategory(event ? event.value : '')} placeholder='Select Meal Category' />
        <Select className='search_parameter_select' options={areasOptions} onChange={(event) => setSelectedArea(event ? event.value : '')} placeholder='Select Meal Area' />
        <Select className='search_parameter_select' options={ingredientsOptions} onChange={(event) => setSelectedIngredient(event ? event.value : '')} placeholder='Select Main Ingredient' />
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