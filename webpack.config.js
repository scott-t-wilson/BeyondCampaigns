var webpack = require('webpack');
const WebExtPlugin = require('web-ext-plugin');
const path = require("path");

module.exports = {
    mode: 'development',
    node: {
        global: false,
    },
    devtool: false,
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: [
            '/node_modules/',
            '/.vscode/',
            '/notes/',
            '/BeyondCampaigns.code-workspace'
        ],
    },
    entry: {
        campaign: "./src/campaign.js",
        character: "./src/character.js",
        combat: "./src/combat.js",
        gamescape: "./src/gamescape.js",
        // content_scripts: "./src/init.js",
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name].js"
    },
    plugins: [new WebExtPlugin({
        sourceDir: path.resolve(__dirname, "addon"),
        artifactsDir: __dirname,
        buildPackage: true,
        overwriteDest: true,
        // target: "fake"
        firefox: false
    }),
        // new LodashModuleReplacementPlugin,
        // new webpack.optimize.UglifyJsPlugin,
    ],
};

module.loaders = [{
    'loader': 'babel-loader',
    'test': /\.js$/,
    'exclude': /node_modules/,
    'query': {
        'plugins': ['lodash'],
        'presets': [['@babel/env', { 'targets': { 'node': 6 } }]]
    }
}];
