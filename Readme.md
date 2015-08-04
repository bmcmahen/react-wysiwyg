# React-Wysiwyg

![react-wysiwyg image](demo.gif)

This component allows you to have input field like behaviour while using contenteditable. This is especially useful if you want to perform in-place, wysiwyg editing, or to implement something like Twitter's tweet-box, as seen in the above example.

This module works well in the latest version of Chrome, Safari, Firefox, and iOS Safari. It mostly works in IE, thanks to a series of unfortunate hacks. Further testing for accessibility and browser support is required.

It's worth looking at the supplied example to get a sense of how to use this module.

## Install

```
$ npm install react-wysiwyg
```

## Run the example

```
$ git clone https://github.com/bmcmahen/react-wysiwyg.git && cd react-wysiwyg
$ npm install
$ make build
$ make example
```

## Usage

```javascript
var ContentEditable = require('react-wysiwyg');

var Example = React.createClass({

  getInitialState: function(){
    return {
      html: 'default text',
      placeholder: false,
      editing: false
    }
  },

  render: function(){
    return (
      <div>
        <ContentEditable
          tagName='div'
          onChange={this.onChange}
          html={this.state.html}
          preventStyling
          noLinebreaks
          placeholder={this.state.placeholder}
          placeholderText='Your Name'
          editing={this.state.editing}
        />
        <button onClick={this.enableEditing}>
          Enable Editing
        </button>
      </div>
    );
  },

  onChange: function(textContent, setPlaceholder) {
    if (setPlaceholder) {
      this.setState({
        placeholder: true,
        html: ''
      })
    } else {
      this.setState({
        placeholder: false,
        html: textContent
      })
    }
  },

  enableEditing: function(){
    // set your contenteditable field into editing mode.
    this.setState({ editing: true });
  }

});
```

## Tests

```
make test
```
