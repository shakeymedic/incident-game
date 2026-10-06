# WMEBEM Major Incident Game

Live at https://wmebemincident.netlify.app. This is a static site, and Netlify publishes the files exactly as they are in the repo. There is no build step on Netlify.

## Files

- `index.html` loads React (production build), Tailwind, jsPDF and the game.
- `app.js` is the game source, written in JSX. **Edit this file.**
- `app.compiled.js` is generated from `app.js`, and it is the file the browser actually runs. Do not edit it by hand.
- `style.css` holds the custom styles.

## After editing `app.js`

Regenerate `app.compiled.js` and commit both files:

```sh
./build.sh
```

This needs Node.js. It runs esbuild via `npx` to turn the JSX into plain JavaScript, so nothing has to be installed in the repo. If you forget this step, the live site keeps running the old game.
