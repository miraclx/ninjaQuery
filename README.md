# NinjaQuery

> Middlelayer for Inquirer.js to allow prompting even when output is piped

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

[![NPM][npm-image-url]][npm-url]

## Installing

Via [NPM][npm]:

``` bash
npm install ninja_query
```

## Usage

``` javascript
// Node CommonJS
const ninjaQuery = require('ninja_query');
// Or Node ES6
import ninjaQuery from 'ninja_query';
```

## Examples

``` javascript
// Use ninjaQuery just like you use 
ninjaQuery({
  name: "name",
  message: "What is your name?"
}).then(({name}) => console.log(`Hello, ${name}`))
```

### API

#### <a id='ninjaquery'></a> ninjaQuery(questions)

* `quetions`: &lt;[Question](#question) | [Question](#question)[]&gt;
* Returns: &lt;[Promise]&gt;

Launch the prompt interface (inquiry session)

#### <a id='ninjaquery_extend'></a> ninjaQuery.extend(templateID[, question])

* `templateID`: &lt;[string]&gt;
* `quetion`: &lt;[Question](#question)&gt;
* Returns: &lt;[Question](#question)&gt;

Merge the `templateID`'s [default Question](#defaultquestions) with the specified `question` object.

#### <a id='ninjaquery_password'></a> ninjaQuery.password(question[, options])

* `question`: &lt;[Question](#question)&gt; Question block to be used
* `options`: &lt;[Object]&gt; Password options
  - `confirm`: &lt;[string]&gt; Whether or not to request a re-enter for confirmation of input. **Default**: `false`
  - `confirmMessage`: &lt;[string]&gt; Message to print on the re-enter prompt. **Default**: `'Re enter password ?'`
  - `unmatchMessage`: &lt;[string]&gt; Message to print when passwords don't match. **Default**: `'[!] Password mismatch'`
* Returns: &lt;[Promise]&gt;

Construct a password prompt that inherits from [DefaultQuestions.password](#defaultquestions_password) and can request a password re-entry for confirmation.

#### <a id='defaults'></a> ninjaQuery.defaults: [DefaultQuestions](#defaultquestions)

#### <a id='question'></a> Question

A question object is a hash containing question related values:

- `type`: &lt;[string]&gt; Type of the prompt.
- `name`: &lt;[string]&gt; The name to use when storing the answer in the answers hash. If the name contains periods, it will define a path in the answers hash.
- `message`: &lt;[string]| (`rootObject`: [object]) => [string] &gt; The question to print. If defined as a function, the first parameter will be the current inquirer session answers. Defaults to the value of name (followed by a colon).
- `default`: &lt;[string]|[number]|[boolean]|[array]|[function]&gt; Default value(s) to use if nothing is entered, or a function that returns the default value(s). If defined as a function, the first parameter will be the current inquirer session answers.
- `choices`: &lt;[array]| (`rootObject`: [object]) => [array] &gt; Choices array or a function returning a choices array. If defined as a function, the first parameter will be the current inquirer session answers. Array values can be simple numbers, strings, or objects containing a name (to display in list), a value (to save in the answers hash) and a short (to display after selection) properties. The choices array can also contain a Separator.
- `validate`: &lt; (`input`: [string], `hash`: [object]) => [boolean] &gt; Receive the user input and answers hash. Should return true if the value is valid, and an error message (String) otherwise. If false is returned, a default error message is provided.
- `filter`: &lt; `input` => [string] &gt; Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the Answers hash.
- `transformer`: &lt; (`input`: [string], `hash`: [object], `flags`: [object]) => [string] &gt; Receive the user input, answers hash and option flags, and return a transformed value to display to the user. The transformation only impacts what is shown while editing. It does not modify the answers hash.
- `when`: &lt; `hash` => [boolean] &gt; Receive the current user answers hash and should return true or false depending on whether or not this question should be asked. The value can also be a simple boolean.
- `pageSize`: &lt;[number]&gt; Change the number of lines that will be rendered when using list, rawList, expand or checkbox.
- `prefix`: &lt;[string]&gt; Change the default prefix message.
- `suffix`: &lt;[string]&gt; Change the default suffix message.
  
#### <a id='defaultquestions'></a> DefaultQuestions

Default templates for [Question](#question)

<a id="defaultquestions_password"></a> - `password`

  name | type | message | validate
  ---- | ---- | ------- | --------
  `'password'` | `'password'` | `'Please enter a password :'` | [function]

	- `validate`: Password must be 4 characters or more
      - **else** `'Password should contain at least 4 characters'`

- `confirm`

  name | type | message
  ---- | ---- | -------
  `'confirm'` | `'confirm'` | `'Are you sure?'`

- `name`

  name | type | message | filter | transformer | validate
  ---- | ---- | ------- | ------ | ----------- | --------
  `'name'` | `'input'` | `'Enter full name :'` | [function] | [function] | [function]

	- `filter`: Autocapitalise first character
	- `validate`: A least one character must be present
	- `transform`: Autocapitalise first character, colorise when [Enter] is pressed

- `username`

  name | type | message | validate
  ---- | ---- | ------- | --------
  `'username'` | `'input'` | `'Enter user name :'` | [function]

  - `validate`: A least one character must be present

- `email`

  name | type | message | transformer | validate
  ---- | ---- | ------- | ----------- | --------
  `'email'` | `'input'` | `'Enter your email :'` | [function] | [function]

	- `validate`: Email must be valid
      - **else** `'Email invalid'`
	- `transform`: Colorise email once email is valid

- `dateofbirth`

  name | type | message | filter | transformer | validate | suffix 
  ---- | ---- | ------- | ------ | ----------- | -------- | ------
  `'dateofbirth'` | `'input'` | `'Date Of Birth '` | [function] | [function] | [function] | `'[ddmmyy]:'`

	- `filter`: Insert separator `'/'` to date in answers
	- `validate`: Must be a valid date in the format 'dd/mm/yy'
      - **else** `'Date of birth should match the format [dd/mm/yy]'`
	- `transform`: Insert separator `'/'` to date on input
  
## More Examples

Check out some examples in the [`examples`](examples) folder

``` javascript
$ node examples/form.js
$ node examples/login.js
$ node examples/password.js
```

## Development

### Building

Feel free to clone, use in adherance to the [license](#license) and perhaps send pull requests

``` bash
git clone https://github.com/miraclx/ninjaQuery.git
cd ninjaquery
npm install
# hack on code
npm run build
```

## License

[Apache 2.0][license] © **Miraculous Owonubi** ([@miraclx][author-url]) &lt;omiraculous@gmail.com&gt;

[npm]:  https://github.com/npm/npm 'The Node Package Manager'
[license]:  LICENSE 'Apache 2.0 License'
[author-url]: https://github.com/miraclx

[npm-url]: https://npmjs.org/package/ninja_query
[npm-image]: https://badgen.net/npm/node/ninja_query
[npm-image-url]: https://nodei.co/npm/ninja_query.png?stars&downloads
[downloads-url]: https://npmjs.org/package/ninja_query
[downloads-image]: https://badgen.net/npm/dm/ninja_query

[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
