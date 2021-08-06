import { waitForKeyElements, register_url, register_fetch, gamelog, globals, merge } from "./init.js";
import { BCRollLogger } from "./bcRollRenderer"
import { Sifrr } from '@sifrr/storage';
import marked from 'marked';
import EasyMDE from 'easymde';
import GridStack from '../node_modules/gridstack/dist/gridstack-h5';

var map_url = "https://gamescape.app/maps"
var game_id = null;
(function () {
    let arr = document.URL.match(/https:\/\/www.dndbeyond.com\/campaigns\/(\d*)/);
    if (arr && arr.length == 2) {
        game_id = arr[1];
    }
}());

var campaign_info = {}
var grid = null;
var campaign_wrapper = null;

/******************************************************************************
 * 
 * REGISTER URL https://www.dndbeyond.com/campaigns/#bc_home
 * 
******************************************************************************/
register_url(
    "https://www.dndbeyond.com/campaigns/\\d*(#bc_home)?$",
    function load() {
        console.log("register_url load:", document.URL);
        if (document.URL.match(/.*#bc_home$/)) {
            start_beyond_campaign();
        }
        waitForKeyElements(".more-links__links", function () {
            $(`<a class="bc-button" href="#bc_home">
                    <span class="label bc-button-label">Beyond Campaigns</span>
                </a>`)
                .on("click", start_beyond_campaign)
                .prependTo($(".more-links__links"));
        }, {
            interval: 100,
            maxIntervals: 300,
        });
    },
    function unload() {
        console.log("BC: unloading campaign");
    }
);

/******************************************************************************
 * 
 * REGISTER FETCH active-short-characters
 * 
******************************************************************************/
register_fetch("https://www.dndbeyond.com/api/campaign/stt/active-short-characters/\\d*$", function (json) {
    console.log(json);
    json.data.forEach(character => {
        character.url = `https://www.dndbeyond.com/profile/${character.userName}/characters/${character.id}`;
        new Character(character);
        // characters[character.id] = character;
    })
    // waitForKeyElements(".bc-character", load_characters);
});

/******************************************************************************
 * 
 * REGISTER FETCH active-campaigns
 * 
******************************************************************************/
register_fetch("https://www.dndbeyond.com/api/campaign/stt/active-campaigns/\\d*$", function (json) {
    campaign_info = json.data;
});

var db = {
    "encounters": null,
    "monsters": null,
    "characters": null
};

(function () {
    Object.keys(db).forEach(k => {
        db[k] = Sifrr.Storage.getStorage({
            priority: ['indexeddb', 'websql', 'localstorage', 'cookies', 'jsonstorage'],
            name: k,
            version: 1, // version number (integer / float / string), 1 is treated same as '1'
            desciption: 'Beyond Campaigns webextension storage',
            size: 5 * 1024 * 1024, // Max db size in bytes only for websql (integer)
            ttl: 0 // Time to live/expire for data in table (in ms), 0 = forever
        });
    })
})();

var encounters = {};
class Encounter {
    constructor(api) {
        this.id = api.id;
        this.name = api.name || "Untitled";
        this.version = api.versionNumber;
        this.campaign = api.campaign.id;
        this.flavorText = api.flavorText || "";
        this.description = api.description || "";
        this.rewards = api.rewards || "";
        this.mdFlavorText = null;
        this.mdDescription = null;
        this.mdRewards = null;

        this.monsters = [];
        api.monsters.forEach(monster => {
            Monster.need(monster.id);
            this.monsters.push({
                id: monster.id,
                quantity: monster.quantity
            })
        });

        this.players = [];
        api.players.forEach(player => this.players.push({
            id: player.id,
        }));
        db.encounters.get(this.id.toString()).then(db_response => {
            let db_encounter = db_response[this.id];
            if (db_encounter) {
                this.mdFlavorText = db_encounter.mdFlavorText || this.flavorText;
                this.mdDescription = db_encounter.mdDescription || this.description;
                this.mdRewards = db_encounter.mdRewards || this.rewards;
            } else {
                this.mdFlavorText = this.flavorText;
                this.mdDescription = this.description;
                this.mdRewards = this.rewards;
            }
        })
    }

    save() {
        console.log("save:", this.id);
        db.encounters.set(this.id.toString(), { value: this });
    }
}

monsters = {};
need_fetch = [];
class Monster {
    constructor(monster_id) {
        this.id = monster_id;
        this.state = "loading";
        db.monsters.get(this.id.toString()).then(db_response => {
            let db_monster = db_response[this.id];
            if (db_monster) {
                merge(this, db_monster);
                this.state = "complete";
            } else {
                this.fetch(this.id);
            }
        })
    }

    static need(monster_id) {
        let monster = monsters[monster_id];
        if (monster == undefined) {
            monster = new Monster(monster_id);
        }
        monsters[monster_id] = monster;
        return monster;
    };

    static isReady() {
        let ready = true;
        Object.values(monsters).forEach(monster => {
            if (monster.state != "complete") {
                ready = false;
            }
        });
        return ready;
    }

    fetch() {
        this.state = "fetching";
        console.log("Monster.fetch:", this.id);
        fetch(
            "https://monster-service.dndbeyond.com/v1/Monster?ids=" + this.id, {
            method: "GET",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + globals.cobalt_token
            }
        })
            .then(response => response.json())
            .then(json => {
                let api_monster = json.data[0];
                merge(this, api_monster);
                db.monsters.set(this.id.toString(), { value: this });
                this.state = "complete";
            });
    }
}

