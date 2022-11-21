console.log("working");

// Imports

import { Crafting } from "./Modules/crafting.js"
import { Products } from "./Modules/products.js"
import { Tech } from "./Modules/tech.js";

// Variables

var UI = {
    topBar: {
        topBar: document.getElementById("topBar"),
        buttons: {
            topBar_mainView: document.getElementById("topBar_mainView"),
            topBar_factoryView: document.getElementById("topBar_factoryView"),
            topBar_techView: document.getElementById("topBar_techView")
        }
    }
}

// Main

console.log("still working");

$(document).ready(() => {
    for (let topBarButtonKey in UI.topBar.buttons) {
        let topBarButton = $(UI.topBar.buttons[topBarButtonKey]);
        let currentAnim = null;
        topBarButton.mouseenter(() => {
            console.log("entered");

            if (currentAnim) currentAnim.stop();
            currentAnim = topBarButton.animate({
                backgroundColor: "#DDD",
                boxShadowColor: "#222",
                color: "#000"
            }, 300);
        });
        
        topBarButton.mouseleave(() => {
            console.log("left");

            if (currentAnim) currentAnim.stop();
            topBarButton.animate({
                backgroundColor: "#222",
                boxShadowColor: "#555",
                color: "#FFF"
            }, 300);
        });
    }
})
