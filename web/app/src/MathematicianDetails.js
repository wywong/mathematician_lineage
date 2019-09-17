import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const axios = require('axios');

const mapToStateProps = function(state) {
  return {
    mathId: state.mathId,
    fullName: state.fullName
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

class MathematicianDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mathematician: {}
    };
  }

  get mathId() {
    return this.props.mathId;
  }

  get fullName() {
    return this.props.fullName;
  }

  /*
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
    if (prevProps.mathId !== this.props.mathId) {
      this.fetchMathematician();
    }
  }
  */


  render() {
    return <div className="mathematician-details">
      <p>ID: {this.mathId}</p>
      <p>NAME: {this.fullName}</p>
    </div>
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(MathematicianDetails);