var gCharacters = [];
class Character {
    constructor(character) {
        // waitForKeyElements(
        //     () => {
        //         // wait for the new iframe to disappear, that signals we're ready
        //         return $(iframe_sel).length == 0;
        //     },
        //     () => {
        //         // load from db
        //         console.log(`iframe ${this.id} sel`, $(iframe_sel));
        //         console.log("ready for db read")
        //     }, {

        console.log("character.constructor pre-merge()", character);
        merge(this, character);
        console.log("character.constructor()", this);
        this.selector = `.bc-character[character-id=${this.id}]`;
        this.state = "loading";
        this.set_dom_basics();
        console.log("campaign_info:", campaign_info);
        console.log("game_id:", game_id);
        this.roll_logger = new BCRollLogger(this, game_id);
        // this.url = `https://www.dndbeyond.com/profile/${this.userName}/characters/${this.id}`;
        gCharacters.push(this);
        db.characters.get(this.id.toString()).then(db_response => {
            this.db_character = db_response[this.id];
            console.log("db_character loaded:", this.db_character);
            if (this.db_character) {
                this.state = "complete";
                this.update_dom();
            } else {
                console.log("no db character, fetching iframe:", this.id);
                this.fetch_iframe();
            }
        })
    }

    fetch_iframe() {
        if (this.state == "complete" && this.db_character != undefined) {
            this.update_dom();
            return;
        }
        this.state = "fetching";
        console.log(`Character.fetch(${this.id}):`);
        var iframe = $(`<iframe class='bc-character-iframe-wrapper' src='${this.url}'></iframe>`);
        waitForKeyElements("#bc-campaign-wrapper", (wrapper) => {
            console.log(`Character.fetch(${this.id}): wrapper`, wrapper);
            $("#bc-campaign-wrapper").prepend(iframe);
            iframe.data("bc-character-id", this.id);
            console.log(`Character.fetch(${this.id}): iframe:`, iframe);
            waitForKeyElements(
                () => {
                    db.characters.get(this.id.toString()).then(res => {
                        this.db_character = res[this.id];
                    });
                    console.log(`Character.fetch(${this.id}): waiting for db:`, this);
                    return this.db_character != undefined;
                },
                () => {
                    console.log(`Character.fetch(${this.id}): DB response saved, nuking iframe`, this.db_character);
                    this.state = "complete";
                    this.update_dom();
                    iframe.remove();
                }, {
                interval: 2000,
                maxIntervals: 30,
            });
        }, { foundAttr: `wfke-character-${this.id}` });
    }

    set_dom_basics() {
        waitForKeyElements(this.selector, t => {
            t.find(".bc-pc-name").text(this.name);
            t.find("img.bc-pc-avatar").attr("src", this.avatarUrl);
            t.find("a.bc-pc-avatar").attr("href", this.url);
            t.find("a.bc-pc-avatar").attr("target", this.url);
        }, { foundAttr: "wfke_basics" });
    }

    update_dom() {
        console.log(`update_dom ${this.id}`);
        waitForKeyElements(this.selector, t => {
            if (this.state == "complete") {
                t.find(".bc-pc-race").text(this.db_character.race);
                t.find(".bc-pc-level").text(this.db_character.level);
                t.find(".bc-pc-class").text(this.db_character.class);
                t.find(".bc-pc-hp-current").text(this.db_character.health.hp_current);
                t.find(".bc-pc-hp-max").text(this.db_character.health.hp_max);
                t.find(".bc-pc-hp-temp").text(this.db_character.health.hp_temp);
                t.find(".bc-pc-main-stat-value-passive[stat='ac']").text(this.db_character.core.ac);
                t.find(".bc-pc-stat-value[stat='initiative']").text(this.db_character.core.initiative);
                t.find(".bc-pc-main-stat-value-passive[stat='speed']").text(this.db_character.core.speed);
                t.find(".bc-pc-language-value").text(this.db_character.core.languages);
                t.find(".bc-pc-skill-value-passive").each((i, el) => {
                    $(el).text(this.db_character.passives[$(el).attr("skill")]);
                });
                t.find(".bc-pc-stat-modifier").each((i, el) => {
                    let stat = this.db_character.stats[$(el).attr("stat")]
                    if (stat) {
                        $(el).text(stat.modifier);
                    }
                });
                t.find(".bc-pc-skill-modifier").each((i, el) => {
                    let skill = this.db_character.skills[$(el).attr("skill")]
                    if (skill) {
                        $(el).text(skill.modifier);
                    }
                });
            }
            let target_character = this;
            t.find(".bc-pc-roll-button").on("click", function (event) {
                target_character.roll_click(event);
            });
            t.find(".bc-pc-stat-button").on("click", function (event) {
                target_character.stat_click(event);
            });
            t.find(".bc-pc-roll-popup").on("click", function (event) {
                target_character.stat_click(event);
            });
        }, { foundAttr: "wfke_update_dom" });
    }

