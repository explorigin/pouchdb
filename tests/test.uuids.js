/*globals $, utils: true, eliminateDuplicates */

"use strict";

var qunit = module;

if (typeof module !== undefined && module.exports) {
  Pouch = require('../src/pouch.js');
  utils = require('./test.utils.js');

  for (var k in utils) {
    global[k] = global[k] || utils[k];
  }
  qunit = QUnit.module;
}

var rfcRegexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

test('UUID generation count', 1, function() {
  var count = 10;

  equal(Pouch.uuids(count).length, count, "Correct number of uuids generated.");
});

test('UUID RFC4122 test', 1, function() {
  var uuid = Pouch.uuids(1)[0];
  equal(rfcRegexp.test(uuid), true, "UUID complies with RFC4122.");
});

test('UUID generation uniqueness', 1, function() {
  var count = 1000;
  var uuids = Pouch.uuids(count);

  equal(eliminateDuplicates(uuids).length, count,
        "Generated UUIDS are unique.");
});

test('Test small uuid uniqness', 1, function() {
  var length = 4;
  var count = 1000;

  var uuids = Pouch.uuids(count, {length: length});
  equal(eliminateDuplicates(uuids).length, count,
        "Generated small UUIDS are unique.");
});

test('Test custom length', 10, function() {
  var length = 32;
  var count = 10;

  var uuids = Pouch.uuids(count, {length: length});

  uuids.map(function (uuid) {
    equal(uuid.length, length, "UUID length is correct.");
  });
});

test('Test custom length, redix', 20, function() {
  var length = 32;
  var count = 10;
  var radix = 5;

  var uuids = Pouch.uuids(count, {length: length, radix: radix});

  uuids.map(function (uuid) {
    var nums = uuid.split('').map(function(character) {
      return parseInt(character, radix);
    });

    var max = Math.max.apply(Math, nums);
    var min = Math.min.apply(Math, nums);

    equal(max < radix, true, "Maximum character is less than radix");
    equal(min >= 0, true, "Min character is greater than or equal to 0");
  });
});