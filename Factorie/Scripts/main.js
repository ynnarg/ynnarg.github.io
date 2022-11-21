console.log("working");

// Imports

import jsCookie from "./js.cookie.min.mjs";

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
    // Top bar buttons
    for (let topBarButtonKey in UI.topBar.buttons) {
        let topBarButton = $(UI.topBar.buttons[topBarButtonKey]);
        let currentAnim = null;
        topBarButton.mouseenter(() => {
            if (currentAnim) currentAnim.stop();
            currentAnim = topBarButton.animate({
                backgroundColor: "#DDD",
                boxShadowColor: "#222",
                color: "#000"
            }, 300);
        });
        
        topBarButton.mouseleave(() => {
            if (currentAnim) currentAnim.stop();
            topBarButton.animate({
                backgroundColor: "#222",
                boxShadowColor: "#555",
                color: "#FFF"
            }, 300);
        });

        topBarButton.mousedown(() => {
            if (currentAnim) currentAnim.stop();
            topBarButton.css({
                backgroundColor: "#FFF",
                boxShadowColor: "#111",
                color: "#000"
            });
        })

        topBarButton.mouseup(() => {
            if (currentAnim) currentAnim.stop();
            topBarButton.css({
                backgroundColor: "#DDD",
                boxShadowColor: "#222",
                color: "#000"
            });
        })
    }

    // Main button
})
