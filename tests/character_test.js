const fs = require('fs');
const process = require('process');
const pc = require('../src/parseCharacter.js');


function compareFile(filename) {
    try {
        const json = fs.readFileSync(filename, 'utf8')
        let character = JSON.parse(json)
        let c_api = pc.parseCharacter(character.character_json);
        if (!pc.compareCharacterJSON(character.parsed_dom, c_api)) {
            console.log("Failed:", character.parsed_dom.name, character.parsed_dom.url);
            return false;
        }
    } catch (err) {
        console.error(err)
    }
    return true;
}

const dir = './data/';
fs.readdir(dir, (err, files) => {
    if (err) {
        throw err;
    }
    files.forEach(filename => {
        if (filename.endsWith(".json")) {
            if(!compareFile(dir + filename)){
                // process.exit();
            }
        }
    });
});

