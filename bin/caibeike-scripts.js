#!/usr/bin/env node

 'use strict';

 process.on('unhandledRejection', err => {
   throw err;
 });
 
 const execa = require('execa');
 const args = process.argv.slice(2);
 
 const scriptIndex = args.findIndex(
   x => x === 'build' || x === 'start'
 );
 const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
 const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

 if (['build', 'start'].includes(script)) {
   const result = execa.sync(
      'node',
      nodeArgs
        .concat(require.resolve('../scripts/' + script))
        .concat(args.slice(scriptIndex + 1)),
      { stdio: 'inherit' }
    );
   process.exit(result.status);
 } else {
   console.log('无效脚本 "' + script + '".');
 }
 