    stat_click(event) {
        console.log("stat_click", this);
        let button = $(event.currentTarget);
        let stat = button.attr("stat");
        let skill_key = button.attr("skill");
        console.log(event.currentTarget);
        console.log('button.attr("stat")', button.attr("stat"));
        console.log('button.attr("skill")', button.attr("skill"));
        let roll_wrapper = $(roll_template_html);
        let roll_menu = $(roll_wrapper).first();
        $("#bc-campaign-wrapper").append(roll_menu);
        $("#bc-campaign-main").css("pointer-events", "none");
        // console.log(roll_wrapper);
        // console.log(roll_menu);
        $(document.body).on("click keydown", event => {
            // console.log("event.target:", event.target);
            // console.log("(event.target == document.body):", (event.target == document.body));
            if ((event.target == document.body) || (event.originalEvent.key == "Escape")) {
                roll_wrapper.remove();
                $("#bc-campaign-main").css("pointer-events", "auto");
            }
        })
        $(roll_menu).find("li[bc-roll-kind=advantage] > .bc-icon-check").hide();
        $(roll_menu).find("li[bc-roll-kind=disadvantage] > .bc-icon-check").hide();
        if (skill_key) {
            let skill = this.db_character.skills[skill_key];
            $(roll_menu).find("li[bc-roll-type]").remove();
            $(roll_menu).find(".bc-roll-popup-heading").text(skill.name);
            let skill_item = $(`
            <li class="bc-roll-popup" bc-roll-type="check" bc-roll-action="${skill.name}">
                <div class="bc-roll-popup-mod">${skill.modifier}</div>
                ${skill.name}<div class="bc-icon-check"></div>
            </li>
            `)
            $(roll_menu).find("ul.bc-roll-type").append(skill_item);
        }
        if (stat) {
            $(roll_menu).find(".bc-roll-popup-heading").text(this.db_character.stats[stat].full_name);
            $(roll_menu).find("li[bc-roll-type] > .bc-icon-check").hide();
            $(roll_menu).find("li[bc-roll-type=check] > .bc-icon-check").show();

            $(roll_menu).find("li[bc-roll-type=check] > .bc-roll-popup-mod").text(
                this.db_character.stats[stat].modifier
            );
            $(roll_menu).find("li").attr("bc-roll-action", stat);
            $(roll_menu).find("li[bc-roll-type=save] > .bc-roll-popup-mod").text(
                this.db_character.saves[stat].modifier
            );

            // border-radius: 5px;
            // display: inline;
            // position: relative;
            // background-repeat: no-repeat;
            // background-position-y: .5px;
            // padding-left: 2ch;
            // /* margin-left: .5ch; */
            // margin-right: 10px;
            // font-size: 20px;


            Object.values(this.db_character.skills).forEach(skill => {
                if (skill.stat == stat) {
                    let adjustment_html = ""; // bc-icon-advantage  bc-icon-disadvantage
                    if (skill.adjustment == "Disadvantage") {
                        adjustment_html = '<div class="bc-icon-inline"></div>';
                    } else if (skill.adjustment == "Advantage") {
                        adjustment_html = '<div class="bc-icon-inline"></div>';
                    }
                    let skill_item = $(`
                    <li class="bc-roll-popup" bc-roll-type="check" bc-roll-action="${skill.name}">
                        <div class="bc-roll-popup-mod">${skill.modifier}</div>
                        <div>${skill.name}</div>
                        <div class="bc-icon-inline" adjustment="${skill.adjustment}"></div>
                        <div class="bc-icon-check"></div>
                    </li>
                    `)
                    skill_item.find(".bc-icon-inline")
                    skill_item.find(".bc-icon-check").hide();
                    $(roll_menu).find("li[bc-roll-type=check]").parent().append(skill_item);
                }
            })
        }

        let bounds = event.currentTarget.getBoundingClientRect();
        let menu_height = $(".bc-roll-popup").height();
        console.log("document.body.clientHeight:", document.body.clientHeight);
        console.log("menu_height:", menu_height);
        console.log("roll_menu:", roll_menu);
        console.log("bounds:", bounds);
        if ((bounds.top + menu_height) > document.body.clientHeight) {
            roll_menu.css("top", document.body.clientHeight - menu_height);
        } else {
            roll_menu.css("top", bounds.top);
        }
        roll_menu.css("left", bounds.right);
        $(roll_menu).find("li[bc-roll-type]").on("click", event => {
            $(roll_menu).find("li[bc-roll-type] > .bc-icon-check").hide();
            $(event.currentTarget).find(".bc-icon-check").show();
        })
        $(roll_menu).find("li[bc-roll-kind]").on("click", event => {
            $(roll_menu).find("li[bc-roll-kind] > .bc-icon-check").hide();
            $(event.currentTarget).find(".bc-icon-check").show();
        })
        let target_character = this;
        $(roll_menu).find(".bc-roll-button").on("click", event => {
            target_character.roll_click(event);
        })
    }

