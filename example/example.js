var React = require('react');
var ContentEditable = require('../index');

var Example = React.createClass({
  
  getInitialState: function(){
    return {
      text: 'default text',
      editing: false
    };
  },

  render: function(){
    return (
      <div>
        <ContentEditable
          tagName='div'
          className='name-field'
          onChange={this.onChange}
          text={this.state.text}
          placeholder='Placeholder Text'
          autofocus={true}
          maxLength={200}
          onChange={this.onChange}
          editing={this.state.editing}
        />
        <button onClick={this.enableEditing}>
          {!this.state.editing ? 'Enable Editing' : 'Finish Editing'}
        </button>
      </div>
    );
  },

  onChange: function(text) {
    // in order to render the updated text,
    // you need to pass it as a prop to contentEditable.
    // This gives you increased flexibility.
    this.setState({ text: text });
  },

  enableEditing: function(){
    // set your contenteditable field into editing mode.
    this.setState({ editing: !this.state.editing });
  }

});

module.exports = Example;
