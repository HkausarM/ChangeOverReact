import './App.css';
import ClippedDrawer from '../BuyPage';

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <div className='homeLayout'>
          <ClippedDrawer className='sidenav'/>
          </div>
      </header>
    </div>
  );
}

export default App;
