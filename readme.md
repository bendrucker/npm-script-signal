# npm-script-signal [![Build Status](https://travis-ci.org/bendrucker/npm-script-signal.svg?branch=master)](https://travis-ci.org/bendrucker/npm-script-signal)

> npm script wrapper that passes through signals


## Install

```
$ npm install --save npm-script-signal
```


## Usage

Anywhere when you might normally call `npm`, instead call the `npm-script-signal` executable. `npm` will forward _only_ `SIGTERM` signals to scripts ([as of 3.8.1](https://github.com/npm/npm/pull/10868#issuecomment-192457737)). 

```sh
# lifecycle scripts
npm-script-signal start

# arbitrary scripts
npm-script-signal run my-script
```


## License

MIT © [Ben Drucker](http://bendrucker.me)
