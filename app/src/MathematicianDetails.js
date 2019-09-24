import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchStudents } from './actions/actions';
import { deburr } from 'lodash';
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

const NODE_RADIUS = 30;

class MathematicianDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mathematician: {
        id: this.props.mathId,
        fullName: this.props.fullName
      }
    };
    this.fetchStudents = this.fetchStudents.bind(this);
    this.draw = this.draw.bind(this);
    this.drawNode = this.drawNode.bind(this);
    this.drawLine = this.drawLine.bind(this);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mathId !== this.props.mathId ||
        prevProps.students !== this.props.students) {
      this.setState({
        mathematician: {
          id: this.props.mathId,
          fullName: this.props.fullName
        }
      });
      this.draw();
    }
  }

  draw() {
    if (this.props.mathId !== null) {
      let graphElem = document.getElementById('graph');
      graphElem.innerHTML = "";
      let width = graphElem.offsetWidth;
      let height = graphElem.offsetHeight;
      let svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      let rx = width / 2;
      let ry = 1.5 * NODE_RADIUS;
      if (this.props.students.length > 0) {
        let widthIncrement = 3 * NODE_RADIUS
        let cx = (width - widthIncrement * this.props.students.length) / 2 - 1.5 * NODE_RADIUS;
        let studentsCy = 6 * NODE_RADIUS;
        this.props.students.forEach((student) => {
          cx += widthIncrement;
          this.drawLine(svg, rx, ry, cx, studentsCy);
          this.drawNode(svg, cx, studentsCy, student.id, student.fullName);
        });
      }
      this.drawNode(svg, rx, ry, this.props.mathId, this.props.fullName);
    }
  }

  drawLine(svg, x1, y1, x2, y2) {
    svg
      .append('line')
      .style('stroke', 'black')
      .attr('x1', x1)
      .attr('x2', x2)
      .attr('y1', y1)
      .attr('y2', y2);
  }

  drawNode(svg, cx, cy, id, nodeLabel) {
    let circle = svg
      .append('circle');
    circle
      .datum({
        id: id,
        fullName: nodeLabel,
        cx: cx,
        cy: cy
      })
      .style('stroke', 'gray')
      .style('fill', 'white')
      .attr('r', NODE_RADIUS)
      .attr('cx', (d) => d.cx)
      .attr('cy', (d) => d.cy);
    circle
      .on('click', ((d, i) => {
        this.setState({
          mathematician: d
        });
      }).bind(this));
    svg
      .append('text')
      .style('stroke', 'green')
      .style('stroke-width', '1px')
      .style('text-anchor', 'middle')
      .attr('x', cx)
      .attr('y', cy)
      .text(MathematicianDetails.toInitials(nodeLabel));
  }

  static toInitials(text) {
    return deburr(text).split(/\s+/)
      .map((word) => word[0])
      .join('');
  }

  get mathId() {
    return this.state.mathematician.id;
  }

  get fullName() {
    return this.state.mathematician.fullName;
  }

  fetchStudents() {
    this.props.fetchStudents(this.mathId);
  }

  render() {
    return <div className="mathematician-details">
      <div className="details">
        <p>
          { this.fullName }
        </p>
        <button onClick={() => this.fetchStudents()}>
          get students
        </button>
      </div>
      <div id='graph'></div>
    </div>
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(MathematicianDetails);
