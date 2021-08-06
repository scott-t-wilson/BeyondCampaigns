module.exports = {
    verbose: true,
    ignoreFiles: [
        'readme.txt',
    ],
    run: {
        firefox: "firefoxdeveloperedition",
        //firefox: "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox-bin",
        // browserConsole: true,
        firefoxProfile: "webext",
        startUrl: ["https://www.dndbeyond.com/campaigns/2156849#bc_home"]
    },
}