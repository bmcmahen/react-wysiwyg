/**
 * Module dependencies
 */

var React = require('react');
var classSet = require('react/lib/cx');
var isNotServer = typeof window !== 'undefined';

var selectionRange;

if (isNotServer) {
  selectionRange = require('selection-range');
}


/**
 * Make a contenteditable element
 */

var ContentEditable = React.createClass({

  propTypes: {
    editing: React.PropTypes.bool,
    text: React.PropTypes.string.isRequired,
    maxLength: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    tagName: React.PropTypes.string,
    autoFocus: React.PropTypes.bool,
    onEnterKey: React.PropTypes.func,
    onEscapeKey: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      text: ''
    };
  },

  getInitalState: function(){
    return {};
  },

  componentDidMount: function(){
    if (this.props.editing && this.props.autoFocus) {
      this.autofocus();
    }
  },

  componentDidUpdate: function(prevProps, prevState){
    if (!prevProps.editing && this.props.editing && this.props.autoFocus) {
      this.autofocus();
    }

    if (this.state && this.state.range) {
      selectionRange(this.getDOMNode(), this.state.range);
    }
  },

  autofocus: function(){
    this.getDOMNode().focus();
    if (!this.props.text.length) {
      this.setCursorToStart();
    }
  },

  render: function() {

    // todo: use destructuring
    var editing = this.props.editing;
    var maxLength = this.props.maxLength;
    var className = this.props.className;
    var tagName = this.props.tagName;

    // setup our classes
    var classes = {
      ContentEditable: true,
      'is-empty': !this.props.text.trim().length
    };

    if (className) {
      classes[className] = true;
    }

    // set 'div' as our default tagname
    tagName = tagName || 'div';

    var content;

    if (!this.props.text.trim().length && editing) {
      content = this.props.placeholder;
    } else if (!this.props.text.trim().length) {
      content = React.createElement('br');
    } else {
      content = this.props.text;
    }

    // return our newly created element
    return React.createElement(tagName, {
      tabIndex: this.props.autoFocus ? -1 : 0,
      className: classSet(classes),
      contentEditable: editing,
      onKeyDown: this.onKeyDown,
      onPaste: this.onPaste,
      onMouseDown: this.onMouseDown,
      onTouchStart: this.onMouseDown,
      onKeyPress: this.onKeyPress,
      onInput: this.onInput,
      onKeyUp: this.onKeyUp
    }, content);
  },

  setPlaceholder: function(text){
    if (!text.trim().length && this.props.placeholder) {
      this.getDOMNode().textContent = this.props.placeholder;
      this.setCursorToStart();
    }
  },

  unsetPlaceholder: function(){
    this.getDOMNode().textContent = '';
  },

  setCursorToStart: function(){
    this.getDOMNode().focus();
    if (isNotServer) {
      var sel = window.getSelection();
      var range = document.createRange();
      range.setStart(this.getDOMNode(), 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  },

  onMouseDown: function(e) {
    if (this.props.text.length) return;
    // if we have a placeholder, set the cursor to the start
    this.setCursorToStart();
    e.preventDefault();
  },

  onKeyDown: function(e) {
    var self = this;

    function prev () {
      e.preventDefault();
      e.stopPropagation();
      self._stop = true;
    }

    var key = e.key;

    if (key == 'Delete' && !this.props.text.trim().length) {
      prev();
      return;
    }

    // todo: cleanup
    if (key == 'Enter') {
      prev();

      if (this.props.onEnterKey) {
        this.props.onEnterKey();
      }

      return;
    }

    if (key == 'Escape') {
      prev();

      if (this.props.onEscapeKey) {  
        this.props.onEscapeKey();
      }
      
      return;
    }

    if (e.metaKey) {
      if (e.keyCode == 66) return prev();
      if (e.keyCode == 73) return prev();
    }

    if (!this.props.text.trim().length) {
      if (key == 'Backspace') return prev();
      if (key == 'Delete') return prev();
      if (key == 'ArrowRight') return prev();
      if (key == 'ArrowLeft') return prev();
      if (key == 'ArrowDown') return prev();
      if (key == 'ArrowUp') return prev();
      if (key == 'Tab') return prev();
      this.unsetPlaceholder();
    }
  },

  onPaste: function(e){
    // handle paste manually to ensure we unset our placeholder
    e.preventDefault();

    // unset placeholder
    if (!this.props.text.length) {
      this.unsetPlaceholder();
    }

    var data = e.clipboardData.getData('text/plain');

    // prevent text longer then our max-length from being
    // added
    if (this.props.maxLength) {
      data = data.slice(0, this.props.maxLength);
    }
    this.setText(data);
  },

  onKeyPress: function(e){
    var val = e.target.textContent;

    // max-length validation on the fly
    if (this.props.maxLength && (val.length > this.props.maxLength)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  },

  onKeyUp: function(e) {
    var stop = this._stop;
    this._stop = false;

    // This is a lame hack to support IE, which doesn't
    // support the 'input' event on contenteditable. Definitely
    // not ideal, but it seems to work for now.
    if (!stop && !this._ignoreKeyup) {
      this.setText(e.target.textContent);
    }

    this.setPlaceholder(e.target.textContent);
  },

  onInput: function(e) {
    this._ignoreKeyup = true;
    this.setText(e.target.textContent);
  },

  setText: function(val) {
    var range = selectionRange(this.getDOMNode());
    this.setState({ range : range });
    this.props.onChange(val);
  }

});

module.exports = ContentEditable;