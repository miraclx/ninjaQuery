// eslint-disable-next-line import/no-extraneous-dependencies
const chalk = require('chalk');
const ninjaQuery = require('../dist');

ninjaQuery([
  ninjaQuery.extend('name', {
    name: 'firstname',
    message: 'First Name  ',
    suffix: `[${chalk.bold('F')}mln]:`,
  }),
  ninjaQuery.extend('name', {
    name: 'middlename',
    message: 'Middle Name ',
    suffix: `[f${chalk.bold('M')}ln]:`,
  }),
  ninjaQuery.extend('name', {
    name: 'lastname',
    message: 'Last Name   ',
    suffix: `[fm${chalk.bold('L')}n]:`,
  }),
  ninjaQuery.extend('username', {
    name: 'username',
    message: 'Nick Name   ',
    suffix: `[fml${chalk.bold('N')}]:`,
  }),
  ninjaQuery.extend('dateofbirth'),
  ninjaQuery.extend('email', {
    name: 'email',
    type: 'input',
    message: 'Enter your email :',
  }),
])
  .then(console.log)
  .catch(console.error);
