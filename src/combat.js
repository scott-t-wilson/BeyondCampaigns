import { waitForKeyElements, register_url, register_fetch, merge, globals } from "./init.js";
import { Character, gCharacters, gMonsters, roll_template_html, pc_template } from "./campaign.js";
import { BCRollLogger } from "./bcRollRenderer"
import GridStack from '../node_modules/gridstack/dist/gridstack-h5';

var map_url = "https://gamescape.app/maps"

let wrapper;
var monsters = {};
var encounter_id;
var grid = null;

(function () {
    encounter_id = uuid_from_url(document.URL);
    console.log("encounter_id:", encounter_id);
}());

function uuid_from_url(url) {
    let uuid = null;
    let arr = url.match(/.*\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})/);
    if (arr && arr.length == 2) {
        uuid = arr[1];
    }
    return uuid;
}

function convert_stats(anon_stats) {
    let stat_ids = ["str", "dex", "con", "int", "wis", "cha"];
    let stats = {
        "str": { name: "str", full_name: "Strength", value: null, modifier: null, modifierString: "" },
        "dex": { name: "dex", full_name: "Dexterity", value: null, modifier: null, modifierString: "" },
        "con": { name: "con", full_name: "Constitution", value: null, modifier: null, modifierString: "" },
        "int": { name: "int", full_name: "Intelligence", value: null, modifier: null, modifierString: "" },
        "wis": { name: "wis", full_name: "Wisdom", value: null, modifier: null, modifierString: "" },
        "cha": { name: "cha", full_name: "Charisma", value: null, modifier: null, modifierString: "" },
    }
    anon_stats.forEach(s => {
        let statName = stat_ids[s.statId - 1];
        stats[statName].value = s.value;
        let mod = Math.floor((s.value - 10) / 2);
        if (mod >= 0) {
            stats[statName].modifierString = "+";
        }
        stats[statName].modifierString += parseInt(mod)
        stats[statName].modifier = mod;
    })
    return stats;
}

fetch("http://old.xoblob.shop/", {
    method: "GET",
    cache: "no-cache",
    credentials: "include",
    headers: {
        "Authorization": "Bearer " + globals.cobalt_token
    }
}).then(response => {console.log("xoblob got it", response)});