    roll_click(event) {
        let button = $(event.currentTarget);
        let parent = button.parent();
        console.log(parent);
        let rollAction = parent.find(".bc-pc-skill-label").text();
        let rollType = button.attr("rollType");
        let rollKind = "";
        let rollModifer = button.text();
        if (!button.hasClass("bc-pc-roll-button")) {
            let roll_kind_li = parent.find("li[bc-roll-type] > .bc-icon-check:visible").parent();
            rollAction = roll_kind_li.attr("bc-roll-action");
            rollType = roll_kind_li.attr("bc-roll-type");
            rollKind = parent.find("li[bc-roll-kind] > .bc-icon-check:visible").parent().attr("bc-roll-kind") || "";
            rollModifer = roll_kind_li.find(".bc-roll-popup-mod").text();
        }
        console.log('rollAction', rollAction);
        console.log("rollType:", rollType);
        console.log("rollKind:", rollKind);
        console.log("rollModifer:", rollModifer);
        $(".bc-roll-popup-wrapper").remove();
        $("#bc-campaign-main").css("pointer-events", "auto");
        this.roll_logger.d20({
            action: rollAction,  // Mace | con | Stealth
            rollType: rollType,  // damage | to hit | save | check
            rollKind: rollKind,  // disadvantage | advantage
            modifer: rollModifer,  // +X | -Y
            log: true,
        })
        console.log("#roll_logger:", this.roll_logger);
        console.log(
            this.roll_logger.data.action,
            this.roll_logger.data.rolls[0].rollType,
            this.roll_logger.data.rolls[0].rollKind,
            this.roll_logger.data.rolls[0].diceNotationStr,
            this.roll_logger.data.rolls[0].result.text,
            this.roll_logger.data.rolls[0].result.total
        )
    }

}


var timestamp_to_date = function (unixTimestamp) {
    let shortMonth = [
        "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    let date = new Date(unixTimestamp);
    return `${shortMonth[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/******************************************************************************
 * 
 * encounter_selected(event, encounter_id)
 * 
******************************************************************************/
function encounter_selected(event, encounter_id) {
    let encounter = Encounter.encounters[encounter_id];
    if (encounter == undefined) {
        $(".bc-icon-edit,.bc-icon-play-circle").hide();
        $("..bc-icon-edit,.bc-icon-play-circle").removeData("uuid");
        return;
    }
    $(".bc-icon-edit,.bc-icon-play-circle").show();
    $(".bc-icon-edit,.bc-icon-play-circle").data("uuid", encounter_id);
    $(".bc-encounter-summary").html(marked(encounter.mdFlavorText));
    $(".bc-encounter-description").html(marked(encounter.mdDescription));
    $(".bc-encounter-rewards").html(marked(encounter.mdRewards));
    $(".bc-encounter-details").empty();
    if (Monster.isReady()) {
        let monster_count = {};
        encounter.monsters.forEach(monster_info => {
            if (monster_count[monster_info.id] == undefined) {
                monster_count[monster_info.id] = 0;
            }
            monster_count[monster_info.id]++;
        });
        Object.entries(monster_count).forEach((monster_qty) => {
            let qty = monster_qty[1]
            let monster = monsters[monster_qty[0]];
            $(` <div class="bc_monster">
                    <div class="bc_monster_name"><a class="" href="${monster.url}" target="_blank">${monster.name}</a> x ${qty}</div>
                    <div class="bc_monster_cr" >CR${monster.challengeRatingId}</div>
                </div>`)
                .appendTo(".bc-encounter-details");
        })
    }
}

/******************************************************************************
 * 
 * get_encounters()
 * 
******************************************************************************/
function get_encounters() {
    console.log("get_encounters");
    // TODO: campaign_info.id is occasionally undefined!
    fetch(
        "https://encounter-service.dndbeyond.com/v1/encounters?skip=0&take=100&campaignIds=" + game_id, {
        method: "GET",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Authorization": "Bearer " + globals.cobalt_token
        }
    })
        .then(response => {
            console.log("get_encounters response:", response);
            return response.json();
        })
        .then(json => {
            console.log("get_encounters json:", json);
            json.data.sort((first_el, second_el) => {
                let first = (!first_el.name || first_el.name.length === 0) ? "Untitled" : first_el.name;
                let second = (!second_el.name || second_el.name.length === 0) ? "Untitled" : second_el.name;
                return first.localeCompare(second, undefined, {
                    numeric: true
                })
            });
            json.data.forEach(api_encounter => {
                let encounter = new Encounter(api_encounter);
                Encounter.encounters[encounter.id] = encounter;
                $(`<li class="bc-encounter-list" tabindex="-1">${encounter.name}</li>`)
                    .data("encounter_id", encounter.id)
                    .on("click", event => {
                        $("li.bc-encounter-list").removeClass("bc-encounter-selected");
                        $(event.currentTarget).addClass("bc-encounter-selected").trigger("focus");
                        let encounter_id = $(event.currentTarget).data("encounter_id");
                        encounter_selected(event, encounter_id);
                    })
                    .on("keydown", event => {
                        $("li.bc-encounter-selected").removeClass("bc-encounter-selected");
                        if (event.key == "ArrowDown") {
                            if ($(event.currentTarget).next().length) {
                                $(event.currentTarget).next().trigger("focus").addClass("bc-encounter-selected");
                            } else {
                                $('li.bc-encounter-list:first').trigger("focus").addClass("bc-encounter-selected");
                            }
                        } else if (event.key == "ArrowUp") {
                            if ($(event.currentTarget).prev().length) {
                                $(event.currentTarget).prev().trigger("focus").addClass("bc-encounter-selected");
                            } else {
                                $('li.bc-encounter-list:last').trigger("focus").addClass("bc-encounter-selected");
                            }
                        }
                        let encounter_id = $(".bc-encounter-list.bc-encounter-selected").data("encounter_id");
                        encounter_selected(event, encounter_id);
                    })
                    .appendTo("ul.bc-encounter-list");
            });
            $("div.bc-encounter-list").attr("loaded", true);
        });
}

/******************************************************************************
 * 
 * load_encounters_section()
 * 
******************************************************************************/
function load_encounters_section() {
    $("input.bc-heading-search")
        .on("input", (event) => {
            let search_val = $(event.currentTarget).val();
            $("li.bc-encounter-list").each((index, li) => {
                let li_obj = $(li);
                if (li_obj.text().toUpperCase().includes(search_val.toUpperCase())) {
                    li_obj.show();
                } else {
                    li_obj.hide();
                }
            })
        })
        .on("keydown", event => {
            if (event.key == "Escape") {
                $(event.currentTarget).val("");
                $(event.currentTarget).trigger("input");
            }
        });
    $(".bc-icon-plus-square").on("click", () => {
        let url = `https://www.dndbeyond.com/encounter-builder?campaignId=${game_id}`;
        window.open(url, "_blank");
    });

}

