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
        startUrl: ["https://www.dndbeyond.com/combat-tracker/23f36ccf-f6b5-444e-bc4c-95dcf02df8bc"]
        // startUrl: ["https://www.dndbeyond.com/campaigns/2156849#bc_home"]
    },
    build: {
        overwriteDest: true,
      },

}