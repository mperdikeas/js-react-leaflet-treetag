const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

// REDUX
import { connect }          from 'react-redux';


const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
    , treeActions: (state.treeInfo.current===null)?null:state.treeInfo.current.treeActions
  };
};


class TargetMetadataPane extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    
  componentDidUpdate(prevProps, prevState) {
  }


  render() {
    if (this.props.userIsLoggingIn)
      return <div>user is logging in &hellip;</div>;
    else if (this.props.loadingTreeData)
      return <div>querying for history of tree {this.props.targetId} &hellip;</div>;
    else {
      const stuff = (Array.from(Array(50).keys())).map( (x, idx)=>{
        return (
          <div key={idx}>
            {JSON.stringify(this.props.treeActions)}
          </div>
        );
      });
      return (
        <div style={{'overflow':'scroll'}}>
          <div>
            Metadata for tree {this.props.targetId} follow
          </div>
          {stuff}
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(TargetMetadataPane);