/******************************************************************************
 * 
 * load_details_section()
 * 
******************************************************************************/
function load_details_section() {
    let section = $(".bc-section[bc-section=details]");
    console.log("load_details:", section);
    section.find(".bc-icon-edit").on("click", event => {
        let uuid = $(event.currentTarget).data("uuid");
        let url = `https://www.dndbeyond.com/encounters/${uuid}/edit`
        let target = `edit_enc_${uuid}`
        window.open(url, target)
    });
    section.find(".bc-icon-play-circle").on("click", event => {
        let uuid = $(event.currentTarget).data("uuid");
        let url = `https://www.dndbeyond.com/encounters/${uuid}`
        let target = `play_enc_${uuid}`
        window.open(url, target)
    });
}

/******************************************************************************
 * 
 * load_markdown()
 * 
******************************************************************************/
function load_markdown() {
    var mde = null;
    var editor_options = {
        autofocus: true,
        element: $('textarea.bc-markdown-editor')[0],
        toolbar: [
            "bold", "italic", "heading-bigger", "heading-smaller",
            "|", "code", "quote", "unordered-list", "ordered-list", "clean-block",
            "|", "link", "image", "table", "horizontal-rule",
            "|", "side-by-side", "guide", "undo", "redo",
        ],
        indentWithTabs: false,
        // lineWrapping: false,
        // minHeight: "90%",
        // previewClass: "bc-editor-preview",
        previewRender: function (plainText) {
            return marked(plainText); // Returns HTML from a custom parser
        },
        inputStyle: "contenteditable",
    };

    $(".bc-icon-edit[data-mdtarget]").on("click", event => {
        $(`<div class="bc-markdown-layer">
                    <div class="bc-markdown-editor">
                        <textarea class="bc-markdown-editor"></textarea>
                    </div>
               </div>
            `).appendTo(campaign_wrapper);
        let section = $(event.currentTarget).parent().text();
        let encounter_id = $(event.currentTarget).data("uuid")
        let encounter = Encounter.encounters[encounter_id];
        let targetSelector = $(event.currentTarget).data("mdtarget");
        let mdProperty = $(targetSelector).data("mdproperty");
        editor_options.initialValue = encounter[mdProperty];
        mde = new EasyMDE(editor_options);
        mde.toggleFullScreen();
        mde.toggleSideBySide();
        let footer = $(`<div class="bc-editor-footer"></div>`).appendTo($(".EasyMDEContainer"));
        $(`<div class="bc-editor-field">${encounter.name} - ${section}</div>`).appendTo(footer);
        $(".editor-statusbar").appendTo(footer);
        $(`<button class="bc-editor-save" tabindex="-1">Save</button>`).on("click", event => {
            $(".editor-statusbar").appendTo(footer.parent()); // move the status bar back or mde breaks
            encounter[mdProperty] = mde.value();
            $(targetSelector).html(marked(encounter[mdProperty]));
            encounter.save();
            mde.toTextArea();
            mde = null;
            $(".bc-markdown-layer").remove();
        }).appendTo($(".editor-toolbar"));
        $(`<button class="bc-editor-cancel" tabindex="-1">Cancel</button>`).on("click", event => {
            $(".editor-statusbar").appendTo(footer.parent()); // move the status bar back or mde breaks
            mde.toTextArea();
            mde = null;
            $(".bc-markdown-layer").remove();
        }).appendTo($(".editor-toolbar"));
    });
}

/******************************************************************************
 * 
 * load_map_section()
 * 
******************************************************************************/
function load_map_section() {
    console.log("load_map:", $("#bc-map"));
    $(".bc-map-wrapper .bc-icon-home").on("click", event => {
        console.log(event);
        console.log($("#bc-map"));
        $("#bc-map").attr("src", map_url);
    });
}

