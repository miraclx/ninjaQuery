const ninjaQuery = require('../dist');

const userList = new Map();

async function login() {
  let block;
  const userInput = await ninjaQuery([
    ninjaQuery.extend('username', {name: 'name', message: 'Username :'}),
    ninjaQuery.extend('password', {name: 'password', mask: '*'}),
  ]);
  if (userList.has(userInput.name))
    (block = userList.get(userInput.name)).password === userInput.password
      ? (console.log(` | Successful login!`), console.log(` | Welcome ${block.fname} ${block.lname} (${block.email})`))
      : console.error(' | Login failed! Password wrong');
  else console.error(' | Login failed! User unexistent');
}

async function signup() {
  const userInput = {
    ...(await ninjaQuery([
      ninjaQuery.extend('name', {name: 'fname', message: 'First Name :'}),
      ninjaQuery.extend('name', {name: 'lname', message: 'Last Name  :'}),
      ninjaQuery.extend('username', {
        name: 'username',
        message: 'User Name  :',
        validate: v => !userList.has(v) || 'Username already exists',
      }),
      ninjaQuery.extend('email', {name: 'email'}),
    ])),
    ...(await ninjaQuery.password({name: 'password', mask: '*'}, {confirm: true})),
  };
  userList.set(userInput.username, userInput);
}

function main() {
  console.log('\x1b[36m==========================\x1b[0m');
  ninjaQuery({
    name: 'action',
    type: 'list',
    message: 'Select an action :',
    choices: ['login', 'signup'],
  }).then(async ({action}) => (action === 'login' ? await login() : await signup(), main()));
}

main();
