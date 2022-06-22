import './App.css';

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { MealsContext } from '../../mealContext';
import { RandomMealTest } from '../testing/RandomMealTest/RandomMealTest';
import { ContextDisplayTest } from '../testing/ContextDisplayTest/ContextDisplayTest';

function App() {
  const [state, stateDispatch] = useState<string[]>([]);

  return (
    <Router>
      <div className="App">
          <MealsContext.Provider value={ { contextData: state, setContextData: stateDispatch } }>
            <Routes>
                <Route path='/' element={<RandomMealTest/>} />
                <Route path='/display' element={<ContextDisplayTest/>} />
            </Routes>
          </MealsContext.Provider>
      </div>
    </Router>
  );
}

export default App;