/******************************************************************************
 * 
 * start_beyond_campaign()
 * 
******************************************************************************/
function start_beyond_campaign() {
    console.log("start_beyond_campaign:");
    $("body > div")
        .filter(":not(.bc-default-divs)")
        .filter(":not([style$='display: none;'])")
        .filter(":not(#bc-campaign-main)")
        .addClass("bc-default-divs");
    $(".bc-default-divs").hide();
    $(document.body).css("overflow", "hidden");
    if ($("#bc-campaign-main").show().length == 0) {
        campaign_wrapper = $(campaign_wrapper).appendTo(document.body);

        let starting_grid = [];
        let layout_json = localStorage.getItem(`bc_layout_${game_id}`);
        if (layout_json) {
            starting_grid = JSON.parse(layout_json);
            console.log(starting_grid);
        } else {
            starting_grid = [
                { "x": 7, "y": 0, "w": 6, "h": 10, "id": "encounter_list" },
                { "x": 7, "y": 10, "w": 6, "h": 5, "id": "encounter-details" },
                { "x": 7, "y": 15, "w": 6, "h": 5, "id": "gamelog" },
                { "x": 13, "y": 0, "w": 22, "h": 4, "id": "encounter-summary" },
                { "x": 13, "y": 4, "w": 22, "h": 8, "id": "encounter-description" },
                { "x": 13, "y": 12, "w": 22, "h": 4, "id": "encounter-rewards" },
                { "x": 13, "y": 16, "w": 22, "h": 4, "id": "encounter-map" },
            ];
        }
        load_grid_contents(starting_grid);

        console.log("gCharacters:", gCharacters);
        for (let i = 0; i < gCharacters.length; i++) {
            console.log("gCharacters entries:", gCharacters[i]);
        }
        gCharacters.forEach(character => {
            console.log("gCharacters entries:", character);
            let grid_id = "character_" + character.id;
            let missing = true;
            starting_grid.forEach(item => {
                if (item.id == grid_id) {
                    missing = false;
                }
            })
            if (missing) {
                starting_grid.push({
                    "x": 0, "y": 0, "w": 7, "h": 5,
                    "id": grid_id,
                    "content": `<div class="bc-character" character-id="${character.id}">${pc_template}</div>`,
                })
            }
            character.fetch_iframe(); // this should be safe to call twice, wfke will mark the elements and only run once
        })
        grid = GridStack.init({
            alwaysShowResizeHandle: true,
            margin: "5px",
            cellHeight: "38px",
            resizable: { autoHide: true, handles: 'all' },
            handle: ".bc-heading",
            column: 35,
            // staticGrid: true,
            // float: true,
        });

        console.log("starting_grid:", starting_grid);
        grid.load(starting_grid);
        grid.on("change", () => {
            let layout = grid.save(false);
            localStorage.setItem(`bc_layout_${game_id}`, JSON.stringify(layout));
            // console.log("grid change", layout);
        });

        console.log($(".grid-stack-item-content"));
        $(".bc-icon-edit,.bc-icon-play-circle").hide();
        $(".bc-heading").on("dblclick", event => {
            console.log($(event.currentTarget).parents("[gs-h]"));
            let item = $(event.currentTarget).parents("[gs-h]");
            let current_height = item.attr("gs-h");
            let saved_height = item.attr("bc-gs-h");
            if (current_height == 1 && saved_height) {
                grid.update(item[0], { h: Number(saved_height) });
                // item.attr("gs-h", saved_height);
            } else {
                item.attr("bc-gs-h", current_height);
                grid.update(item[0], { h: 1 });
                // item.attr("gs-h", 1);
            }
        });

        // update breadcrumb with campaign name
        waitForKeyElements(() => {
            return campaign_info.name !== undefined;
        }, () => {
            $("#bc-breadcrumb-campaign").text(campaign_info.name);
        });
        // load various page functions/content
        load_markdown();
        load_details_section();
        load_map_section();
        load_encounters_section();
        get_encounters();

    }
}

/******************************************************************************
 * 
 * load_grid_contents
 * 
******************************************************************************/
function load_grid_contents(layout) {
    layout.forEach(item => {
        switch (item.id) {
            case "encounter_list":
                item.content = encounter_list_html;
                break;
            case "gamelog":
                item.content = `<div class="bc-section" bc-section="gamelog">
                                    <div class="bc-heading">Gamelog</div>
                                    <div class="bc-gamelog"></div>
                                </div>`;
                break;
            case "encounter-details":
                item.content = `<div class="bc-section"  bc-section="details">
                                    <div class="bc-heading">Details
                                        <div class="bc-icon bc-icon-edit"></div>
                                        <div class="bc-icon bc-icon-play-circle"></div>
                                    </div>
                                    <div class="bc-encounter-details"></div>
                                </div>`;
                break;
            case "encounter-summary":
                item.content = `
                <div class="bc-section" bc-section="summary">
                    <div class="bc-heading">Summary<div class="bc-icon bc-icon-edit" data-mdtarget=".bc-encounter-summary"></div></div>
                    <div class="bc-section-markdown bc-encounter-summary" data-mdproperty="mdFlavorText"></div>
                 </div>`;
                break;
            case "encounter-description":
                item.content = `
                <div class="bc-section"bc-section="description">
                    <div class="bc-heading">Description<div class="bc-icon bc-icon-edit" data-mdtarget=".bc-encounter-description"></div></div>
                    <div class="bc-section-markdown bc-encounter-description" data-mdproperty="mdDescription"></div>
                </div>`
                break;
            case "encounter-rewards":
                item.content = `
                <div class="bc-section" bc-section="rewards">
                    <div class="bc-heading">Rewards<div class="bc-icon bc-icon-edit" data-mdtarget=".bc-encounter-rewards"></div></div>
                    <div class="bc-section-markdown bc-encounter-rewards" data-mdproperty="mdRewards"></div>
                </div>`;
                break;
            case "encounter-map":
                item.content = `
                <div class="bc-section bc-map-wrapper" bc-section="map">
                    <div class="bc-heading">Map<div class="bc-icon bc-icon-home"></div><div class="bc-icon bc-icon-down-circle"></div></div>
                    <div class="bc-section-markdown bc-map-wrapper">
                        <iframe id="bc-map" class="bc-map-wrapper" src="${map_url}"></iframe>
                    </div>
                </div>`;
                break;
            default:
                let character_id = item.id.slice(10);
                item.content = `<div class="bc-character" character-id="${character_id}">${pc_template}</div>`;
                break;
        }
    })
}

