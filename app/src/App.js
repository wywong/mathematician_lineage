import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import MathematicianDetails from './MathematicianDetails';
import MathematicianSearch from './MathematicianSearch';

class App extends React.Component {

  render() {
    return <div className="container">
      <AppBar position="static">
        <Toolbar>
          <MathematicianSearch/>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <MathematicianDetails />
      </Container>
    </div>
  }

}

export default App;