function render_monster(monster_id, selector) {
    let monster = monsters[monster_id];
    console.log(monster);
    let e = $(monster_html);
    e.find(".mon-stat-block__name-link")
        .text(monster.name)
        .attr("href", monster.url);

    // <div class="mon-stat-block__meta">Medium Humanoid, Chaotic Neutral</div>
    // "alignmentId": 6,
    // "sizeId": 4,
    // "typeId": 11,

    e.find("span.mon-stat-block__attribute-label:contains('Armor Class')")
        .parent().find(".mon-stat-block__attribute-data-value")
        .text(monster.armorClass);
    e.find("span.mon-stat-block__attribute-label:contains('Hit Points')")
        .parent().find(".mon-stat-block__attribute-data-value")
        .text(monster.averageHitPoints);
    e.find("span.mon-stat-block__attribute-label:contains('Speed')")
        .parent().find(".mon-stat-block__attribute-data-value")
        .text(`${monster.movements[0].speed} ft.`);

    let stats = convert_stats(monster.stats);
    Object.values(stats).forEach(stat => {
        e.find(`.ability-block__stat--${stat.name}`)
            .find(".ability-block__score").text(stat.value);
        e.find(`.ability-block__stat--${stat.name}`)
            .find(".integrated-dice__container").text(stat.modifierString);
        e.find(`.ability-block__stat--${stat.name}`)
            .find("[data-dicenotation]").data("dicenotation", "1d20" + stat.modifierString);
    });
    let tidbit = e.find("span.mon-stat-block__tidbit-label:contains('Skills')").next();
    tidbit.empty().append($(monster.skillsHtml));

    // "languages": [{"languageId": 12, "notes": "understands but can't speak"}, {"languageId": 18, "notes": "60 ft."}],
    tidbit = e.find("span.mon-stat-block__tidbit-label:contains('Languages')").next();
    // tidbit.empty();

    tidbit = e.find("span.mon-stat-block__tidbit-label:contains('Challenge')").next();
    // tidbit.empty();

    tidbit = e.find("span.mon-stat-block__tidbit-label:contains('Proficiency Bonus')").next();
    // tidbit.empty();

    let traits = e.find(".bc-specialTraitsDescription");
    traits.empty().append($(monster.specialTraitsDescription));

    let actions = e.find(".bc-actionsDescription");
    actions.empty().append($(monster.actionsDescription));

    // TODO: make a list/loop that handles all descriptions
    let legendary_actions = e.find(".bc-legendaryActionsDescription");
    if (!monster.legendaryActionsDescription) {
        legendary_actions.parent().remove();
    } else {
        legendary_actions.empty().append($(monster.legendaryActionsDescription));
    }

    // tooltips
    let monster_div = $(selector);
    monster_div.empty().append(e);
    monster_div.find(".tooltip-hover")
        .on("mouseenter", event => {
            let link = $(event.currentTarget);
            let tt_path = link.attr("data-tooltip-json-href");
            // seems like there must be a better way...
            let tt_url = new URL(document.URL); tt_url.hash = ""; tt_url.search = ""; tt_url.pathname = tt_path;
            $(`<div class="popover ddbeb-tooltip" data-tooltip-json-href=${tt_path}></div>`).appendTo("#ddbeb-popup-container");
            fetch(tt_url, {
                method: "GET",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Authorization": "Bearer " + globals.cobalt_token
                }
            })
                .then(response => response.json())
                .then(json => {
                    let tt = $(`.ddbeb-tooltip[data-tooltip-json-href='${tt_path}']`);
                    if (tt.length) {
                        let dom_rect = event.currentTarget.getBoundingClientRect();
                        // console.log("target rect:", dom_rect);
                        tt.append($(json.Tooltip));
                        // console.log("inserted rect:", tt[0].getBoundingClientRect());
                        let tt_rect = tt[0].getBoundingClientRect();
                        let left = dom_rect.right + 2;
                        let top = dom_rect.top - (tt_rect.height / 2);
                        tt.css("top", top).css("left", left);
                        // console.log("final rect:", tt[0].getBoundingClientRect());
                    }
                });
        })
        .on("mouseleave", event => {
            $(".ddbeb-tooltip").remove();
        });

    let dice_elements = monster_div.find("span[data-dicenotation]");
    console.log(dice_elements);
    dice_elements.each((i, el) => {
        let roll_span = $(el);
        let notation = roll_span.data("dicenotation");  // 1d6+3
        let action = roll_span.data("rollaction");      // Mace | con | Stealth
        let rollType = roll_span.data("rolltype");      // damage | to hit | save | check
        let rollKind = "";                              // disadvantage | advantage | critical hit
        // let rolldamagetype = "";                     // piercing | slashing  - Not used by gamelog
        let modifier = "+0";                             // +X | -Y  - get from dicenotation, maybe leave 0?
        let display = notation;
        let d20 = ["to hit", "save", "check"].includes(rollType);
        if (d20) {
            let arr = notation.match(/([\\+-]\d*)/);
            console.log(arr);
            if (arr && arr.length == 2) {
                display = arr[1];
            }
            // display = modifier;
        }
        let roll = $(`<div style="display: inline-block"><button class="bc-action-roll-button">${display}</button></div>`);
        roll.children().data("roll", {
            "publicRoll": false,
            "notation": notation,
            "rollType": rollType,
            "rollKind": rollKind,
            "action": action,
            "modifier": modifier,
            "entityId": monster.id,
            "entityType": "monster",
            "contextName": monster.name,
            "contextAvatarUrl": monster.avatarUrl,
            "d20": d20,
            "menuHeading": `${action} ${rollType}`,
            "actionList": []
        })
        roll_span.replaceWith(roll);
    });

    monster_div.find(".bc-action-roll-button").on("click", function (event) {
        let roll_data = $(event.currentTarget).data("roll");
        console.log("roll_data:", roll_data);
        action_roll_click(roll_data);
    });
    monster_div.find(".bc-action-roll-button").on("contextmenu", function (event) {
        let roll_data = $(event.currentTarget).data("roll");
        open_roll_menu(event, roll_data);
        event.preventDefault();
    });
}

