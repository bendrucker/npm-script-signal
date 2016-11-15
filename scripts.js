'use strict'

// https://github.com/npm/npm/blob/d081cc6c8d73f2aa698aab36605377c95e916224/test/tap/ignore-scripts.js#L75

module.exports = [
  'prepublish', 'publish', 'postpublish',
  'preinstall', 'install', 'postinstall',
  'preuninstall', 'uninstall', 'postuninstall',
  'pretest', 'test', 'posttest',
  'prestop', 'stop', 'poststop',
  'prestart', 'start', 'poststart',
  'prerestart', 'restart', 'postrestart',
  'preversion', 'version', 'postversion',
  'preshrinkwrap', 'shrinkwrap', 'postshrinkwrap'
]
