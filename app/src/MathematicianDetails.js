import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchStudents, DATA_STATE } from './actions/actions';
import { deburr } from 'lodash';
import * as d3 from 'd3';
import { Button } from '@material-ui/core';


const mapToStateProps = function(state) {
  return {
    rootMathematician: state.rootMathematician,
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
      mathematician: this.props.rootMathematician,
      tipData: null,
    };
    this.fetchStudents = this.fetchStudents.bind(this);
    this.draw = this.draw.bind(this);
    this.drawTree = this.drawTree.bind(this);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    let studentsUpdated = prevProps.studentsState !== this.props.studentsState &&
      this.props.studentsState === DATA_STATE.SUCCESS;

    if (prevProps.rootMathematician !== this.props.rootMathematician || studentsUpdated) {
      this.setState({
        mathematician: this.props.rootMathematician,
        tipData: null,
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

      this.drawTree(width, height, root.descendants(), root.links());
    }
  }

  drawTree(width, height, node_data, links) {
      d3.select('svg g.links')
        .selectAll('line.link')
        .data(links)
        .enter()
        .append('line')
        .style('stroke', 'black')
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

    let nodes = d3.select('svg g.nodes')
      .selectAll('circle.node')
      .data(node_data)
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

  static toInitials(text) {
    return deburr(text)
      .replace(/\(\w+\)/g, '')
      .split(/\s+/)
      .map((word) => word[0])
      .join('');
  }

  static tipPosToPos(tipData, hasImage) {

    let ydelta = 4 * NODE_RADIUS
    let top = tipData.y + ydelta;
    let yshift = (hasImage ? 300 : 0) + ydelta;
    if (top > tipData.height - yshift) {
      top = tipData.height - yshift;
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

  get wikiUrl() {
    return this.state.mathematician.wiki_url;
  }

  get imageUrl() {
    return this.state.mathematician.image_url;
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
               style={MathematicianDetails.tipPosToPos(this.state.tipData, this.imageUrl)}>
            <p>
              { this.state.tipData.name }
            </p>
            {this.wikiUrl ?
                <a href={this.wikiUrl} target="_blank" rel="noopener noreferrer">Wikipedia</a> : null}
            {this.imageUrl ?  <img src={this.imageUrl} alt={this.fullName}/> : null}
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
