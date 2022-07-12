import { waitForKeyElements, globals, downloadJsonFile, register_fetch, deep_compare } from "./init.js";
import { Sifrr } from '@sifrr/storage';
import { parseCharacter, compareCharacterJSON } from "./parseCharacter.js";
// const parseCharacter = require('../src/parseCharacter.js');

console.log("character.js: start", document.URL);

let debug_data = {};

// Grab the character id from URL
let characterId_arr = document.URL.match(/https:\/\/www.dndbeyond.com\/profile\/.*\/characters\/(\d*)/);
if (characterId_arr && characterId_arr.length == 2) {
    globals.characterId = characterId_arr[1];
};

function fetchCharacter(characterId){
    fetch(
        `https://character-service.dndbeyond.com/character/v5/character/${characterId}`, {
        method: "GET",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Authorization": "Bearer " + globals.cobalt_token
        }
    })
        .then(response => response.json())
        .then(json => {
            console.log("character-service.dndbeyond.com");
            debug_data["character_json"] = json.data;
            debug_data["parsed_json"] = parseCharacter(json.data);
        });
}

// Wait for auth token, then request character json
waitForKeyElements(() => {
    return (globals.cobalt_token != undefined) && (globals.characterId != undefined);
}, () => {
    fetch(
        `https://character-service.dndbeyond.com/character/v5/character/${globals.characterId}`, {
        method: "GET",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Authorization": "Bearer " + globals.cobalt_token
        }
    })
        .then(response => response.json())
        .then(json => {
            console.log("character-service.dndbeyond.com");
            debug_data["character_json"] = json.data;
            debug_data["parsed_json"] = parseCharacter(json.data);
        });
}, {
    interval: 2000,
    maxIntervals: 30,
});

var db = Sifrr.Storage.getStorage({
    priority: ['indexeddb', 'websql', 'localstorage', 'cookies', 'jsonstorage'],
    name: "characters",
    version: 1, // version number (integer / float / string), 1 is treated same as '1'
    description: 'Beyond Campaigns webextension storage',
    size: 5 * 1024 * 1024, // Max db size in bytes only for websql (integer)
    ttl: 0 // Time to live/expire for data in table (in ms), 0 = forever
});
var character = null;

// Wait for dom load then extract
waitForKeyElements(() => {
    let race_targets = $(".ddbc-character-summary__race");
    let avatar_targets = $(".ddbc-character-avatar__portrait");
    return avatar_targets.add(race_targets);
}, () => {
    character = parse_dom();
    if (character) {
        db.set(character.id, { value: character });
    }
}, {
    interval: 2000,
    maxIntervals: 30,
    foundAttr: "wfke-found-character",
});

function parse_json(data) {
    let lastUpdate = Date.parse(data.dateModified);
    // data.temporaryHitPoints;
    // data.overrideHitPoints;
    // data.bonusHitPoints;
    // data.baseHitPoints;
    // data.removedHitPoints;
}

