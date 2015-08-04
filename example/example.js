var React = require('react');
var ContentEditable = require('../index');

var Example = React.createClass({

  getInitialState: function(){
    var editing = false

    return {
      html: 'default value',
      editing: false,
      placeholder: false
    }

  },

  render: function(){
    return (
      <div>
        <div aria-live='polite'>{this.state.error}</div>
        <ContentEditable
          ref='editable'
          tagName='div'
          html={this.state.html}
          placeholder={this.state.placeholder}
          placeholderText='Your Name'
          onKeyPress={this.onKeyPress}
          preventStyling
          noLinebreaks
          onChange={this.onChange}
          editing={this.state.editing}
        />
        <button onClick={this.enableEditing}>
          {!this.state.editing ? 'Enable Editing' : 'Finish Editing'}
        </button>
        <button onClick={this.autofocus}>
          autofocus if editing
        </button>
      </div>
    );
  },

  autofocus: function () {
    if (this.state.editing) {
      this.refs.editable.autofocus()
    }
  },

  onKeyPress: function (e) {
    var val = e.target.textContent;

    // max-length validation on the fly
    if (val.length > 30) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ error: 'Max length is 30 characters'})
    } else {
      this.setState({ error: null })
    }

  },

  onChange: function(html, setPlaceholder) {
    // in order to render the updated html,
    // you need to pass it as a prop to contentEditable.
    // This gives you increased flexibility.
    if (setPlaceholder) {
      this.setState({
        placeholder: true,
        html: ''
      })
    } else {


      var regex = /(^|[^@\w])@(\w{1,15})\b/g
      var replace = '$1<a href="http://twitter.com/$2">@$2</a>'
      var output = html.replace(regex, replace)


      this.setState({
        placeholder: false,
        html: output
      })
    }

  },

  enableEditing: function(){
    var editing = !this.state.editing
    // set your contenteditable field into editing mode.
    this.setState({ editing: editing });
    if (editing) {
      this.refs.editable.autofocus()
      this.refs.editable.setCursorToEnd()
    }
  }

});

module.exports = Example;
