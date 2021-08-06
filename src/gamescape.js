import { waitForKeyElements, register_url, register_fetch, gamelog, globals } from "./init.js";
var map_url = "https://gamescape.app/maps"

console.log("gamescape.app");
var map_id;
(function () {
    map_id = mapid_from_url(document.URL);
    console.log("encounter_id:", map_id);
}());

function mapid_from_url(url){
    let arr = url.match(/https:\/\/gamescape.app\/maps\/(.*)$/);
    if (arr && arr.length == 2) {
        return arr[1];
    }
    return null
}

/******************************************************************************
 * 
 * REGISTER URL https://www.dndbeyond.com/combat-tracker/<uuid>
 * https://gamescape.app/maps/QAdkCF_pSU2BfREKSLOMhQ
******************************************************************************/
register_url(
    "https://gamescape.app/maps/.*$",
    function load() {
        map_id = mapid_from_url(document.URL)
        console.log("register_url load:", map_id);
    },
    function unload() {
        console.log("BC: unloading campaign");
    }
);


var token_names = [];
/******************************************************************************
 * 
 * REGISTER FETCH active-short-characters
 * 
******************************************************************************/
register_fetch("https://rest.gamescape.app/maps/ops/.*$", function (json) {
    let tokens = {};
    json.data.forEach(entry => {
        if(entry.op == "token"){
            if("deleted" in entry){
                delete tokens[entry.uid];
            }else{
                tokens[entry.uid] = entry;
            }
        }
    });
    Object.values(tokens).forEach(token => {
        token_names.push(token.name);
    });
    console.log("token_names:", token_names);
});


// $("#tokenName").val("Test Name");
// $("#tokenColor").val("#000000");
// $("#createTokenForm").submit();
