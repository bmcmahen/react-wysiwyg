/**
 * Module dependencies
 */

var React = require('react');
var classSet = require('react/lib/cx');


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
    autoFocus: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      text: ''
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    var el = this.getDOMNode();

    if (!nextProps.editing && el) {
      el.textContent = nextProps.text;
      if (!el.textContent.length) el.classList.add('is-empty');
      else el.classList.remove('is-empty');
    }

    if (nextProps.editing != this.props.editing) {
      return true;
    }

    if (el) {
      if (!el.textContent.length) el.classList.add('is-empty');
      else el.classList.remove('is-empty');
      if (el.textContent == nextProps.text) {
        return false;
      }
    }

    return true;
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.props.editing && nextProps.editing) {
      this.setPlaceholder({ editing : true });
      if (this.props.autoFocus) {
        this.autofocus();
      }
    }
  },

  componentDidMount: function(){
    this.setPlaceholder();
    if (this.props.editing && this.props.autoFocus) {
      this.autofocus();
    }
  },

  autofocus: function(){
    var sel = window.getSelection();
    var range = document.createRange();
    range.setStart(this.getDOMNode(), 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    this.getDOMNode().focus();
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
      'is-empty': !this.props.text.length
    };

    if (className) {
      classes[className] = true;
    }

    // set 'div' as our default tagname
    tagName = tagName || 'div';

    // return our newly created element
    return React.createElement(tagName, {
      tabIndex: this.props.autoFocus ? -1 : 0,
      className: classSet(classes),
      contentEditable: editing,
      onKeyDown: this.onKeyDown,
      onPaste: this.onPaste,
      onMouseDown: this.onMouseDown,
      onKeyPress: this.onKeyPress,
      onInput: this.onInput,
      onKeyUp: this.onKeyUp
    }, this.props.text);
  },

  setPlaceholder: function(opts){
    opts = opts || {};
    var editing = opts.editing;
    if (!this.props.text.length && (this.props.editing || editing)) {
      this.getDOMNode().textContent = this.props.placeholder;
    }
  },

  unsetPlaceholder: function(){
    this.getDOMNode().textContent = '';
  },

  onMouseDown: function(e) {
    if (this.props.text.length) return;
    // if we have a placeholder, set the cursor to the start
    var sel = window.getSelection();
    var range = document.createRange();
    range.setStart(this.getDOMNode(), 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    e.preventDefault();
    this.getDOMNode().focus();
  },

  onKeyDown: function(e) {
    function prev () {
      e.preventDefault();
    }

    var key = e.key;

    if (key == 'Delete' && !this.props.text.length) {
      prev();
      e.stopPropagation();
      return;
    }

    // todo: cleanup
    if (key == 'Enter') return prev();

    if (e.metaKey) {
      if (e.keyCode == 66) return prev();
      if (e.keyCode == 73) return prev();
    }

    if (!this.props.text.length) {
      if (key == 'Delete') return prev();
      if (key == 'ArrowRight') return prev();
      if (key == 'ArrowLeft') return prev();
      if (key == 'ArrowDown') return prev();
      this.unsetPlaceholder();
    }
  },

  onPaste: function(e){
    // handle paste manually to ensure we unset our placeholder
    e.preventDefault();

    if (!this.props.text.length) {
      // unset placeholder
      this.getDOMNode().textContent = '';
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
    this.setPlaceholder();
  },

  onInput: function(e) {
    this.setText(e.target.textContent);
  },

  setText: function(val) {
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

});

module.exports = ContentEditable;