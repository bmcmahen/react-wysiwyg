var _ = require('lodash')
var React = require('react/addons')
var Test = React.addons.TestUtils
var Edit = require('../')

module.exports = {
  editorElement(args) {
    let props = _.assign({
      editing: true,
      html: 'hi',
      placeholder: false,
      onChange: _.noop,
      placeholderText: 'placeholder'
    }, args)

    return <Edit {...props} />
  },

  editor(args = {}) {
    return Test.renderIntoDocument(this.editorElement(args))
  }
};
