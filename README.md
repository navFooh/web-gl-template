# WebGL Template
This is a variation on [Web Project Template](https://github.com/navFooh/web-project-template) for WebGL.

## Installation
```
npm install
```

## Gulp tasks
```
gulp
```
- compiles `index.hbs` to `index.html` for development
- compiles runtime `.hbs` files to `.js`
- compiles `.scss` to nested `.css`
- runs watchers for changes to above files
- serves the public folder with BrowserSync and injects CSS or reloads on HTML / JS changes

```
gulp --dist
```
- compiles `index.hbs` to `index.html` for production
- compiles runtime `.hbs` files to `.js`
- compiles `.scss` to compressed `.css`
- compiles all Javascript to `main.min.js`