/******************************************************************************
 * 
 * REGISTER GAMELOG
 * 
******************************************************************************/
gamelog.listen(function (json) {
    // <div>Zach McShort|Unarmed Strike|to hit||1d20+4|5</div>
    // <div>Zach McShort|Crossbow, Light|damage||1d8|1</div>
    // <div>Zach McShort|Mace|damage||1d6+2|6</div>
    // <div>Zach McShort|con|save||1d20+5|6</div>
    // <div>Zach McShort|con|save|advantage|2d20kh1+5|19</div>
    // <div>Zach McShort|Stealth|check||1d20|9</div>
    // <div>Zach McShort|Stealth|check|disadvantage|2d20kl1|3</div>
    console.log("gamelog:", json);
    if (json.eventType == "dice/roll/fulfilled") {
        // json.dateTime
        // "dateTime": "1627510266612",
        //  ${json.data.context.name}|${json.data.action}|${json.data.rolls[0].rollType}|${json.data.rolls[0].rollKind}|${json.data.rolls[0].diceNotationStr}|${json.data.rolls[0].result.text}|${json.data.rolls[0].result.total}</div>`
        let entry = $(gamelog_template_html);
        $(".bc-gamelog").append(entry);
        entry.find(".bc-gamelog-name").text(json.data.context.name);
        if (json.data.rolls[0].rollKind == "advantage") {
            entry.find(".bc-icon-inline").attr("adjustment", "Advantage");
        }
        if (json.data.rolls[0].rollKind == "disadvantage") {
            entry.find(".bc-icon-inline").attr("adjustment", "Disadvantage");
        }
        entry.find(".bc-gamelog-roll-action").text(json.data.action);
        entry.find(".bc-gamelog-roll-type").text(json.data.rolls[0].rollType);
        entry.find(".bc-gamelog-result-total").text(json.data.rolls[0].result.total);
        entry.find(".bc-gamelog-dice-notation").text(json.data.rolls[0].diceNotationStr);
        entry.find(".bc-gamelog-detail-text").text(json.data.rolls[0].result.text);
        entry[0].scrollIntoView();
    }
});

var pc_template = `
<div class="bc-pc-main-wrapper">
    <div class="bc-pc-avatar">
        <a class="bc-pc-avatar" href="http://example.com" target="_blank">
            <img class="bc-pc-avatar">
            </img>
        </a>
    </div>
    <div class="bc-pc-main-row">
        <div class="bc-pc-name"></div>
        <div class="bc-pc-hp">
            <span class="bc-pc-hp-label">HP:</span>
            <span class="bc-pc-hp-current">-</span>
            <span class="bc-pc-hp-divider">/</span>
            <span class="bc-pc-hp-max">-</span>
            <span class="bc-pc-hp-temp">--</span>
        </div>
    </div>
    <div class="bc-pc-main-row">
        <div class="bc-pc-race"></div>
        <div class="bc-pc-main-stat-value-passive" stat="speed">-</div>
        <div class="bc-pc-main-stat-label">Speed</div>
    </div>
    <div class="bc-pc-main-row">
        <div class="bc-pc-class"></div>
        <div class="bc-pc-main-stat-value-passive" stat="ac">-</div>
        <div class="bc-pc-main-stat-label">AC</div>
    </div>
</div>
<div class="bc-pc-stat-wrapper">
    <div class="bc-pc-stat">
        <button class="bc-pc-roll-popup" rollType="check" skill="perception">&nbsp;</button>
        <button class="bc-pc-roll-button bc-pc-skill-modifier" rollType="check" skill="perception">-</button>
        <div class="bc-pc-skill-value-passive" skill="perception">-</div>
        <div class="bc-pc-skill-label">Perception</div>
    </div>
    <div class="bc-pc-stat" >
        <button class="bc-pc-roll-popup" rollType="check" skill="insight">&nbsp;</button>
        <button class="bc-pc-roll-button bc-pc-skill-modifier" rollType="check" skill="insight">-</button>
        <div class="bc-pc-skill-value-passive" skill="insight">-</div>
        <div class="bc-pc-skill-label">Insight</div>
    </div>
    <div class="bc-pc-stat">
        <button class="bc-pc-roll-popup" rollType="check" skill="investigation">&nbsp;</button>
        <button class="bc-pc-roll-button bc-pc-skill-modifier" rollType="check" skill="investigation">-</button>
        <div class="bc-pc-skill-value-passive" skill="investigation">-</div>
        <div class="bc-pc-skill-label">Investigation</div>
    </div>
    <div class="bc-pc-stat">
        <button class="bc-pc-stat-button bc-pc-stat-modifier" stat="str">-</button>
        <div class="bc-pc-stat-label">STR</div>
    </div>
    <div class="bc-pc-stat">
        <button class="bc-pc-stat-button bc-pc-stat-modifier" stat="dex">-</button>
        <div class="bc-pc-stat-label">DEX</div>
    </div>
    <div class="bc-pc-stat">
        <button class="bc-pc-stat-button bc-pc-stat-modifier" stat="con">-</button>
        <div class="bc-pc-stat-label">CON</div>
    </div>
    <div class="bc-pc-stat">
        <button class="bc-pc-stat-button bc-pc-stat-modifier" stat="int">-</button>
        <div class="bc-pc-stat-label">INT</div>
    </div>
    <div class="bc-pc-stat">
        <button class="bc-pc-stat-button bc-pc-stat-modifier" stat="wis">-</button>
        <div class="bc-pc-stat-label">WIS</div>
    </div>
    <div class="bc-pc-stat">
        <button class="bc-pc-stat-button bc-pc-stat-modifier" stat="cha">-</button>
        <div class="bc-pc-stat-label">CHA</div>
    </div>
</div>
<div class="bc-pc-language">
    <div class="bc-pc-language-label">
        Languages:
    </div>
    <div class="bc-pc-language-value"></div>
</div>
`

