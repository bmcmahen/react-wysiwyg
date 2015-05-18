var expect = require('expect.js');
var ContentEditable = require('./index');
var React = require('react/addons');
var T = React.addons.TestUtils;

var Container = React.createClass({

  getInitialState: function() {
    return {
      text: '',
      editing: false 
    };
  },

  render: function(){
    var ce = ContentEditable({
      editing: this.props.editing || this.state.editing,
      placeholder: 'placeholder',
      className: 'custom',
      text: this.props.text || '',
      onChange: this.onChange,
      autoFocus: true
    });

    return React.createElement('div', null, ce);
  },

  onChange: function(t) {
    this.setState({ text: t });
  },

  enableEditing: function(){
    this.setState({ editing: true });
  }
});


var ContainerFactory = React.createFactory(Container);

describe('ContentEditable', function(){

  function create(obj){
    obj = obj || {};
    var component = ContainerFactory(obj);
    var rendered = T.renderIntoDocument(component);
    var el = React.findDOMNode(rendered);
    return {
      el : el.children[0],
      component: component
    };
  }

  it('should be a div by default', function(){
    expect(create().el.tagName).to.be('DIV');
  });

  it('should render the empty text when not editing', function(){
    expect(create().el.textContent).to.be.empty();
  });

  it('should add a classname', function(){
    expect(create().el.classList.contains('custom')).to.be.ok();
  });

  it('should have an is-empty classname', function(){
    expect(create().el.classList.contains('is-empty')).to.be.ok();
  })

  it('should add a placeholder in editing mode', function(){
    expect(create({ editing: true }).el.textContent).to.be('placeholder');
  });

  it('should update the text content and remove the placeholder if text is added', function(){
    expect(create({ editing: true, text: 'hi' }).el.textContent).to.be('hi');
  });

  it('should unset placeholder on text input', function(){
    var c = create({ editing: true });
    T.Simulate.keyDown(c.el, { keyCode: 48 });
    expect(c.el.classList.contains('is-empty')).to.be(true);
    expect(c.el.textContent).to.be('');
  });

  it('should autofocus', function(){
    var component = ContainerFactory({ editing: true });
    var container = document.createElement('div');
    document.body.appendChild(container);
    var rendered = React.render(component, container);
    var el = React.findDOMNode(rendered).children[0];
    expect(el == document.activeElement).to.be.ok();
  });

});