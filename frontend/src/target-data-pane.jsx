const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;


// REDUX
import { connect }          from 'react-redux';

const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
  };
};


class TargetDataPane extends React.Component {

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
      return <div>querying the server for tree {this.props.targetId} &hellip;</div>;
    else
      return (
        <>
        <div>
          Data for tree {this.props.targetId} follow
        </div>
        <div>
        {JSON.stringify(this.props.treeData)}
      </div>
      </>
        );
    }
}


export default connect(mapStateToProps)(TargetDataPane);


