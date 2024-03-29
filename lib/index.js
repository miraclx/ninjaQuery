// Addon script for Inquirer.js to help in piping situations
// So, we can safely collect passwords and confirmations when piping stdout or stderr
//  | Example
//  |> node index.js > logs
//  |> ? Please enter a password? ********
// Apache-2.0 (c) 2019 Miraculous Owonubi

process.env.FORCE_COLOR = '';

const fs = require('fs');
const tty = require('tty');
const inquirer = require('inquirer');

const xSettle = (def, opts) => (Array.isArray(opts) ? opts : [opts]).map(option => ({...def, ...option}));

const wrapColor = (str, {open, close}, useColor) => (useColor ? `${open}${str}${close}` : str);

const transformWrap = (fn, colors) => (content, result, flags) =>
  wrapColor(
    fn(content, result, flags),
    {
      open: '\x1b[36m',
      close: '\x1b[39m',
      ...colors,
    },
    (flags || {}).isFinal,
  );

const matchers = {
  email: /^(\w+(?:[.-]?\w+)*)@(\w+(?:[.-]?\w+)*)(?:\.(\w{2,3}))+$/,
};

const dobRegex = /(\d{2})\/(\d{2})\/(\d{2})/;
const dobTransformer = transformWrap(str => (str || '').replace(/(\d)(?=(\d{2})+$)/g, '$1/'));
const nameTransformer = transformWrap(v => (v ? `${v[0].toUpperCase()}${v.slice(1)}` : ''));
const emailTransformer = v =>
  v ? v.replace(matchers.email, `\x1b[36m$1\x1b[0m\x1b[31m@\x1b[0m\x1b[32m$2\x1b[0m\x1b[31m.$3\x1b[0m`) : '';

// eslint-disable-next-line no-multi-assign
const defaults = {
  password: {
    name: 'password',
    type: 'password',
    message: 'Please enter a password :',
    validate: value => /.{4,}/.test(value) || 'Password should contain at least 4 characters',
  },
  confirm: {
    name: 'confirm',
    type: 'confirm',
    message: 'Are you sure?',
  },
  name: {
    name: 'name',
    type: 'input',
    filter: nameTransformer,
    transformer: nameTransformer,
    validate: Boolean,
    message: 'Enter full name :',
  },
  username: {
    name: 'username',
    type: 'input',
    validate: Boolean,
    message: 'Enter user name :',
  },
  email: {
    name: 'email',
    type: 'input',
    message: 'Enter your email :',
    transformer: emailTransformer,
    validate: value => matchers.email.test(value) || 'Email invalid',
  },
  dateofbirth: {
    name: 'dateofbirth',
    type: 'input',
    transformer: dobTransformer,
    filter: dobTransformer,
    message: 'Date Of Birth ',
    suffix: '[ddmmyy]:',
    validate: v => dobRegex.test(v) || 'Date of birth should match the format [dd/mm/yy]',
  },
};

const ninjaQuery = (opts, useTTy = process.platform === 'linux') => {
  const streams = useTTy
    ? {
        input: new tty.ReadStream(fs.openSync('/dev/tty', 'r')),
        output: new tty.WriteStream(fs.openSync('/dev/tty', 'w')),
      }
    : {};
  const prompt = inquirer.createPromptModule(streams);
  return new Promise((res, rej) => {
    prompt(xSettle({}, opts))
      .then(pass => (Object.values(streams).forEach(socket => socket.destroy()), res(pass)))
      .catch(rej);
  });
};

ninjaQuery.extend = (type, opts) => xSettle(defaults[type], opts);

ninjaQuery.password = (opts, {confirm = false, confirmMessage, unmatchMessage} = {}) =>
  new Promise(async res => {
    const result = await ninjaQuery(ninjaQuery.extend('password', opts));
    if (confirm) {
      let confirmed = false;
      while (!confirmed) {
        // eslint-disable-next-line no-await-in-loop
        const pass = await ninjaQuery(xSettle(defaults.password, {message: confirmMessage || 'Re enter password ?'}));
        result[opts.name] === pass.password
          ? ((confirmed = true), res(result))
          : console.error(unmatchMessage || '\x1b[33m[!]\x1b[0m Password mismatch');
      }
    } else res(result);
  });

ninjaQuery.defaults = defaults;

module.exports = ninjaQuery;