function parse_dom() {
    if ($(".ct-character-sheet-desktop").length == 0) {
        console.log("Character sheet is mobile version, we can't parse.");
        return null;
    }
    let character = {
        id: parseInt(globals.characterId),
        name: $(".ddbc-character-name").text(),
        level: $(".ddbc-character-progression-summary__level").text().slice(6),
        race: $(".ddbc-character-summary__race").text(),
        class: $(".ddbc-character-summary__classes").text(),
        url: document.URL,
        last_update: Date.now().toString()
    };
    console.log("character.js: no avatar elements:", $(".ddbc-character-avatar__portrait"));
    console.log("character.js: background-image:", $(".ddbc-character-avatar__portrait").css("background-image"));

    let avatar_jq = $(".ddbc-character-avatar__portrait");
    let avatar_url = avatar_jq.css("background-image");
    if (avatar_url) {
        let url_matches = avatar_url.match(/(https.*)\?/);
        if (url_matches && url_matches.length >= 1) {
            character.avatarUrl = url_matches[1];
        } else {
            character.avatarUrl = "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png";
        }
    } else {
        console.log("character.js: no avatar elements:", avatar_jq);
    }
    console.log(character.avatarUrl);

    let stats = {};
    $(".ddbc-ability-summary").each(function () {
        let obj = $(this);
        let stat_name = obj.find(".ddbc-ability-summary__abbr").text().toLowerCase();
        stats[stat_name] = {
            key: stat_name,
            name: obj.find(".ddbc-ability-summary__label").text(),
            value: parseInt(obj.find(".ddbc-ability-summary__secondary").text()),
            modifier: parseInt(obj.find(".ddbc-ability-summary__primary").text()),
        }
    })
    character.stats = stats;

    let saves = {};  // TODO: add to json parser
    $(".ddbc-saving-throws-summary__ability").each(function () {
        let obj = $(this);
        let stat_name = obj.find(".ddbc-saving-throws-summary__ability-name").text()
        saves[stat_name] = {
            name: stat_name,
            modifier: parseInt(obj.find(".ddbc-saving-throws-summary__ability-modifier").text()),
            adjustment: "",
        }
    })
    $(".ct-dice-adjustment-summary"); // TODO Talash has Adv on wis saves... figure it out
    character.saves = saves;

    let skills = {};
    $(".ct-skills__item").each(function () {
        let obj = $(this);
        let skill_name = obj.find(".ct-skills__col--skill").text();
        let adjustment = obj.find(".ct-skills__adjustment[data-original-title]").attr("data-original-title");
        skills[skill_name.toLowerCase()] = {
            name: skill_name,
            stat: obj.find(".ct-skills__col--stat").text().toLowerCase(),
            modifier: parseInt(obj.find(".ct-skills__col--modifier").text()),
            adjustment: adjustment || "",
        }
    });
    character.skills = skills;
    console.log("character.skills:", character.skills);

    let defenses = {  // TODO: add to json parser
        "resistance": [],
        "immunity": [],
        "vulnerability": []
    };
    $(".ct-defenses-summary__defense ").each(function () {
        let obj = $(this);
        let defense_type = obj.parent().prev().children().attr("data-original-title");
        let damage_type = obj.text();
        defenses[defense_type.toLowerCase()].push(damage_type);
    })
    character.defenses = defenses;
    console.log("character.defenses:", character.defenses);

    let conditions = [];  // TODO: add to json parser
    $(".ddbc-condition__name").each(function () {
        conditions.push($(this).text());
    });
    character.conditions = conditions;
    console.log("character.conditions:", character.conditions);

    character.passives = {
        perception: parseInt($("div.ct-senses__callout-label:contains('Passive WIS (Perception)')").prev().text()),
        investigation: parseInt($("div.ct-senses__callout-label:contains('Passive INT (Investigation')").prev().text()),
        insight: parseInt($("div.ct-senses__callout-label:contains('Passive WIS (Insight)')").prev().text()),
    };
    console.log("character.conditions:", character.conditions);

    character.health = {
        hp_current: parseInt($("div.ct-health-summary__hp-item-label:contains('Current') + .ct-health-summary__hp-item-content").text()),
        hp_max: parseInt($("div.ct-health-summary__hp-item-label:contains('Max') + .ct-health-summary__hp-item-content").text()),
        hp_temp: parseInt($("div.ct-health-summary__hp-item-label:contains('Temp') + .ct-health-summary__hp-item-content").text()),
    };
    if (isNaN(character.health.hp_temp)) {
        character.health.hp_temp = 0;
    }
    console.log("character.health:", character.health);

    let dom_languages = $(".ct-proficiency-groups__group-label:contains('Languages')").next().text().toLowerCase();
    // let language_array = dom_languages.split(", ");
    // language_array.sort();
    character.core = {
        ac: parseInt($(".ddbc-armor-class-box__value").text()),
        initiative: parseInt($(".ct-initiative-box__value").text()),
        speed: parseInt($(".ct-speed-box__box-value").find(".ddbc-distance-number__number").text()),
        languages: dom_languages.split(", ").sort(),
    }
    console.log("character.core:", character.core);

    debug_data["parsed_dom"] = character;

    return character;
}

// Wait for auth token, then request character json
waitForKeyElements(() => {
    return (debug_data.character_json != undefined) && (debug_data.parsed_dom != undefined)
}, () => {
    console.log("Parsing done, check for equality and download if needed");
    if(!compareCharacterJSON(debug_data.parsed_dom, debug_data.parsed_json)){
        downloadJsonFile(debug_data, `${globals.characterId}.json`);
    }
}, {
    interval: 1000, maxIntervals: 30,
});

