import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { mealAreas, mealCategories, mealData, mealDefaultData, mealIngredients, shortMealData, singleMealData } from '../../../mealTypes';
import { Link } from 'react-router-dom';
import Select from 'react-select';

type selectOptions = [ { value: string, label: string } ]

function shuffle(arr: singleMealData[]) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

export const RandomMealTest = () => {
  const [meal, setMeal] = useState<mealData>(mealDefaultData);

  const statusTextRef = useRef() as MutableRefObject<HTMLParagraphElement>;

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

    const tempCategories: selectOptions = [ { value: '', label: '' } ];
    tempCategories.pop();
    categoriesJSON.meals.forEach(val => {
      tempCategories.push( { value: val.strCategory, label: val.strCategory.toUpperCase() } );
    });
    setCategoriesOptions(tempCategories);
  }

  const pullAreas = async () => {
    const areasData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const areasJSON: mealAreas = await areasData.json();

    const tempAreas: selectOptions = [ { value: '', label: '' } ];
    tempAreas.pop();
    areasJSON.meals.forEach(val => {
      tempAreas.push( { value: val.strArea, label: val.strArea.toUpperCase() } );
    });
    setAreasOptions(tempAreas);
  }

  const pullMainIngredients = async () => {
    const ingredientsData: Response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const ingredientsJSON: mealIngredients = await ingredientsData.json();

    const tempIngredients: selectOptions = [ { value: '', label: '' } ];
    tempIngredients.pop();
    ingredientsJSON.meals.forEach(val => {
      tempIngredients.push( { value: val.strIngredient, label: val.strIngredient.toUpperCase() } );
    });
    setIngredientsOptions(tempIngredients);
  }

  const pullData = async () => {
    // resultJSON is the final output value
    let resultJSON: mealData = {} as mealData;
    statusTextRef.current.innerHTML = 'Loading..';

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
        statusTextRef.current.innerHTML = "Sorry, but we couldn't find such meal in our database. We'll show you a random meal instead."
      }
      // If everything works fine, clearing status paragraph.
      else {
        statusTextRef.current.innerHTML = '';
      }
    }

    // If there are no searching parameters - just giving the random meal.
    else {
      const data: Response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      resultJSON = await data.json();
      statusTextRef.current.innerHTML = '';
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
 
  return (
    <div>
      <Link to="/display">Display Tab</Link>
      <Select options={categoriesOptions} onChange={(event) => setSelectedCategory(event ? event.value : '')} placeholder='Select Meal Category' />
      <Select options={areasOptions} onChange={(event) => setSelectedArea(event ? event.value : '')} placeholder='Select Meal Area' />
      <Select options={ingredientsOptions} onChange={(event) => setSelectedIngredient(event ? event.value : '')} placeholder='Select Main Ingredient' />
      <p ref={statusTextRef}></p>
      <button onClick={clearData}>Clear Local Storage</button>
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
            <button onClick={pushData}>Push Meal to Local Storage</button>
            <button onClick={pullData}>Pull Meal from Database</button>
          </div> 
          : 
          <button onClick={pullData}>Pull Meal</button>
      }
    </div>
  )
}