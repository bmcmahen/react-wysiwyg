module.exports = {
  'Test content length': function(browser) {
    browser
      .url('http://localhost:5100')
      .waitForElementVisible('body', 1000)
      .setValue('.ContentEditable', 'this is some text')
      .assert.containsText('#content-length', '126')
      .end()
  }
};
