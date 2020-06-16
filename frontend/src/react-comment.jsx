// https://stackoverflow.com/a/41131326/274677
import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

class ReactComment extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    trim: PropTypes.bool
  };

  static defaultProps = {
    trim: true
  };

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    ReactDOM.unmountComponentAtNode(el);
    el.outerHTML = this.createComment();
  }

  createComment() {
    let text = this.props.text;

    if (this.props.trim) {
      text = text.trim();
    }

    return `<!-- ${text} -->`;
  }

  render() {
    return <div />;
  }
}

export default ReactComment;
