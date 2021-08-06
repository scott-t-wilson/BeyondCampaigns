import { waitForKeyElements, register_url, register_fetch, gamelog, globals } from "./init.js";
var map_url = "https://gamescape.app/maps"


var encounter_id;
(function () {
    encounter_id = uuid_from_url(document.URL);
    console.log("encounter_id:", encounter_id);
}());

function uuid_from_url(url){
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
    "https://www.dndbeyond.com/combat-tracker/.*$",
    function load() {
        encounter_id = uuid_from_url(document.URL);
        console.log("register_url load:", encounter_id);
        clean_combat_tracker();
    },
    function unload() {
        console.log("BC: unloading campaign");
    }
);

var clean_combat_tracker = function(){
    console.log("Character Info: combat tracker loaded");
    // waitForKeyElements(".out-of-combat", label_characters);
    // waitForKeyElements(".in-combat", label_characters, true, false, 500, -1);
    waitForKeyElements(".header-wrapper", function(obj){obj.hide();});
    waitForKeyElements(".release-indicator", function(obj){obj.hide();});
    waitForKeyElements("footer", function(obj){obj.hide();});
    waitForKeyElements(".ddb-page-header", function(obj){
      obj.css("padding", "0");
    });
    waitForKeyElements(".ddb-page-header__title", function(obj){
      obj.css("margin-bottom", "0");
    });
    waitForKeyElements(".ddb-page-header__breadcrumbs", function(obj){
      obj.css("margin-bottom", "0");
    });
    waitForKeyElements(".combat-tracker__combatants", function(obj){
      obj.addClass("gm_combat-tracker__combatants");
      obj.css("width", "500px");
    });
    waitForKeyElements(".combat-tracker-page__combat-tracker", function(obj){
        obj.css("max-height", "calc(100vh - 130px)");
        obj.css("width", "600px");
    });
        waitForKeyElements(".combat-tracker-page", function(obj){
        obj.css("max-width", "100%");
    });
    waitForKeyElements(".combat-tracker-page__content", function(obj){
        obj.css("max-height", "calc(100vh - 130px)");
        obj.css("width", "100%");
        obj.css("posistion", "sticky");
        obj.css("display", "flex");
        obj.css("flex-direction", "column");
        obj.css("overflow-y", "scroll");
        console.log("adding change");
        obj.on("change", function(){
        console.log("change");
      });
    });
    waitForKeyElements(".container", function(obj){
        obj.css("margin", "0 25px 0 25px");
        obj.css("max-width", "initial");
    });
    waitForKeyElements(".ddb-page-header__controls", function(obj){
        obj.prepend($("<div class='ddbeb-button'>Map</div>").on("click", toggle_map));
    });
}


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