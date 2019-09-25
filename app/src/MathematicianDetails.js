import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchStudents, DATA_STATE } from './actions/actions';
import { deburr } from 'lodash';
import * as d3 from 'd3';

const mapToStateProps = function(state) {
  return {
    mathId: state.mathId,
    fullName: state.fullName,
    tree: state.tree,
    studentsState: state.studentsState
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({
    fetchStudents: fetchStudents
  }, dispatch);
}

const NODE_RADIUS = 30;
const NODE_LEVEL_ROOT = 1.5 * NODE_RADIUS;
const NODE_LEVEL_DELTA = 4.5 * NODE_RADIUS;

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
    this.drawStudentNodes = this.drawStudentNodes.bind(this);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    let studentsUpdated = prevProps.studentsState !== this.props.studentsState &&
      this.props.studentsState === DATA_STATE.SUCCESS;

    if (prevProps.mathId !== this.props.mathId || studentsUpdated) {
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
    if (this.props.tree !== null) {
      let graphElem = document.getElementById('graph');
      graphElem.innerHTML = "";
      let width = graphElem.offsetWidth;
      let height = graphElem.offsetHeight;
      let svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      let rx = width / 2;
      let ry = NODE_LEVEL_ROOT;
      if (this.props.tree.root.students.length > 0) {
        this.drawStudentNodes(svg, width, rx, ry, this.props.tree.root);
      }
      this.drawNode(svg, rx, ry, this.props.mathId, this.props.fullName);
    }
  }

  drawStudentNodes(svg, width, p_cx, p_cy, p_node) {
    let widthIncrement = 3 * NODE_RADIUS
    let cx = (width - widthIncrement * p_node.students.length) / 2 - 1.5 * NODE_RADIUS;
    let cy = p_cy + NODE_LEVEL_DELTA;
    p_node.students.forEach((student) => {
      cx += widthIncrement;
      this.drawLine(svg, p_cx, p_cy, cx, cy);
      this.drawStudentNodes(svg, width, cx, cy, student);
      this.drawNode(svg, cx, cy, student.id, student.fullName);
    });
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
      .on('click', (d, i) => {
        this.setState({
          mathematician: d
        });
      });
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
