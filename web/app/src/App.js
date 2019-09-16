import React from 'react';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import MathematicianSearch from './MathematicianSearch';

const axios = require('axios');

class MathematicianDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mathematician: {}
    };
  }

  get mathId() {
    return this.props.params.id;
  }

  get fullName() {
    return this.state.mathematician.full_name;
  }

  fetchMathematician() {
    if (/^\d+$/.test(this.mathId)) {
      axios.get(`/api/mathematician/${this.mathId}/`)
        .then(res => {
          let mathematician = res.data;
          this.setState({
            mathematician: mathematician
          });
        });
    }
  }

  componentDidMount() {
      this.fetchMathematician();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      this.fetchMathematician();
    }
  }


  render() {
    return <div className="mathematician-details">
      <p>ID: {this.mathId}</p>
      <p>NAME: {this.fullName}</p>
    </div>
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      selectedOption: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    console.log(event)
  }

  render() {
    return <div className="container">
      <AppBar position="static">
        <Toolbar>
          <MathematicianSearch/>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <MathematicianDetails params={this.state.params}/>
      </Container>
    </div>
  }

}

export default App;
