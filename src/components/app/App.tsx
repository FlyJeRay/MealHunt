import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { RandomMealTest } from '../testing/RandomMealTest/RandomMealTest';
import { ContextDisplayTest } from '../testing/ContextDisplayTest/ContextDisplayTest';
import { RandomMealPage } from '../RandomMealPage/RandomMealPage';
import { PageHeader } from '../Header/PageHeader';
import { DisplayPage } from './DisplayPage/DisplayPage';

function App() {
  return (
    <Router>
      <div className="App">
        <PageHeader/>
        <Routes>
            <Route path='/' element={<RandomMealPage/>} />
            <Route path='/mylist' element={<DisplayPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
