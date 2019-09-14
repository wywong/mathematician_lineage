import React from 'react';
import './App.css';

const axios = require('axios');

class MathematicianDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: ""
    };
  }

  get mathId() {
    return this.props.params.id;
  }

  get fullName() {
    return this.state.fullName;
  }

  fetchMathematician() {
    if (/^\d+$/.test(this.mathId)) {
      axios.get(`/api/mathematician/${this.mathId}/`)
        .then(res => {
          let mathematician = res.data;
          this.setState({
            fullName: mathematician.full_name
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
      value: ''
    };
    this.findMathematician = this.findMathematician.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  findMathematician(event) {
    this.setState({
      params: {
        id: this.state.value
      }
    });
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return <div className="container">
      <input placeholder="Mathematician Id"
             value={this.state.value}
             onChange={this.handleChange}/>
      <button onClick={this.findMathematician}>Find</button>
      <MathematicianDetails params={this.state.params}/>
    </div>
  }

}

export default App;
