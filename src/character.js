import { waitForKeyElements, globals } from "./init.js";
import { Sifrr } from '@sifrr/storage';

console.log("character.js: start", document.URL);

// Grab the character id from URL
let characterId_arr = document.URL.match(/https:\/\/www.dndbeyond.com\/profile\/.*\/characters\/(\d*)/);
if (characterId_arr && characterId_arr.length == 2) {
    globals.characterId = characterId_arr[1];
};

// Wait for auth token, then request character json
waitForKeyElements(() => {
    return (globals.cobalt_token != undefined) && (globals.characterId != undefined);
}, () => {
    // fetch(
    //     "https://character-service.dndbeyond.com/character/v5/character/" + globals.characterId, {
    //     method: "GET",
    //     cache: "no-cache",
    //     credentials: "include",
    //     headers: {
    //         "Authorization": "Bearer " + globals.cobalt_token
    //     }
    // })
    //     .then(response => response.json())
    //     .then(json => {
    //         parse_json(json.data);
    //     });
}, {
    interval: 2000,
    maxIntervals: 30,
});

var db = Sifrr.Storage.getStorage({
    priority: ['indexeddb', 'websql', 'localstorage', 'cookies', 'jsonstorage'],
    name: "characters",
    version: 1, // version number (integer / float / string), 1 is treated same as '1'
    desciption: 'Beyond Campaigns webextension storage',
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
    db.set(character.id, { value: character });
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
    let character = {
        id: globals.characterId,
        name: $(".ddbc-character-name").text(),
        level: $(".ddbc-character-progression-summary__level").text().slice(6),
        race: $(".ddbc-character-summary__race").text(),
        class: $(".ddbc-character-summary__classes").text(),
        url: document.URL,
        last_update: Date.now().toString()
    };
    console.log("chracter.js: no avatar elements:", $(".ddbc-character-avatar__portrait"));
    console.log("chracter.js: background-image:", $(".ddbc-character-avatar__portrait").css("background-image"));

    let avatar_jq = $(".ddbc-character-avatar__portrait");
    let avatar_background_image = avatar_jq.css("background-image");
    if(avatar_background_image){
        character.avatar_url = ($(".ddbc-character-avatar__portrait").css("background-image").match(/(https.*)\?/))[1];
    }else{
        console.log("chracter.js: no avatar elements:", avatar_jq);
    }

    let stats = {};
    $(".ddbc-ability-summary").each(function () {
        let obj = $(this);
        let stat_name = obj.find(".ddbc-ability-summary__abbr").text()
        stats[stat_name] = {
            name: stat_name,
            full_name: obj.find(".ddbc-ability-summary__label").text(),
            value: obj.find(".ddbc-ability-summary__secondary").text(),
            modifier: obj.find(".ddbc-ability-summary__primary").text(),
        }
    })
    character.stats = stats;

    let saves = {};
    $(".ddbc-saving-throws-summary__ability").each(function () {
        let obj = $(this);
        let stat_name = obj.find(".ddbc-saving-throws-summary__ability-name").text()
        saves[stat_name] = {
            name: stat_name,
            modifier: obj.find(".ddbc-saving-throws-summary__ability-modifier").text(),
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
            modifier: obj.find(".ct-skills__col--modifier").text(),
            adjustment: adjustment || "",
        }
    });
    character.skills = skills;

    let defenses = {
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

    let conditions = [];
    $(".ddbc-condition__name").each(function () {
        conditions.push($(this).text());
    });
    character.conditions = conditions;

    character.passives = {
        perception: $("div.ct-senses__callout-label:contains('Passive WIS (Perception)')").prev().text(),
        investigation: $("div.ct-senses__callout-label:contains('Passive INT (Investigation')").prev().text(),
        insight: $("div.ct-senses__callout-label:contains('Passive WIS (Insight)')").prev().text(),
        senses: $("ct-senses__summary").text(),
    };

    character.health = {
        hp_current: $("div.ct-health-summary__hp-item-label:contains('Current') + .ct-health-summary__hp-item-content").text(),
        hp_max: $("div.ct-health-summary__hp-item-label:contains('Max') + .ct-health-summary__hp-item-content").text(),
        hp_temp: $("div.ct-health-summary__hp-item-label:contains('Temp') + .ct-health-summary__hp-item-content").text(),
    };

    character.core = {
        ac: $(".ddbc-armor-class-box__value").text(),
        initiative: $(".ct-initiative-box__value").text(),
        speed: $(".ct-speed-box__box-value").find(".ddbc-distance-number__number").text(),
        languages: $(".ct-proficiency-groups__group-label:contains('Languages')").next().text(),
    }

    return character;
}
