const ninjaQuery = require('..');

ninjaQuery([
  ninjaQuery.extend('password', {
    name: 'hidden:pw',
    message: 'Enter a hidden password',
    mask: null,
  }),
  ninjaQuery.extend('password', {
    name: 'masked:pw',
    message: 'Enter a masked password',
    mask: '*',
  }),
]).then(console.log);
