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
      let nodePadding = 1.5 * NODE_RADIUS
      let treeGroup = svg
        .append('g')
        .attr('transform', `translate(${nodePadding}, ${nodePadding})`);
      treeGroup
        .append('g')
        .attr('class', 'links');
      treeGroup
        .append('g')
        .attr('class', 'nodes')
      let root = d3.hierarchy(this.props.tree.root);
      let treeLayout = d3.tree();
      let windowBuffer = 4 * NODE_RADIUS;
      treeLayout.size([width - windowBuffer, height - windowBuffer]);
      treeLayout(root);

	  d3.select('svg g.links')
		.selectAll('line.link')
		.data(root.links())
		.enter()
		.append('line')
        .style('stroke', 'black')
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

	  let nodes = d3.select('svg g.nodes')
		.selectAll('circle.node')
		.data(root.descendants())
		.enter()
        .append('g');

      nodes
		.append('circle')
        .style('stroke', 'gray')
        .style('fill', 'white')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
		.attr('r', NODE_RADIUS);
      nodes
        .append('text')
        .style('stroke', 'green')
        .style('stroke-width', '1px')
        .style('text-anchor', 'middle')
        .attr('x', (node) => node.x)
        .attr('y', (node) => node.y)
        .text((node) => {
          return MathematicianDetails.toInitials(node.data.fullName);
        });

      nodes.on('click', (node) => {
        this.setState({
          mathematician: node.data
        });
      });
    }
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
