/**
 * Module dependencies
 */

var React = require('react');
var classNames = require('classnames');
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
    onEscapeKey: React.PropTypes.func,
    saveOnEnterKey: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      text: ''
    };
  },

  getInitialState: function(){
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
      selectionRange(React.findDOMNode(this), this.state.range);
    }
  },

  autofocus: function(){
    React.findDOMNode(this).focus();
    if (!this.props.text.length) {
      this.setCursorToStart();
    }
  },

  render: function() {

    // todo: use destructuring
    var editing = this.props.editing;
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
      className: classNames(classes),
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
      React.findDOMNode(this).textContent = this.props.placeholder;
      this.setCursorToStart();
    }
  },

  unsetPlaceholder: function(){
    React.findDOMNode(this).textContent = '';
  },

  setCursorToStart: function(){
    React.findDOMNode(this).focus();
    if (isNotServer) {
      var sel = window.getSelection();
      var range = document.createRange();
      range.setStart(React.findDOMNode(this), 0);
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

      var keyCode = e.keyCode;

      var saveOnEnterKey = this.props.saveOnEnterKey || false;

      if(saveOnEnterKey && keyCode === 13){
        var text = e.target.textContent;
        this.props.onEnterKey(text);
        return;
      }


    // 'Bold' and 'Italic' text using keyboard
      if (e.metaKey) {
          // ⌘ 'b' or ⌘'i' in Mac for bold/italic
          if (keyCode === 66 || keyCode === 73) {
              return prev();
          }
      }

      if (!this.props.text.trim().length) { // If no text
          switch (keyCode) {
              case 46:     // 'Delete' key
              case 8:      // 'Backspace' key
              case 9:      // 'Tab' key
              case 39:     // 'Arrow right' key
              case 37:     // 'Arrow left' key
              case 40:     // 'Arrow left' key
              case 38:     // 'Arrow left' key
                  prev();
                  break;

              case 13:
                  // 'Enter' key
                  prev();
                  if (this.props.onEnterKey) {
                      this.props.onEnterKey();
                  }
                  break;

              case 27:
                  // 'Escape' key
                  prev();
                  if (this.props.onEscapeKey) {
                      this.props.onEscapeKey();
                  }
                  break;

              default:
                  this.unsetPlaceholder();
                  break;
          }
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
    var range = selectionRange(React.findDOMNode(this));
    this.setState({ range : range });
    this.props.onChange(val);
  }

});

module.exports = ContentEditable;
