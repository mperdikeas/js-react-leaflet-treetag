const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

// REDUX
import { connect }          from 'react-redux';


const mapStateToProps = (state) => {
  return {
    regions: state.regions.regions
    , state: state.regions.state
  };
};


class RegionList extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  
  componentDidUpdate(prevProps, prevState) {
  }


  render() {
    switch (this.props.state) {
      case 'fetching':
        return <div>fetching regions &hellip;</div>
      case 'steady':
        return (
          <div>{this.props.regions.length} regions were fetched</div>
        );
      default:
        throw `region-list.jsx :: unrecognized state: [${this.props.state}]`;
    }
  }
}

export default connect(mapStateToProps)(RegionList);