var campaign_wrapper = `
<div id="bc-campaign-wrapper">
    <div id="bc-campaign-main">
        <div id="bc-header">
            <section class="">
                <nav class="b-breadcrumb-a b-breadcrumb-b bc-breadcrumb">
                    <ul class="bc-breadcrumb-wrapper bc-breadcrumb-wrapper">
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="/" rel="up"><span>Home</span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="/my-campaigns" rel="up"><span>Campaigns</span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="" rel="up"><span id="bc-breadcrumb-campaign"></span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <span>Beyond Campaign</span>
                        </li>
                    </ul>
                </nav>
            </section>
        </div>
        <div class="grid-stack">
        </div>
    </div>
</div>

`

var encounter_list_html = `
<div id="bc-encounter-heading" class="bc-heading">
    <div class="bc-heading-title">Encounters</div>
    <div class="bc-icon bc-icon-plus-square"></div>
    <div class="bc-heading-search">
            <input type="search" class="bc-heading-search" placeholder="Search...">
    </div>
</div>
<div class="bc-encounter-list">
    <ul class="bc-encounter-list"></ul>
</div>
`

var roll_template_html = `
<div class="bc-roll-popup-wrapper">
<div class="bc-roll-popup">
    <div class="bc-roll-popup-heading"></div>
    <hr class="bc-divider">
    <ul class="bc-roll-popup bc-roll-type">
        <li class="bc-roll-popup" bc-roll-type="check">
            <div class="bc-roll-popup-mod">-</div>
            <div class="bc-roll-popup-type">Check</div>
            <div class="bc-icon-check"></div>
        </li>
        <li class="bc-roll-popup" bc-roll-type="save">
            <div class="bc-roll-popup-mod">-</div>
            <div class="bc-roll-popup-type">Save</div>
            <div class="bc-icon-check"></div>
        </li>
    </ul>
    <hr class="bc-divider">
    <ul class="bc-roll-popup bc-roll-kind">
        <li class="bc-roll-popup" bc-roll-kind="advantage">
            <div class="bc-icon-left-gutter bc-icon-advantage"></div>Advantage<div
                class="bc-icon-check"></div>
        </li>
        <li class="bc-roll-popup" bc-roll-kind="">
            <div class="bc-icon-left-gutter bc-icon-flat"></div>Flat<div class="bc-icon-check">
            </div>
        </li>
        <li class="bc-roll-popup" bc-roll-kind="disadvantage">
            <div class="bc-icon-left-gutter bc-icon-disadvantage"></div>Disadvantage<div class="bc-icon-check"></div>
        </li>
    </ul>
    <hr class="bc-divider">
    <button class="bc-roll-button MuiButtonBase-root MuiButton-root"
        tabindex="0" type="button">
        <span class="MuiButton-label">Roll</span>
    </button>
</div>
</div>
`

var gamelog_template_html = `
<div class="bc-gamelog-entry">
    <div class="bc-gamelog-name">Zach McShort</div>
        <div class="bc-icon-inline" adjustment="Disadvantage"></div>
        <div class="bc-gamelog-roll-action">Insight</div>:
        <div class="bc-gamelog-roll-type">check</div>
        <div class="bc-gamelog-result-total">7</div>
    </div>
    <div class="bc-gamelog-entry bc-gamelog-detail">
        <div class="bc-gamelog-dice-notation">1d20+7</div>
        <div class="bc-gamelog-detail-result">
        <div class="bc-gamelog-detail-text">5+7</div>
    </div>
</div>
`