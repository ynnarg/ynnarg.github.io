console.log("working");

// Imports

import jsCookie from "./Libs/js.cookie.min.mjs";

import { Crafting } from "./Modules/crafting.js"
import { Products } from "./Modules/products.js"
import { Tech } from "./Modules/tech.js";

// Config

var Config = {
    Version: "0.0.4"
}

// Variables

var MainVariables = {
    currentPhase: 0,
    money: 0,
    CurrentBenefits: {
        SellPriceMul: 1
    }
}

var UI = {
    topBar: {
        topBar: document.getElementById("topBar"),
        buttons: {
            topBar_mainView: document.getElementById("topBar_mainView"),
            topBar_factoryView: document.getElementById("topBar_factoryView"),
            topBar_techView: document.getElementById("topBar_techView"),
            topBar_extractorView: document.getElementById("topBar_extractorView"),
            topBar_statsView: document.getElementById("topBar_statsView")
        }
    },

    mainView: {
        mainView: document.getElementById("mainView"),
        mainButton: document.getElementById("mainButton"),
        mainProgressBar: document.getElementById("mainProgressBar"),
    }
}

// Functions

function ApplyBenefit(benefitKey, benefit) {
    switch (benefitKey) {
        case "SellPriceMul":

            break;
    }
}

// Main

console.log("still working");

$(document).ready(() => {
    $("#versionText").text(`v${Config.Version}`.toString());

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
    $(UI.mainView.mainButton).mouseenter(() => {

    });
    
    $(UI.mainView.mainButton).mousedown(() => {

    });

    $(UI.mainView.mainButton).mouseup(() => {
        
    });
})
