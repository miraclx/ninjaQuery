// Addon script for Inquirer.js to help in piping situations
// So, we can safely collect passwords and confirmations when piping stdout or stderr
//  | Example
//  |> node index.js > logs
//  |> ? Please enter a password? ********
// Apache-2.0 (c) 2019 Miraculous Owonubi

process.env['FORCE_COLOR'] = '';

const fs = require('fs');
const tty = require('tty');
const inquirer = require('inquirer');

const fds = {
  input: fs.openSync('/dev/tty', 'r'),
  output: fs.openSync('/dev/tty', 'w'),
};

const xSettle = (def, opts) => (Array.isArray(opts) ? opts : [opts]).map(option => ({ ...def, ...option }));

module.exports = opts => {
  const streams = {
    input: new tty.ReadStream(fds.input),
    output: new tty.WriteStream(fds.output),
  };
  return new Promise((res, rej) => {
    inquirer
      .createPromptModule({ ...streams })
      .call(null, xSettle({}, opts))
      .then(pass => (Object.values(streams).forEach(socket => socket.destroy()), res(pass)))
      .catch(rej);
  });
};

let defaults = {
  password: {
    name: 'password',
    type: 'password',
    message: 'Please enter a password ?',
    mask: '*',
    validate: value => /.{4,}/.test(value) || 'Password should contain at least 4 characters',
  },
  confirm: {
    name: 'confirm',
    type: 'confirm',
    message: 'Are you sure?',
  },
};

module.exports.password = (opts, { key = 'password', confirm = false, confirmMessage, unmatchMessage } = {}) =>
  new Promise(async res => {
    let result = await module.exports(xSettle(defaults.password, opts));
    if (confirm) {
      let confirmed = false;
      while (!confirmed) {
        let pass = await module.exports(xSettle(defaults.password, { message: confirmMessage || 'Re enter password ?' }));
        result[key] == pass.password
          ? ((confirmed = true), res(result))
          : console.error(unmatchMessage || '\x1b[33m[!]\x1b[0m Password mismatch');
      }
    } else res(result);
  });

module.exports.confirm = opts => module.exports(xSettle(defaults.confirm, opts));
