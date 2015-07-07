# WebGL Template
This is a variation on my [Web Project Template](https://github.com/navFooh/web-project-template) for WebGL.

## Installation
```
npm install
bower install
```

## Grunt tasks
```
grunt
```
- runs `grunt dev`
- watches for changes in .scss and .hbs files to recompile
```
grunt dev
```
- builds a development version of index.html
- compiles the CSS to an expanded file
- compiles the Handlebars templates to javascript
```
grunt dist
```
- builds a distribution version of index.html
- compiles the CSS to a compressed file
- compiles the Handlebars templates to javascript
- packages all the javascript in main.min.js