# How to setup minimal react/webpack/babel app

## Create app and integrate webpack

Create a new directory for your new react app. For the sake of this documentation, we'll call this directory `app`.

Next we'll need to initialize the `app` directory with a `package.json` file. To do so, run these commands:

    cd app
    npm init -y

Adding the `-y` flag informs npm to initialize the `package.json` file with default values instead of prompting you for input. If you'd like go through the new `package.json` file and edit what you want.

We will now install the necessary webpack npm modules to get started using webpack. Run this command:

    npm i --save-dev webpack webpack-dev-server webpack-cli

As a quick note, `npm i` is a shortcut for `npm install`.

The `--save-dev` flag tells npm to place the new modules into the `devDependencies` object in the `package.json` file. That way, when building a production version of your app, npm will ignore all the modules listed in `devDependencies`.

We've installed three npm packages related to webpack, and as a brief note, these packages do the following:

### webpack
This is the core webpack module that provides all the base webpack functionality for performing bundling, dependency management, pre-processing, and more.  

### webpack-dev-server
This module is useful for development only, and it's main use to it provide live reloading as changes are made to the code.

### webpack-cli
This module allows for the use of a config file, `webpack.config.js`. It's useful for passing cli parameters to the config file. Specifically, the webpack docs say:
> Any parameters sent to the CLI will map to a corresponding parameter in the config file

After running the previous command, you'll notice that a `package-lock.json` file was created as well as a `node_modules` directory containing all your third party dependencies for your app. Now, we want to add a script in the `package.json` for running webpack. Add this line in the `scripts` object in `package.json`:

    "start": "webpack-dev-server --config ./webpack.config.js --mode development"

Your `scripts` object should now looks something like this:

    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack-dev-server --config ./webpack.config.js --mode development"
    },

Don't forget to add the comma after the line starting with "test" :)

The command we just added will allow us to run `npm run start` from the command line. When we run that command, it'll start the webpack dev server using the configuration in `./webpack.config.js`. So..the next thing to do will be to create that config file.

Create a file in the root of `app` (or whatever you called your directory) called `webpack.config.js`. To create the file on the command line, make sure you're in the root of your project, then run:

    touch webpack.config.js

Next, paste the following code snippet in the `webpack.config.js` file:

    module.exports = {
        entry: [
            './src/index.js'
        ],
        output: {
            path: './dist',
            filename: 'bundle.js'
        },
        devServer: {
            contentBase: './dist'
        }
    };

This is the bare minimum setup required for getting webpack to work.

The `entry` array tells webpack where to begin its magic (where to start bundling from). Since `entry` is an array, you can specify mulitple places where webpack can start bundling from.

The `output` object contains info about where webpack should deposit the newly bundled application.
The `path` property tells webpack to deposit the bundled app into the `dist/` directory
The `filename` property tells webpack to name the newly bundled application `bundle.js`.

The `devServer` object tell webpack-dev-server where to look to serve files. Without this object, webpack-dev-server will serve files in the current directory. The `contentBase` property is used to tell webpack-dev-server where to serve files from. By default, the `index.html` file will be served if `contentBase` points at a directory.

To summarize, webpack will begin bundling and processing your app in the `./src/index.js` file, and when it's done with that, it will place that newly bundled entity into `./dist/bundle.js`.

Now that we have a webpack file, we need to create the `src` directory with a file called `index.js` to match the `entry` configuration in `webpack.config.js`. To do that, make sure you're in the root of your project, then run:

    mkdir src
    cd src
    touch index.js

Now add the following code to `index.js`:

    console.log('Hello, World!');

Secondly, we need to create the `dist` directory where webpack will output your app. Make sure you're in the root of your project, then run:

    mkdir dist

Lastly, webpack-dev-server will look in the `dist/` directory when serving files (because of the `devServer.contentBase` config), so we need to create an `index.html` file in the `/dist` directory so that the dev server can properly serve files. Make sure you are in the `dist/` directory of your project, then run:

    touch index.html

