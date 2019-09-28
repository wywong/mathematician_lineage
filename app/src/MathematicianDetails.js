import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchStudents, DATA_STATE } from './actions/actions';
import { deburr } from 'lodash';
import * as d3 from 'd3';
import { Button } from '@material-ui/core';


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
        fullName: this.props.fullName,
        tipData: null
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

      if (!this.state.tipData) {
        this.setState({
          tipData: {
            x: root.x,
            y: root.y,
            width: width,
            height: height,
            name: root.data.fullName
          }
        });
      }


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
      .append('g')
      .attr('class', 'node');

      nodes
        .append('circle')
        .style('stroke', 'black')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', NODE_RADIUS);
      nodes
        .append('text')
        .style('stroke', '#FAFAFA')
        .style('stroke-width', '2px')
        .style('text-anchor', 'middle')
        .attr('x', (node) => node.x)
        .attr('y', (node) => node.y)
        .text((node) => {
          return MathematicianDetails.toInitials(node.data.fullName);
        });

      nodes.on('click', (node) => {
        this.setState({
          mathematician: node.data,
          tipData: {
            x: node.x,
            y: node.y,
            width: width,
            height: height,
            name: node.data.fullName
          }
        });
      });
    }
  }

  static toInitials(text) {
    return deburr(text).split(/\s+/)
      .map((word) => word[0])
      .join('');
  }

  static tipPosToPos(tipData) {

    let top = tipData.y + 4 * NODE_RADIUS;
    if (top > tipData.height - 4 * NODE_RADIUS) {
      top = tipData.height - 4 * NODE_RADIUS;
    }
    let left = tipData.x + 2 * NODE_RADIUS;
    return {
      top: top,
      left: left,
    }
  }

  get mathId() {
    return this.state.mathematician.id;
  }

  get fullName() {
    return this.state.mathematician.fullName;
  }

  fetchStudents() {
    this.setState({
      tipData: null
    });
    this.props.fetchStudents(this.mathId);
  }

  render() {
    return <div className="mathematician-details">
      {this.state.tipData ?
          <div className="details"
               style={MathematicianDetails.tipPosToPos(this.state.tipData)}>
            <p>
              { this.state.tipData.name }
            </p>
            <Button variant='outlined'
                    onClick={() => this.fetchStudents()}>
              get students
            </Button>
          </div> : null}
      <div id='graph'></div>
    </div>
  }
}

export default connect(mapToStateProps, mapDispatchToProps)(MathematicianDetails);
