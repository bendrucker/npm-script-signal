'use strict'

const test = require('tape')
const child = require('child_process')
const path = require('path')
const running = require('is-running')

test('start', function (t) {
  t.plan(1)

  const cwd = path.resolve(__dirname, './fixtures/start')
  const cli = path.resolve(__dirname, 'cli.js')
  child.execFile('node', [cli, 'start'], {cwd: cwd}, function (err, stdout) {
    if (err) return t.end(err)
    t.equal(stdout, 'bar\n')
  })
})

test('run / run-script', function (t) {
  t.plan(1)

  const cwd = path.resolve(__dirname, './fixtures/run')
  const cli = path.resolve(__dirname, 'cli.js')
  child.execFile('node', [cli, 'run-script', 'start'], {cwd: cwd}, function (err, stdout) {
    if (err) return t.end(err)
    t.equal(stdout, 'bar\n')
  })
})

test('missing scripts', function (t) {
  t.plan(2)

  const cwd = path.resolve(__dirname, './fixtures/missing-scripts')
  const cli = path.resolve(__dirname, 'cli.js')
  child.execFile('node', [cli, 'run-script', 'boop'], {cwd: cwd}, function (err, stdout, stderr) {
    t.ok(err)
    t.ok(/npm scripts missing/.test(stderr))
  })
})

test('parent close', function (t) {
  t.plan(2)

  const cwd = path.resolve(__dirname, './fixtures/run')
  const cli = path.resolve(__dirname, 'cli.js')
  const spawn = child.spawn('node', [cli, 'run-script', 'sleep-10'], {cwd: cwd})

  let pid
  spawn.stdout.once('data', function (data) {
    pid = Number(data.toString().trim())
    t.notOk(isNaN(pid), 'test script returns pid')
    spawn.kill()
  })

  spawn.on('close', function (code) {
    t.notOk(running(pid), 'pid is not running')
  })
})

test('child close', function (t) {
  t.plan(1)

  const cwd = path.resolve(__dirname, './fixtures/run')
  const cli = path.resolve(__dirname, 'cli.js')
  const spawn = child.spawn('node', [cli, 'run-script', 'sleep-1'], {cwd: cwd})
  spawn.on('close', function (code) {
    t.equal(code, 0)
  })
})

test('child intercepts signal', function (t) {
  t.plan(1)

  const cwd = path.resolve(__dirname, './fixtures/run')
  const cli = path.resolve(__dirname, 'cli.js')
  const spawn = child.spawn('node', [cli, 'run-script', 'nohup'], {cwd: cwd})

  spawn.stdout.on('data', function (data) {
    t.equal(data.toString().trim(), 'kaboom')
  })

  process.nextTick(spawn.kill.bind(spawn), 'SIGHUP')
  spawn.on('close', () => t.pass('closed'))
})
