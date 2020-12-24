# stat card

A stat card displaying premiership player data.

### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### View build file

Once npm run buld is used open build/index.html to view.

### Notes on code

The html and javascript are rendered from the javascript file index.js. Applying this code to another project would mean taking js file and styles only for reuse. An object class is used so the code can be extended with further data and methods if needed. Functional javascript is also used where possible to help reduce complexity.

Javascript ES6 is used which is compiled using babel. Sass is used and once build is run this is compiled into minified css through webpack.

Comments are added to the javascript file to help understand how each function works.

### Functionality

The drop down lists player names gathered from Json data. Each player when selected brings up their profile details such as image and stats.

### Features

- ES6 Support via [babel](https://babeljs.io/) (v7)
- JavaScript Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)
- SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
- Autoprefixing of browserspecific CSS rules via [postcss](https://postcss.org/) and [autoprefixer](https://github.com/postcss/autoprefixer)
- Style Linting via [stylelint](https://stylelint.io/)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
