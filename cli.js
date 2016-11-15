#!/usr/bin/env node

'use strict'

const assert = require('assert')
const mothership = require('mothership')
const child = require('child_process')
const npmPath = require('npm-run-path')
const onExit = require('signal-exit')
const scripts = require('./scripts')

const argv = process.argv.slice(2)

const pkg = mothership.sync(process.cwd(), Boolean)

assert(pkg, 'no package.json found')

assert(
  pkg.pack.scripts,
  'npm scripts missing'
)

let script = argv[0]
if (script === 'run' || script === 'run-script') {
  script = argv[1]
} else {
  assert(scripts.indexOf(script) >= 0, 'invalid npm script: ' + script)
}

const command = pkg.pack.scripts[script]

assert(command, 'no npm script found: ' + script)

const args = command.split(' ')
const executable = args.shift()

const spawn = child.spawn(executable, args, {
  env: npmPath.env(),
  stdio: 'inherit'
})

onExit(function (code, signal) {
  spawn.kill(signal || 'SIGHUP')
})

spawn.on('close', function (code, signal) {
  // Allow the callback to inspect the child’s exit code and/or modify it.
  process.exitCode = signal ? 128 + signal : code

  if (signal) {
    // If there is nothing else keeping the event loop alive,
    // then there's a race between a graceful exit and getting
    // the signal to this process.  Put this timeout here to
    // make sure we're still alive to get the signal, and thus
    // exit with the intended signal code.
    setTimeout(function () {}, 200)
    process.kill(process.pid, signal)
  } else {
    // Equivalent to process.exit() on Node.js >= 0.11.8
    process.exit(process.exitCode)
  }
})
