import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MathematicianDetails from './MathematicianDetails';
import MathematicianSearch from './MathematicianSearch';

class App extends React.Component {

  render() {
    return <div className="container">
      <AppBar position="absolute">
        <Toolbar>
          <MathematicianSearch/>
        </Toolbar>
      </AppBar>
      <MathematicianDetails />
    </div>
  }

}

export default App;
