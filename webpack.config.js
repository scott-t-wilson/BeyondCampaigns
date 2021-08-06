const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    mode: 'development',
    node: {
        global: false,
    },
    devtool: false,
    // watch: true,
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
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "*.css", context: "src" },
                { from: "icons/*", context: "src" },
                { from: "lib/*", context: "src" },
            ],
        }),
    ],
};
