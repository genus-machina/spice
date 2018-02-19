const lists = require('../../../src/providers/util/lists');
const test = require('ava');

test('Random pulls a random item from a list', (test) => {
  const items = new Array(10000).fill(null).map((value, index) => index + 1);
  const one = lists.random(items);
  const two = lists.random(items);

  test.truthy(one);
  test.truthy(two);
  test.not(one, two);
});