function action_roll_click(roll_data) {
    console.log("action_roll_click");
    // $(".bc-roll-popup-wrapper").remove();
    // $("#bc-main").css("pointer-events", "auto");
    let roll_logger = new BCRollLogger(roll_data);
    roll_data["log"] = true;
    roll_logger.roll(roll_data);
}

function open_roll_menu(event, options) {
    console.log(options);
    let roll_wrapper = $(roll_menu_template_html);
    let roll_menu = $(roll_wrapper).first();
    $("#bc-wrapper").append(roll_menu);
    $("#bc-main").css("pointer-events", "none");
    $(document.body).on("click keydown", event => {
        if ((event.target == document.body) || (event.originalEvent.key == "Escape")) {
            roll_wrapper.remove();
            $("#bc-main").css("pointer-events", "auto");
        }
    })
    $(roll_menu).find(".bc-roll-menu-heading").text(options.menuHeading);
    $(roll_menu).find("li[bc-roll-kind!=''] > .bc-icon-check").hide();
    if (options.rollType != "damage") {
        $(roll_menu).find("li[bc-roll-kind=critical]").hide();
    } else {
        if (!options.d20) {
            $(roll_menu).find("li[bc-roll-kind=advantage]").hide();
            $(roll_menu).find("li[bc-roll-kind=disadvantage]").hide();
        }
    }
    // $(roll_menu).find("li[bc-roll-kind=disadvantage] > .bc-icon-check").hide();
    $(roll_menu).find("li[bc-roll-type] > .bc-icon-check").hide();


    // Use this block for multiple actions
    `<ul class="bc-roll-menu bc-roll-type">
        <li class="bc-roll-menu" bc-roll-type="check">
            <div class="bc-roll-menu-mod">-</div>
            <div class="bc-roll-menu-type">Check</div>
            <div class="bc-icon-check"></div>
        </li>
    </ul>
    <hr class="bc-roll-menu-divider">`

    let bounds = event.currentTarget.getBoundingClientRect();
    let menu_height = $(".bc-roll-menu").height();

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
    $(roll_menu).find(".bc-roll-menu-roll-button").on("click", event => {
        let original_rollKind = options.rollKind;
        options.rollKind = roll_menu.find("li[bc-roll-kind] > .bc-icon-check:visible").parent().attr("bc-roll-kind") || "";
        console.log("options:", options);
        $(".bc-roll-menu-wrapper").remove();
        action_roll_click(options);
        options.rollKind = original_rollKind;
    })
}

var gCombatant = [];
class Combatant {
    constructor(api) {
        let dup = false;
        gCombatant.forEach(c => {
            if (c.uuid == api.uniqueId) {
                // console.log("Dup id:", api.uniqueId);
                dup = true;
            }
        })
        if (dup) {
            return;
        }
        this.uuid = api.uniqueId
        this.selector = `.bc-combatant[combatant-uuid=${this.uuid}]`;
        merge(this, api);
        gCombatant.push(this);
        this.update_dom();
    }

    update_dom() {
        console.log(`update_dom ${this.id}`);
        waitForKeyElements(this.selector, t => {
            let monster = monsters[this.id];
            let stats = convert_stats(monster.stats);
            console.log("monster:", monster);
            t.find(".bc-combatant-name").text(this.name);

            t.find("img.bc-combatant-avatar").attr("src", monster.avatarUrl);
            t.find("a.bc-combatant-avatar").attr("href", monster.url);
            t.find("a.bc-combatant-avatar").attr("target", monster.url);
            // t.find(".bc-combatant-race").text();
            // t.find(".bc-combatant-level").text();
            // t.find(".bc-combatant-class").text();
            t.find(".bc-combatant-hp-current").text(this.currentHitPoints);
            t.find(".bc-combatant-hp-max").text(this.maximumHitPoints);
            t.find(".bc-combatant-hp-temp").text(this.temporaryHitPoints || "-");
            t.find(".bc-combatant-main-stat-value-passive[stat='ac']").text(monster.armorClass);
            t.find(".bc-combatant-main-stat-value[stat='initiative']").text(stats.dex.modifierString);
            t.find(".bc-combatant-main-stat-value-passive[stat='speed']").text(monster.movements[0].speed);
        });
    }
}

