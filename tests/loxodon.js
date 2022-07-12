const fs = require('fs');
const process = require('process');
const pc = require('../src/parseCharacter.js');


function compareFile(filename) {
    try {
        const json = fs.readFileSync(filename, 'utf8')
        let character = JSON.parse(json);
        let characterURL = `https://www.dndbeyond.com/profile/${character.character_json.userId}/characters/${character.character_json.id}`;
        console.log("\x1b[34m%s\x1b[0m", `#START:   ${character.character_json.name.padEnd(20)} ${characterURL}`);
        let c_json = pc.parseCharacter(character.character_json);
        if (!pc.compareCharacterJSON(character.parsed_dom, c_json)) {
            console.log("\x1b[31m%s\x1b[0m", `#FAIL:    ${character.parsed_dom.name.padEnd(20)} ${characterURL}\n`);
            return false;
        } else {
            console.dir(c_json, { breakLength: 160, colors: false })
            console.log("\x1b[32m%s\x1b[0m", `#SUCCESS: ${character.parsed_dom.name.padEnd(20)} ${characterURL}\n`);
        }
    } catch (err) {
        console.error(err)
    }
    return true;
}

compareFile("./data/56754934.json")
