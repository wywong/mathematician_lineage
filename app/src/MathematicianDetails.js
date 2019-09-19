import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchStudents } from './actions/actions';

const mapToStateProps = function(state) {
  return {
    mathId: state.mathId,
    fullName: state.fullName,
    students: state.students
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    fetchStudents: fetchStudents
  }, dispatch);
}

class MathematicianDetails extends React.Component {
  constructor(props) {
    super(props);
    this.fetchStudents = this.fetchStudents.bind(this);
  }

  get mathId() {
    return this.props.mathId;
  }

  get fullName() {
    return this.props.fullName;
  }

  fetchStudents() {
    this.props.fetchStudents(this.mathId);
  }

  render() {
    return <div className="mathematician-details">
      <p>ID: {this.mathId}</p>
      <p>NAME: {this.fullName}</p>
      <button onClick={() => this.fetchStudents()}>
        get students
      </button>
      <ul>
        {
          this.props.students.map(student => {
            return <li>{student.fullName}</li>
          })
        }
      </ul>
    </div>
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(MathematicianDetails);