/******************************************************************************
 * 
 * REGISTER URL https://www.dndbeyond.com/combat-tracker/<uuid>
 *
******************************************************************************/
register_url(
    "https://www.dndbeyond.com/combat-tracker/.*(#bc)$",
    function load() {
        encounter_id = uuid_from_url(document.URL);
        console.log("register_url load:", encounter_id);
        if (document.URL.match(/.*#bc$/)) {
            start_bc_combat();
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

function sort_combat_list() {
    $(".bc-combatant-list li").sort(function (a_el, b_el) {
        let a_value = $(a_el).find(".bc-combatant-initiative,.bc-pc-initiative")[0].value;
        let b_value = $(b_el).find(".bc-combatant-initiative,.bc-pc-initiative")[0].value;
        let a = parseInt(a_value, 10);
        let b = parseInt(b_value, 10);
        if (!(isNaN(a) || isNaN(b))) {
            // both have initiative set
            console.log("both set");
            return b - a;
        } else if (!isNaN(a) && isNaN(b)) {
            console.log("a set");
            return 1;
        } else if (isNaN(a) && !isNaN(b)) {
            console.log("b set");
            return -1;
        } else {
            // We could do more here- sort by pc then npc, by dex, etc
            console.log("neither set");
            return 0;
        }
    }).appendTo("ul.bc-combatant-list");
}

function start_bc_combat() {
    console.log("start_beyond_campaign:");
    if ($("#bc-main").show().length) {
        return;
    }
    console.log("#ddbeb-popup-container", $('#ddbeb-popup-container'));
    $("body > div")
        .filter(":not(.bc-default-divs)")
        .filter(":not([style$='display: none;'])")
        .filter(":not(#bc-main)")
        .filter(":not(#ddbeb-popup-container)")
        .addClass("bc-default-divs");
    $("body > footer")
        .addClass("bc-default-divs");
    $(".bc-default-divs").hide();
    // $(document.body).css("overflow", "hidden");
    if ($("#bc-main").show().length == 0) {
        wrapper = $(combat_wrapper).appendTo(document.body);
        console.log("wrapper:", wrapper);


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
        let starting_grid = [];
        console.log("starting_grid:", starting_grid);
        let layout_json = localStorage.getItem(`bc_layout_combat_${encounter_id}`);
        if (layout_json) {
            starting_grid = JSON.parse(layout_json);
            console.log(starting_grid);
        } else {
            starting_grid = [
                { "x": 0, "y": 0, "w": 12, "h": 12, "id": "active" },
                { "x": 0, "y": 13, "w": 12, "h": 12, "id": "selected" },
                { "x": 12, "y": 0, "w": 7, "h": 17, "id": "combatants" },
                { "x": 12, "y": 17, "w": 7, "h": 7, "id": "gamelog" },
                { "x": 19, "y": 0, "w": 16, "h": 7, "id": "encounter-description" },
                { "x": 19, "y": 7, "w": 16, "h": 17, "id": "encounter-map" },
            ];
        }
        load_grid_contents(starting_grid);
        console.log("starting_grid:", starting_grid);
        grid.load(starting_grid);

        grid.on("change", () => {
            let layout = grid.save(false);
            localStorage.setItem(`bc_layout_combat_${encounter_id}`, JSON.stringify(layout));
            console.log("grid change", layout);
        });
        // Character clicks
        waitForKeyElements(() => {
            return gCharacters.length > 0;
        }, () => {
            gCharacters.forEach(character => {
                console.log("gCharacters entries:", character);
                let c = $(`<li><div class="bc-character" character-id="${character.id}">${pc_template_combat}</div></li>`)
                c.appendTo("ul.bc-combatant-list");
                c.find(".bc-pc-initiative").data("roll", {
                    "publicRoll": false,
                    "rollType": "roll",
                    "action": "Initiative",
                    "modifier": character.api_character.core.initiative,
                    "entityId": character.id,
                    "entityType": "character",
                    "contextName": character.name,
                    "contextAvatarUrl": character.avatarUrl,
                    "d20": true,
                })
                c.find(".bc-pc-main-row").on("click", event => {
                    let combatant_div = $(".bc-section[bc-section=combat-selected] > .bc-combatant-detail");
                    combatant_div.empty().append(
                        $(`<div class="bc-character" character-id="${character.id}">${pc_template}</div>`)
                    );
                    character.update_dom();
                });
            });
        });
        // Monster clicks
        waitForKeyElements(() => {
            return gCombatant.length > 0;
        }, () => {
            console.log("gCombatant entries:", gCombatant);
            gCombatant.forEach(combatant => {
                console.log("gCombatant entries:", combatant);
                let c = $(`<li><div class="bc-combatant" combatant-uuid="${combatant.uuid}">${monster_template}</div></li>`);
                c.appendTo("ul.bc-combatant-list");
                let m = monsters[combatant.id];
                let stats = convert_stats(m.stats);
                c.find(".bc-combatant-initiative").data("roll", {
                    "publicRoll": false,
                    "rollType": "roll",
                    "action": "Initiative",
                    "modifier": stats.dex.modifierString,
                    "entityId": combatant.id,
                    "entityType": "monster",
                    "contextName": combatant.name,
                    "contextAvatarUrl": m.avatarUrl,
                    "d20": true,
                })
                c.find(".bc-combatant-main-row").on("click", event => {
                    render_monster(combatant.id, ".bc-section[bc-section=combat-selected] > .bc-combatant-detail");
                });

            });
        });
        waitForKeyElements("[bc-section=combatants]", (div) => {
            // Sort combat list
            $("ul.bc-combatant-list").find(".bc-combatant-initiative,.bc-pc-initiative").on("change", event => {
                sort_combat_list()
            });
            div.find(".bc-icon-play-circle").hide();
            div.find(".bc-combatant-initiative,.bc-pc-initiative").on("change", event => {
                div.find(".bc-combatant-initiative,.bc-pc-initiative").each(function (key, el) {
                    if (isNaN(parseInt(el.value, 10))) {
                        div.find(".bc-icon-play-circle").hide();
                        return;
                    }
                    div.find(".bc-icon-play-circle").show();
                });
            })
            // Roll initiative click 
            div.find(".bc-icon-dice").on("click", event => {
                console.log("roll");
                div.find(".bc-combatant-initiative,.bc-pc-initiative").each(function (key, el) {
                    console.log("roll data:", $(el).data("roll"));
                    if (isNaN(parseInt(el.value, 10))) {
                        let roll_data = $(el).data("roll");
                        let roll_logger = new BCRollLogger(roll_data);
                        roll_data["log"] = false;
                        let result = roll_logger.roll(roll_data);
                        el.value = result;
                    }
                });
                sort_combat_list()
                div.find(".bc-icon-play-circle").show();
            });
            div.find(".bc-icon-play-circle").on("click", event => {
                console.log("start");
                let active = $(".bc-pc-main-wrapper[current-turn],.bc-combatant-main-wrapper[current-turn]");
                active.attr("current-turn", null)
                let next_parent = active.parents("li").next();
                console.log("active:", active);
                console.log("next_parent:", next_parent);
                if(next_parent.length == 0){
                    next_parent =  $(".bc-combatant-list li");
                }
                console.log("next_parent:", next_parent);

                let next_active = next_parent.find(".bc-pc-main-wrapper,.bc-combatant-main-wrapper");
                console.log("next_active:", next_active);
                next_active.attr("current-turn", true);
            });
        });
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
            case "active":
                item.content = `
                    <div class="bc-section" bc-section="combat-active">
                        <div class="bc-heading">Active</div>
                        <div class="bc-combatant-detail"></div>
                    </div>`;
                break;
            case "selected":
                item.content = `
                    <div class="bc-section" bc-section="combat-selected">
                        <div class="bc-heading">Selected</div>
                        <div class="bc-combatant-detail"></div>
                    </div>`;
                break;
            case "combatants":
                // item.content = `<div class="bc-section" bc-section="combatants">
                //                     <div class="bc-heading">Combatants<div class="bc-icon bc-icon-play-circle"></div><div class="bc-icon bc-icon-dice"></div></div>
                //                     <div class="bc-combatant-list">
                //                         <div class="bc-pc-list">
                //                             <ul class="bc-pc-list"></ul>
                //                         </div>
                //                         <hr class="bc-divider">
                //                         <div class="bc-combatant-list">
                //                             <ul class="bc-combatant-list">
                //                             </ul>
                //                         </div>
                //                     </div>
                //                 </div>`
                item.content = `<div class="bc-section" bc-section="combatants">
                                <div class="bc-heading">Combatants<div class="bc-icon bc-icon-play-circle"></div><div class="bc-icon bc-icon-dice"></div></div>
                                <div class="bc-combatant-list">
                                    <ul class="bc-combatant-list">
                                    </ul>
                                </div>
                            </div>`
                break;
            case "gamelog":
                item.content = `<div class="bc-section" bc-section="gamelog">
                                        <div class="bc-heading">Gamelog</div>
                                        <div class="bc-gamelog"></div>
                                    </div>`;
                break;
            case "encounter-description":
                item.content = `
                    <div class="bc-section"bc-section="description">
                        <div class="bc-heading">Description<div class="bc-icon bc-icon-edit" data-mdtarget=".bc-encounter-description"></div></div>
                        <div class="bc-section-markdown bc-encounter-description" data-mdproperty="mdDescription"></div>
                    </div>`
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
                item.content = `<div class="bc-character" character-id="${character_id}">${pc_template_combat}</div>`;
                break;
        }
    })
}

/******************************************************************************
 * 
 * REGISTER FETCH active-short-characters
 * 
******************************************************************************/
register_fetch(`https://encounter-service.dndbeyond.com/v1/encounters/${encounter_id}`, function (json) {
    let encounter = json.data;
    console.log("register_fetch:", encounter);
    waitForKeyElements("#bc-breadcrumb-encounter", () => {
        $("#bc-breadcrumb-encounter").text(encounter.name);
    });
    encounter.monsters.forEach(combatant => {
        new Combatant(combatant);
    })
});

/******************************************************************************
 * 
 * REGISTER FETCH Monster
 *
******************************************************************************/
register_fetch("https://monster-service.dndbeyond.com/v1/Monster", function (json) {
    let api_monsters = json.data;
    api_monsters.forEach(m => {
        console.log("monster:", m);
        monsters[m.id] = m;
    })
});

var combat_wrapper = `
<div id="bc-wrapper">
    <div id="bc-main">
        <div id="bc-header">
            <section class="">
                <nav class="b-breadcrumb-a b-breadcrumb-b bc-breadcrumb">
                    <ul class="bc-breadcrumb-wrapper bc-breadcrumb-wrapper">
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="/" rel="up"><span>Home</span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="/my-encounters" rel="up"><span>My Encounters</span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="" rel="up"><span id="bc-breadcrumb-encounter"></span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="" rel="up"><span>Combat Tracker</span></a>
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

var pc_template_combat = `
<div class="bc-pc-main-wrapper">
    <div class="bc-pc-turn"></div>
    <div class="bc-pc-initiative-label">initiative</div>
    <input type="text" class="bc-pc-initiative" placeholder="-">
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
        <div class="bc-pc-main-stat-value" stat="initiative">-</div>
        <div class="bc-pc-main-stat-label">Init</div>
    </div>
    <div class="bc-pc-main-row">
        <div class="bc-pc-class"></div>
        <div class="bc-pc-main-stat-value-passive" stat="ac">-</div>
        <div class="bc-pc-main-stat-label">AC</div>
    </div>
</div>
`

var monster_template = `
<div class="bc-combatant-main-wrapper">
    <div class="bc-combatant-turn"></div>
    <div class="bc-combatant-initiative-label">initiative</div>
    <input type="text" class="bc-combatant-initiative" placeholder="-">
    <div class="bc-combatant-avatar">
        <a class="bc-combatant-avatar" href="http://example.com" target="_blank">
            <img class="bc-combatant-avatar">
            </img>
        </a>
    </div>
    <div class="bc-combatant-main-row">
        <div class="bc-combatant-name"></div>
        <div class="bc-combatant-hp">
            <span class="bc-combatant-hp-label">HP:</span>
            <span class="bc-combatant-hp-current">-</span>
            <span class="bc-combatant-hp-divider">/</span>
            <span class="bc-combatant-hp-max">-</span>
            <span class="bc-combatant-hp-temp">--</span>
        </div>
    </div>
    <div class="bc-combatant-main-row">
        <div class="bc-combatant-race"></div>
        <div class="bc-combatant-main-stat-value-passive" stat="speed">-</div>
        <div class="bc-combatant-main-stat-label">Speed</div>
        <div class="bc-combatant-main-stat-value" stat="initiative">-</div>
        <div class="bc-combatant-main-stat-label">Init</div>
    </div>
    <div class="bc-combatant-main-row">
        <div class="bc-combatant-class"></div>
        <div class="bc-combatant-main-stat-value-passive" stat="ac">-</div>
        <div class="bc-combatant-main-stat-label">AC</div>
    </div>
</div>
`


var monster_html = `

<div class="mon-stat-block">
    <div class="mon-stat-block__header">
        <div class="mon-stat-block__name"><a class="mon-stat-block__name-link"
                href="" target="_blank"></a></div>
        <div class="mon-stat-block__meta"></div>
        <div class="mon-stat-block__separator"><img class="mon-stat-block__separator-img" alt=""
                src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg"></div>
    </div>
    <div class="mon-stat-block__attributes">
        <div class="mon-stat-block__attribute"><span class="mon-stat-block__attribute-label">Armor Class</span> <span
                class="mon-stat-block__attribute-value"><span class="mon-stat-block__attribute-data-value">-</span>
            </span></div>
        <div class="mon-stat-block__attribute"><span class="mon-stat-block__attribute-label">Hit Points</span> <span
                class="mon-stat-block__attribute-data"><span class="mon-stat-block__attribute-data-value">-</span>
            </span></div>
        <div class="mon-stat-block__attribute"><span class="mon-stat-block__attribute-label">Speed</span> <span
                class="mon-stat-block__attribute-data"><span class="mon-stat-block__attribute-data-value">-</span>
            </span></div>
    </div>
    <div class="mon-stat-block__stat-block">
        <div class="mon-stat-block__separator"><img class="mon-stat-block__separator-img" alt=""
                src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg"></div>
        <div class="ability-block">
            <div class="ability-block__stat ability-block__stat--str">
                <div class="ability-block__heading">STR</div>
                <div class="ability-block__data"><span class="ability-block__score">-</span> <span
                        class="ability-block__modifier" 
                        data-dicenotation=""
                        data-rolltype="check"
                        data-rollaction="str"></span></div>
            </div>
            <div class="ability-block__stat ability-block__stat--dex">
                <div class="ability-block__heading">DEX</div>
                <div class="ability-block__data"><span class="ability-block__score">-</span> <span
                        class="ability-block__modifier" 
                        data-dicenotation=""
                        data-rolltype="check"
                        data-rollaction="dex"></span></div>
            </div>
            <div class="ability-block__stat ability-block__stat--con">
                <div class="ability-block__heading">CON</div>
                <div class="ability-block__data"><span class="ability-block__score">-</span> <span
                        class="ability-block__modifier" 
                        data-dicenotation=""
                        data-rolltype="check"
                        data-rollaction="con"></span></div>
            </div>
            <div class="ability-block__stat ability-block__stat--int">
                <div class="ability-block__heading">INT</div>
                <div class="ability-block__data"><span class="ability-block__score">-</span> <span
                        class="ability-block__modifier" 
                        data-dicenotation=""
                        data-rolltype="check"
                        data-rollaction="int"></span></div>
            </div>
            <div class="ability-block__stat ability-block__stat--wis">
                <div class="ability-block__heading">WIS</div>
                <div class="ability-block__data"><span class="ability-block__score">-</span> <span
                        class="ability-block__modifier" 
                        data-dicenotation=""
                        data-rolltype="check"
                        data-rollaction="wis"></span></div>
            </div>
            <div class="ability-block__stat ability-block__stat--cha">
                <div class="ability-block__heading">CHA</div>
                <div class="ability-block__data"><span class="ability-block__score">-</span> <span
                        class="ability-block__modifier" 
                        data-dicenotation=""
                        data-rolltype="check"
                        data-rollaction="cha"></span></div>
            </div>
        </div>
        <div class="mon-stat-block__separator"><img class="mon-stat-block__separator-img" alt=""
                src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg"></div>
    </div>
    <div class="mon-stat-block__tidbits">
        <div class="mon-stat-block__tidbit">
            <span class="mon-stat-block__tidbit-label">Skills</span>
            <span class="mon-stat-block__tidbit-data">Skills placeholder</span>
        </div>


        <div class="mon-stat-block__tidbit">
            <span class="mon-stat-block__tidbit-label">Languages</span>
            <span class="mon-stat-block__tidbit-data">Languages placeholder</span>
        </div>

        <div class="mon-stat-block__tidbit-container">
            <div class="mon-stat-block__tidbit">
                <span class="mon-stat-block__tidbit-label">Challenge</span>
                <span class="mon-stat-block__tidbit-data">Challenge placeholder</span>
            </div>
            <div class="mon-stat-block__tidbit-spacer"></div>
            <div class="mon-stat-block__tidbit">
                <span class="mon-stat-block__tidbit-label">Proficiency Bonus</span>
                <span class="mon-stat-block__tidbit-data">Proficiency Bonus placeholder</span>
            </div>
        </div>
    </div>

    <div class="mon-stat-block__separator"><img class="mon-stat-block__separator-img" alt=""
            src="https://media-waterdeep.cursecdn.com/file-attachments/0/579/stat-block-header-bar.svg">
    </div>
    <div class="mon-stat-block__description-blocks">
        <div class="mon-stat-block__description-block">
            <div class="mon-stat-block__description-block-content bc-specialTraitsDescription">
                specialTraitsDescription placeholder
            </div>
        </div>
        <div class="mon-stat-block__description-block">
            <div class="mon-stat-block__description-block-heading">Actions</div>
            <div class="mon-stat-block__description-block-content bc-actionsDescription">
                actionsDescription placeholder
            </div>
        </div>
        <div class="mon-stat-block__description-block">
            <div class="mon-stat-block__description-block-heading">Legendary Actions</div>
            <div class="mon-stat-block__description-block-content bc-legendaryActionsDescription">
                legendaryActionsDescription placeholder
            </div>
        </div>
    </div>
</div>
`

var roll_menu_template_html = `
<div class="bc-roll-menu-wrapper">
<div class="bc-roll-menu">
    <div class="bc-roll-menu-heading"></div>
    <hr class="bc-roll-menu-divider">
    <ul class="bc-roll-menu bc-roll-kind">
        <li class="bc-roll-menu" bc-roll-kind="critical">
            <div class="bc-icon-left-gutter bc-icon-critical"></div>Crit Damage<div
                class="bc-icon-check"></div>
        </li>
        <li class="bc-roll-menu" bc-roll-kind="advantage">
            <div class="bc-icon-left-gutter bc-icon-advantage"></div>Advantage<div
                class="bc-icon-check"></div>
        </li>
        <li class="bc-roll-menu" bc-roll-kind="">
            <div class="bc-icon-left-gutter bc-icon-flat"></div>Flat<div class="bc-icon-check">
            </div>
        </li>
        <li class="bc-roll-menu" bc-roll-kind="disadvantage">
            <div class="bc-icon-left-gutter bc-icon-disadvantage"></div>Disadvantage<div class="bc-icon-check"></div>
        </li>
    </ul>
    <hr class="bc-roll-divider">
    <button class="bc-roll-menu-roll-button MuiButtonBase-root MuiButton-root"
        tabindex="0" type="button">
        <span class="MuiButton-label">Roll</span>
    </button>
</div>
</div>
`



var character_full_template = `
<div class="bc-pc-main-wrapper">
    <div class="bc-pc-avatar">
        <a class="bc-pc-avatar" href="http://example.com" target="_blank">
            <img class="bc-pc-avatar">
            </img>
        </a>
    </div>
    <div>
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