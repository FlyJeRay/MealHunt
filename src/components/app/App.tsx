import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { RandomMealPage } from '../RandomMealPage/RandomMealPage';
import { PageHeader } from '../Header/PageHeader';
import { DisplayPage } from '../DisplayPage/DisplayPage';

function App() {
  return (
    <Router>
      <div className="App">
        <PageHeader/>
        <Routes>
            <Route path='/MealHunt/' element={<RandomMealPage/>} />
            <Route path='/MealHunt/mylist' element={<DisplayPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
