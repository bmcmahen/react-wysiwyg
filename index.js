/**
 * Module dependencies
 */

var React = require('react')
var classNames = require('classnames')
var escapeHTML = require('escape-html')
var isServer = typeof window === 'undefined'

if (!isServer) {
  var selectionRange = require('selection-range')
}

var noop = function(){}

/**
 * Make a contenteditable element
 */

var ContentEditable = React.createClass({

  propTypes: {
    editing: React.PropTypes.bool,
    html: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.bool,
    placeholderText: React.PropTypes.string,
    tagName: React.PropTypes.string,
    onEnterKey: React.PropTypes.func,
    onEscapeKey: React.PropTypes.func,
    preventStyling: React.PropTypes.bool,
    noLinebreaks: React.PropTypes.bool,
    onBlur: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onBold: React.PropTypes.func,
    onItalic: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onKeyPress: React.PropTypes.func,
    placeholderStyle: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      html: '',
      placeholder: false,
      placeholderText: '',
      onBold: noop,
      onItalic: noop,
      onKeyDown: noop,
      onKeyPress: noop
    };
  },

  getInitialState: function(){
    return {};
  },

  shouldComponentUpdate: function(nextProps) {
    var el = React.findDOMNode(this)
    if (nextProps.html !== el.innerHTML) {
      if (nextProps.html && document.activeElement === el) {
        this._range = selectionRange(el)
      }
      return true
    }

    if (nextProps.placeholder !== this.props.placeholder) {
      return true
    }

    if (nextProps.editing !== this.props.editing) {
      return true
    }

    return false
  },

  componentWillReceiveProps: function (nextProps) {
    if (!this.props.editing && nextProps.editing) {
      if (this.contentIsEmpty(nextProps.html)) {
        this.props.onChange('', true)
      }
    }
  },

  componentDidUpdate: function() {
    if (!this.props.editing && !this.props.html) {
      this.props.onChange('')
    }

    if (this._range) {
      selectionRange(React.findDOMNode(this), this._range)
      delete this._range
    }
  },

  autofocus: function(){
    React.findDOMNode(this).focus();
  },

  render: function() {

    // todo: use destructuring
    var editing = this.props.editing;
    var className = this.props.className;
    var tagName = this.props.tagName;

    // setup our classes
    var classes = {
      ContentEditable: true
    };

    var placeholderStyle = this.props.placeholderStyle || {
      color: '#bbbbbb'
    }

    if (className) {
      classes[className] = true;
    }

    // set 'div' as our default tagname
    tagName = tagName || 'div';

    var content = this.props.html;

    // return our newly created element
    return React.createElement(tagName, {
      tabIndex: 0,
      className: classNames(classes),
      contentEditable: editing,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onKeyDown: this.onKeyDown,
      onPaste: this.onPaste,
      onMouseDown: this.onMouseDown,
      'aria-label': this.props.placeholderText,
      onTouchStart: this.onMouseDown,
      style: this.props.placeholder ? placeholderStyle : this.props.style || {},
      onKeyPress: this.onKeyPress,
      onInput: this.onInput,
      onKeyUp: this.onKeyUp,
      dangerouslySetInnerHTML: {
        __html : this.props.placeholder ? this.props.placeholderText : content
      }
    });
  },

  unsetPlaceholder: function(){
    this.props.onChange('', false, '')
  },

  setCursorToStart: function(){
    React.findDOMNode(this).focus();
    var sel = window.getSelection();
    var range = document.createRange();
    range.setStart(React.findDOMNode(this), 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  },

  contentIsEmpty: function (content) {

    if (this.state.placeholder) {
      return true
    }

    if (!content) {
      return true
    }

    if (content === '<br />') {
      return true
    }

    if (!content.trim().length) {
      return true
    }

    return false
  },


  onMouseDown: function(e) {
    // prevent cursor placement if placeholder is set
    if (this.contentIsEmpty(this.props.html)) {
      this.setCursorToStart()
      e.preventDefault()
    }
  },

  onKeyDown: function(e) {
    var self = this
    this.props.onKeyDown(e)

    function prev () {
      e.preventDefault();
      e.stopPropagation();
      self.stop = true
    }

    var key = e.keyCode;

    // bold & italic styling
    if (e.metaKey) {

      // bold
      if (key === 66) {
        this.props.onBold(e)
        if (this.props.preventStyling) {
          return prev()
        }

      // italic
      } else if (key === 73) {
        this.props.onItalic(e)
        if (this.props.preventStyling) {
          return prev()
        }
      //paste
      } else if (key === 86) {
        return;
      }
    }

    // prevent linebreaks
    if (this.props.noLinebreaks && (key === 13)) {
      return prev()
    }

    // placeholder behaviour
    if (this.contentIsEmpty(this.props.html)) { // If no text

      if (e.metaKey || (e.shiftKey && (key === 16))) {
        return prev()
      }

      switch (key) {
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

  _replaceCurrentSelection: function(data) {
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    range.deleteContents();
    var fragment = range.createContextualFragment('');
    fragment.textContent = data;
    var replacementEnd = fragment.lastChild;
    range.insertNode(fragment);
    // Set cursor at the end of the replaced content, just like browsers do.
    range.setStartAfter(replacementEnd);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  },

  onPaste: function(e){
    // handle paste manually to ensure we unset our placeholder
    e.preventDefault();
    var data = e.clipboardData.getData('text/plain')
    this._replaceCurrentSelection(data);
    var target = React.findDOMNode(this)
    this.props.onChange(target.textContent, false, target)
  },

  onKeyPress: function(e){
    this.props.onKeyPress(e)
  },

  onKeyUp: function(e) {
    if (this._supportsInput) return
    if (this.stop) {
      this.stop = false
      return
    }

    var target = React.findDOMNode(this)
    var self = this

    if (!target.textContent.trim().length) {
      this.props.onChange('', true, '')
      setTimeout(function(){
        self.setCursorToStart()
      }, 1)
    } else {
      this.props.onChange(target.textContent, false, target)
    }

  },

  onInput: function(e) {
    this._supportsInput = true
    var val = e.target.innerHTML
    var text = e.target.textContent.trim()
    if (!text) {
      this.props.onChange('', true, '')
      return
    }

    this.props.onChange(escapeHTML(e.target.textContent), false, e.target)
  },

  onBlur: function(e) {
      if (this.props.onBlur) {
          this.props.onBlur(e);
      }
  },

  onFocus: function(e) {
      if (this.props.onFocus) {
          this.props.onFocus(e);
      }
  }

});

module.exports = ContentEditable;
