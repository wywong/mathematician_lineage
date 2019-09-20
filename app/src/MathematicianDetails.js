import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchStudents } from './actions/actions';
import * as d3 from 'd3';

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

const NODE_RADIUS = 50;

class MathematicianDetails extends React.Component {
  constructor(props) {
    super(props);
    this.fetchStudents = this.fetchStudents.bind(this);
    this.draw = this.draw.bind(this);
    this.drawNode = this.drawNode.bind(this);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mathId !== this.props.mathId) {
      this.draw();
    }
  }

  draw() {
    if (this.props.mathId !== null) {
      let graphElem = document.getElementById('graph');
      let width = graphElem.offsetWidth;
      let height = graphElem.offsetHeight;
      let svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      this.drawNode(svg, width / 2, 1.5 * NODE_RADIUS, this.props.fullName);
    }
  }

  drawNode(svg, cx, cy, nodeLabel) {
    svg
      .append('circle')
      .style('stroke', 'gray')
      .style('fill', 'white')
      .attr('r', NODE_RADIUS)
      .attr('cx', cx)
      .attr('cy', cy);
    svg
      .append('text')
      .style('stroke', 'green')
      .style('stroke-width', '1px')
      .style('text-anchor', 'middle')
      .attr('x', cx)
      .attr('y', cy)
      .text(nodeLabel);
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
      <div id='graph'></div>
    </div>
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(MathematicianDetails);
