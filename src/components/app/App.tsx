import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { RandomMealTest } from '../testing/RandomMealTest/RandomMealTest';
import { ContextDisplayTest } from '../testing/ContextDisplayTest/ContextDisplayTest';
import { RandomMealPage } from '../RandomMealPage/RandomMealPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path='/' element={<RandomMealPage/>} />
            <Route path='/display' element={<ContextDisplayTest/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
