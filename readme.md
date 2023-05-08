# Yargs Parser Configuration + Completion incompatibilities

## Description

This repository is a minimal reproduction of an incompatibility between the parser configuration options and the completion feature within yargs. Setting `strip-dashed: true` in the parser configuration causes the completion feature to fail.

This is because the completion feature relies on passing '--get-yargs-completions' verbatim to yargs. Within the [`Completion` class](https://github.com/yargs/yargs/blob/main/lib/completion.ts), the `completionKey` is explicitly set to `get-yargs-completions`. Within the YargsInstance, we explicitly check the following condition: `completionKey in argv`, in this location:

- https://github.com/yargs/yargs/blob/main/lib/yargs-factory.ts#L2054

Since the argv has been parsed already at this point, the argument is now 'getYargsCompletions' instead of 'get-yargs-completions'. This causes the completion feature to never be called.

## Steps to reproduce

- Run `node ./index.js --get-yargs-completions` and note that there is no output.
- Update `index.js` by removing the `strip-dashed: true` option from the parser configuration.
- Run `node ./index.js --get-yargs-completions` and note that the completion feature is called and the output is as expected.

## Workaround and Motivation

This issue was discovered when working on implementing completion for Nx. In our case, we have a small process which runs before yargs is bootstrapped, and preprocesses some arguments. We also happen to already export our parser configuration.

For us, we can check if `process.argv[2] === '--get-yargs-completions'` and remove `strip-dashed: true` from our parser configurations. However, this is not a general solution, and it would be nice if the completion feature could be used in conjunction with the parser configuration.

## Suggested Implementation

The completionKey is fed through the parser transformations so that it matches any transformations that are applied to the arguments. 

## Alternate Implementations

- Provide a way to override the `completionKey`. This would let us, or others who notice a similar breakage, to override the key to match the transformations that are applied to the arguments.