Paste the following code into `index.html`:

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>Lesson 1</title>
            <meta charset="utf-8" />
        </head>
        <body>
            <div id="app"></div>
            <script src="/bundle.js"></script>
        </body>
    </html>

As you can see, this is a bare bones page with nothing on it expect for a script tag that points to the `/bundle.js` file where webpack will be outputting our application.

At this point, we can run our app to see if it's working properly. To run the app, make sure you're in the root directory of your project, then run:

    npm start

Navigate to `http://localhost:8080/` and open the dev tools. Navigate to the `Console` tab and you should see the text "Hello, World!". This text comes from the `./src/index.js` file. If you see this text, then everything up to this point is woring perfectly! Take a deep breath :)

## Integrating Babel

To get babel up and running in your application, make sure you're in the root of your project directory, then run:

    npm i --save-dev babel-core babel-loader babel-preset-env

The modules you just installed will all be added to the `devDependencies` object in `package.json`, and they do the following:

### babel-core
All core functionality babel needs to compile js code into es5.

### babel-loader
To understand what the `babel-loader` module does, we'll need to understand what a loader is in the first place. According to webpack:
> Loaders are transformations that are applied on the source code of a module. They allow you to pre-process files as you import or “load” them.

Since babel allows us to compile es6 -> es5, the `babel-loader` module simply puts this compilation functionality into terms that webpack understands. So, in other words, according to the babel docs:
> This package allows transpiling JavaScript files using Babel and webpack.

### babel-preset-env
This modules allows you to specify exactly which configuration options (presets) you want babel to use when compiling you code. According to the babel docs, this module is:

> A Babel preset that compiles ES2015+ down to ES5 by automatically determining the Babel plugins and polyfills you need based on your targeted browser or runtime environments.

You can essentially specify if you want babel to compile just es2015 -> es5 or if you want it to compile es2015, es2016, and es2017 -> es5, or any number of other options including specific browser versions.

Now that we've installed all the core babel modules, we now want to install the specific babel presets we want to use when babel is compiling our code. The first preset we want is the `babel-preset-stage-2` module. This module tells babel to compile certain features/functionality that is non-standard or has yet to be formally accepted as a standard. However, the features/functionality in stage-2 are mostly finalized and likely won't change much in the future, so they are same to use. There are less stable stages like `babel-preset-stage-3` and beyond. To install this preset, run:

    npm i --save-dev babel-preset-stage-2

Now, since we're using react as well, we want to install the react preset to make sure babel compiles jsx -> js as well as few other react specific things. To install this preset, run:

    npm i --save-dev babel-preset-react

Now that we have all the babel stuff installed, we need to specify exactly which presets babel should use as well as wire up a few things in our `webpack.config.js` file.

To specify which babel presets we want to use, we can create a `.babelrc` file in the root of our project:

    touch .babelrc

Paste the following code in the new `.babelrc` file:

    {
        "presets": [
            "env",
            "react",
            "stage-2"
        ]
    }

Now, inside the `webpack.config.js` file, paste the following snippet after the `entry` object:

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },

Alright, we've finished integrating babel with webpack. Now on to the last phase (which is much quicker!)

## Integrating react
To integrate react into our app, we need to install two node modules. Make sure you're in the root of your project, then run:

    npm i --save react react-dom

The only difference between this `npm i` and the previous ones is that this actually installs the `react` and `react-dom` modules into the `dependencies` object in `package.json` (hence `--save` instead of `--save-dev`). This means that these two modules will be included/utilized in the production build of the app. 

Now, open `src/index.js` and delete the contents of the file. Now paste the following snippet:

    import React from 'react';
    import ReactDOM from 'react-dom';

    const Hello = ({ name }) => <div>{`Hello ${name}!`}</div>;

    ReactDOM.render(
        <Hello name="Mark" />,
        document.getElementById('app')
    );

If you run:

    npm start

and then navigate to `http://localhost:8080/`, you should see the text "Hello Mark!" in the top left of the browser.

Congratulations! You've successfully setup and integrated babel/webpack/react :)
