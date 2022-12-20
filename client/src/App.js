import { useState } from 'react';
import './App.css';
import Game from './components/Game';
import RecordHolders from './components/RecordHolders';

function App() {
 const [state, setState] = useState(false)

  return (
    <div className="App">
      <Game setState = {setState} />
      <RecordHolders state={state} />      
    </div>
  );
}

export default App;
