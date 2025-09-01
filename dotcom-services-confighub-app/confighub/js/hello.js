// test file
var assert = require('assert');
var fs = require('fs');
eval.apply(this, [fs.readFileSync('./hello.js').toString()]);

describe('hello function', function() {
  it('test output', function () {
    assert.equal('hello world', hello('world'));
  });
});

