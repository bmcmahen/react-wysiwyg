var assert = require('assert')
var React = require('react/addons')
var Test = React.addons.TestUtils
var expect = require('expect')
var Factory = require('./factories');

describe('Editable', () => {

  function getEl(component) {
    return React.findDOMNode(component)
  }

  it('should set a default value', function(){
    let c = Factory.editor()
    expect(getEl(c).textContent).toEqual('hi')
    expect(getEl(c).className).toEqual('ContentEditable')
    expect(getEl(c).tagName).toEqual('DIV')
  })

  it('should implement a placeholder', () => {
    let c = Factory.editor({
      editing: true,
      html: '',
      placeholder: true
    })
    expect(getEl(c).textContent).toEqual('placeholder')
  })

  it('should remove the placeholder with certain keys', (next) => {
    let c = Factory.editor({
      editing: true,
      html: '',
      placeholder: true,
      onChange: function(v, setPlaceholder) {
        try {
          expect(setPlaceholder).toEqual(false)
          next()
        } catch(err) {
          next(err)
        }

      }
    })

    let el = getEl(c)
    Test.Simulate.keyDown(el, { key: 'b' })

  })

  it('should not remove the placeholder when pressing certain keys', () => {
    let c = Factory.editor({
      editing: true,
      html: '',
      placeholder: true
    })
    let el = getEl(c)
    Test.Simulate.keyDown(el, { key : 'Enter'})
    expect(el.textContent).toEqual('placeholder')
    Test.Simulate.keyDown(el, { key : 'Delete' })
    expect(el.textContent).toEqual('placeholder')
    Test.Simulate.keyDown(el, { key : 'Space' })
    expect(el.textContent).toEqual('placeholder')
  })

  it('should set innerHTML', () => {
    let c = Factory.editor({
      editing: true,
      html: '<b>hi</b>',
      placeholder: false
    })
    let el = getEl(c)
    expect(el.textContent).toEqual('hi')
    expect(el.innerHTML).toEqual('<b>hi</b>')
  })

  it('should disable editing', () => {
    let c = Factory.editor({
      editing: false,
      html: 'hello',
      placeholder: false
    })
    let el = getEl(c)
    expect(el.getAttribute('contenteditable')).toEqual("false")
    expect(el.textContent).toEqual('hello')
  })

  it('should enable editing', () => {
    let c = Factory.editor()
    expect(getEl(c).getAttribute('contenteditable')).toEqual("true")
  })

  it('should override placeholder styles', () => {
    let c = Factory.editor({
      editing: false,
      html: '',
      placeholder: true,
      placeholderStyle: {
        color: 'blue'
      }
    })
    let el = getEl(c)
    expect(el.style.color).toEqual('blue')
  })

  it('should emit a change event when content has changed', (next) => {
    let total = 0
    let c = Factory.editor({
      editing: true,
      html: 'hi',
      placeholder: false,
      onChange: function(v, setplaceholder, html) {
        if (total === 3) {
          next()
        }
      }
    })

    let el = getEl(c)
    total++
    Test.Simulate.input(el, { key: 'b' })
    total++
    Test.Simulate.input(el, { key: 'Delete' })
    total++
    Test.Simulate.input(el, { key: 'Enter' })
  })

  it('should disable bold and italics', () => {

    let c = Factory.editor({
      preventStyling: true,
      editing: true,
      html: 'hi',
      placeholder: false
    })

    let el = getEl(c)
    Test.Simulate.keyDown(el, { metaKey: true, keyCode: 66 })
    expect(el.innerHTML.indexOf('<b>')).toEqual(-1)
    Test.Simulate.keyDown(el, { metaKey: true, keyCode: 73 })
    expect(el.innerHTML.indexOf('<i>')).toEqual(-1)
  })

  it('should emit events for bold', (next) => {
    let c = Factory.editor({
      preventStyling: true,
      editing: true,
      html: 'hi',
      onBold: function(){
        next()
      },
      placeholder: false
    })

    let el = getEl(c)
    Test.Simulate.keyDown(el, { metaKey: true, keyCode: 66 })
  })

  it('should emit events for italic', (next) => {
    let c = Factory.editor({
      preventStyling: true,
      editing: true,
      html: 'hi',
      onItalic: function(){
        next()
      },
      placeholder: false
    })

    let el = getEl(c)
    Test.Simulate.keyDown(el, { metaKey: true, keyCode: 73 })
  })

  it('should work using keyUp as well, as a fallback', (next) => {
    let total = 0
    let c = Factory.editor({
      editing: true,
      html: 'hi',
      placeholder: false,
      onChange: function(v, setplaceholder, html) {
        if (total === 3) {
          next()
        }
      }
    })

    let el = getEl(c)
    total++
    Test.Simulate.keyUp(el, { key: 'b' })
    total++
    Test.Simulate.keyUp(el, { key: 'Delete' })
    total++
    Test.Simulate.keyUp(el, { key: 'Enter' })
  })

  it('should prevent linebreaks', (next) => {
    let total = 0
    let c = Factory.editor({
      editing: true,
      html: 'hi',
      preventLinebreaks: true,
      placeholder: false,
      onChange: function(v, setplaceholder, html) {
        next(new Error('i wrongly emitted a change event'))
      }
    })

    let el = getEl(c)
    Test.Simulate.keyDown(el, { key: 'Enter' })
    expect(el.innerHTML).toEqual('hi')
    setTimeout(() => {
      next()
    }, 10)
  })

})
