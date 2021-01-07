import './App.css';
import Home from './Components/Home'
import { HashRouter as Router, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={ Home } />
      </div>
    </Router>
    
  );
}

export default App;
