#!/bin/sh
# Compiles the JSX in app.js into plain JavaScript (app.compiled.js), which index.html loads.
# Run this after every change to app.js, then commit both files. Needs Node.js (npx).
set -e
cd "$(dirname "$0")"
npx --yes esbuild@0.24.2 app.js --loader:.js=jsx --jsx=transform --target=es2017 --format=iife --minify --outfile=app.compiled.js
