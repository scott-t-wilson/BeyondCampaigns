import { waitForKeyElements, register_url, register_fetch, gamelog, globals } from "./init.js";
var map_url = "https://gamescape.app/maps"

let wrapper;

var encounter_id;
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
        });    },
    function unload() {
        console.log("BC: unloading campaign");
    }
);

/******************************************************************************
 * 
 * REGISTER URL https://www.dndbeyond.com/encounters/<uuid>
 *
******************************************************************************/
// register_url(
//     "https://www.dndbeyond.com/encounters/.*$",
//     function load() {
//         encounter_id = uuid_from_url(document.URL);
//         console.log("register_url load:", encounter_id);
//         start_bc_combat();
//     },
//     function unload() {
//         console.log("BC: unloading campaign");
//     }
// );


function start_bc_combat() {
    console.log("start_beyond_campaign:");
    $("body > div")
        .filter(":not(.bc-default-divs)")
        .filter(":not([style$='display: none;'])")
        .filter(":not(#bc-main)")
        .addClass("bc-default-divs");
    $(".bc-default-divs").hide();
    $(document.body).css("overflow", "hidden");
    if ($("#bc-main").show().length == 0) {
        wrapper = $(combat_wrapper).appendTo(document.body);
    }
}

var clean_combat_tracker = function () {
    console.log("Character Info: combat tracker loaded");
    // waitForKeyElements(".out-of-combat", label_characters);
    // waitForKeyElements(".in-combat", label_characters, true, false, 500, -1);
    waitForKeyElements(".header-wrapper", function (obj) { obj.hide(); });
    waitForKeyElements(".release-indicator", function (obj) { obj.hide(); });
    waitForKeyElements("footer", function (obj) { obj.hide(); });
    waitForKeyElements(".ddb-page-header", function (obj) {
        obj.css("padding", "0");
    });
    waitForKeyElements(".ddb-page-header__title", function (obj) {
        obj.css("margin-bottom", "0");
    });
    waitForKeyElements(".ddb-page-header__breadcrumbs", function (obj) {
        obj.css("margin-bottom", "0");
    });
    waitForKeyElements(".combat-tracker__combatants", function (obj) {
        obj.addClass("gm_combat-tracker__combatants");
        obj.css("width", "500px");
    });
    waitForKeyElements(".combat-tracker-page__combat-tracker", function (obj) {
        obj.css("max-height", "calc(100vh - 130px)");
        obj.css("width", "600px");
    });
    waitForKeyElements(".combat-tracker-page", function (obj) {
        obj.css("max-width", "100%");
    });
    waitForKeyElements(".combat-tracker-page__content", function (obj) {
        obj.css("max-height", "calc(100vh - 130px)");
        obj.css("width", "100%");
        obj.css("posistion", "sticky");
        obj.css("display", "flex");
        obj.css("flex-direction", "column");
        obj.css("overflow-y", "scroll");
        console.log("adding change");
        obj.on("change", function () {
            console.log("change");
        });
    });
    waitForKeyElements(".container", function (obj) {
        obj.css("margin", "0 25px 0 25px");
        obj.css("max-width", "initial");
    });
    waitForKeyElements(".ddb-page-header__controls", function (obj) {
        obj.prepend($("<div class='ddbeb-button'>Map</div>").on("click", toggle_map));
    });
}

 /******************************************************************************
 * 
 * REGISTER FETCH active-short-characters
 * 
******************************************************************************/
register_fetch("https://encounter-service.dndbeyond.com/v1/encounters/.*", function (json) {
    console.log(json);
    json.data.forEach(character => {
        // characters[character.id] = character;
    })
    // waitForKeyElements(".bc-character", load_characters);
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
                            <a href="/my-campaigns" rel="up"><span>My Encounters</span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="" rel="up"><span id="bc-breadcrumb-campaign"></span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <a href="" rel="up"><span id="bc-breadcrumb-campaign">Combat Tracker</span></a>
                        </li>
                        <li class="b-breadcrumb-item bc-breadcrumb-item">
                            <span>Beyond Campaign</span>
                        </li>
                    </ul>
                </nav>
            </section>
        </div>
        <div class="">
            <div class="bc-encounter-list">
                <ul class="bc-encounter-list">
                <li>foo</li>
                <li>bar</li>
                <li>baz</li>
                </ul>
            </div>
        </div>
    </div>
</div>
`