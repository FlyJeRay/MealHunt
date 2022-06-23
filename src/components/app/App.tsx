import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { RandomMealTest } from '../testing/RandomMealTest/RandomMealTest';
import { ContextDisplayTest } from '../testing/ContextDisplayTest/ContextDisplayTest';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            <Route path='/' element={<RandomMealTest/>} />
            <Route path='/display' element={<ContextDisplayTest/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
