console.log("working");

// Imports

import jsCookie from "./Libs/js.cookie.min.mjs";

import { Crafting } from "./Modules/crafting.js";
import { Products } from "./Modules/products.js";
import { Tech } from "./Modules/tech.js";

// Config

var Config = {
    Version: "0.0.5"
};

// Variables

var MainVariables = {
    CurrentPhase: 0,
    CurrentBenefits: {
        SellPriceMul: 1
    },
    Money: 0,
    StartTime: Date.now()
};

var UI = {
    topBar: {
        topBar: document.getElementById("topBar"),
        buttons: {
            topBar_mainView: document.getElementById("topBar_mainView"),
            topBar_factoryView: document.getElementById("topBar_factoryView"),
            topBar_techView: document.getElementById("topBar_techView"),
            topBar_extractorView: document.getElementById("topBar_extractorView"),
            topBar_statsView: document.getElementById("topBar_statsView")
        },

        buttonMatches: {
            topBar_mainView: "mainView", topBar_factoryView: "factoryView",
            topBar_extractorView: "extractorView", topBar_techView: "techView",
            topBar_statsView: "statsView"
        }
    },

    views: {
        mainView: {
            view: document.getElementById("mainView"),
            mainButton: document.getElementById("mainButton"),
            mainProgressBar: document.getElementById("mainProgressBar"),
        }, factoryView: {
            view: document.getElementById("factoryView")
        }, extractorView: {
            view: document.getElementById("extractorView")
        }, techView: {
            view: document.getElementById("techView")
        }, statsView: {
            view: document.getElementById("statsView")
        }
    }
};

var FunctionVariables = {
    ApplyBenefit: {},
    PlaySound: {URLs: {}, SoundInstances: [], SoundIndex: 0},
    SwitchView: {CurrentView: "mainView"}
};

// Functions

function ApplyBenefit(benefitKey, benefit) {
    switch (benefitKey) {
        case "SellPriceMul":

            break;
    }
}


function PlaySound(url, volume) {
    var scope = FunctionVariables.PlaySound
    if (scope.URLs[url] && scope.URLs[url].readyState >= 2) {
        // Sound is loaded
        volume = volume || 1.0;

        scope.SoundIndex = (scope.SoundIndex + 1) % 12;
        let sound = scope.SoundInstances[scope.SoundIndex];
        sound.src = scope.URLs[url].src;
        scope.URLs[url].volume = Math.pow(volume, 2);
        try { scope.URLs[url].play() } catch(_) {  }
    } else {
        // Sound isn't loaded
        scope.URLs[url] = new Audio(url);
        scope.URLs[url].onloadeddata = (_) => { PlaySound(url, volume); }
    }
}


function SwitchView(viewName) {
    if (!UI.views[viewName]) { return; }
    let scope = FunctionVariables.SwitchView;
    if (scope.CurrentView == viewName) {
        return;
    } else if (scope.CurrentView) {
        let view = UI.views[scope.CurrentView].view;
        view.parentElement.removeChild(view);
    }

    scope.CurrentView = viewName;
    document.getElementById("view_wrapper").appendChild(UI.views[viewName].view);
}


function SecondsToDHMS(seconds) { // Seconds to Days, Hours, Minutes, Seconds
    seconds /= 1000;
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor(seconds / 3600) - (days * 24);
    let minutes = Math.floor(seconds / 60) - (days * 1440) - (hours * 60);
    seconds = Math.floor(seconds) - (days * 86400) - (hours * 3600) - (minutes * 60);
    return `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
}

// Main

console.log("still working");

// Main Interval
function mainInterval() {
    // Stats
    $("#statsView_timePlayed").text(`Time played: ${SecondsToDHMS(Date.now() - MainVariables.StartTime)}`.toString());
}

// Main Func
function main() {
    // Prep
    $("#versionText").text(`v${Config.Version}`.toString());

    for (let i = 0; i < 12; i++) { FunctionVariables.PlaySound.SoundInstances[i] = new Audio(); }

    for (let key in UI.views) {
        let view = UI.views[key].view;
        if (view && key != "mainView" && view.parentElement) {
            view.parentElement.removeChild(view);
        }
    }

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
            currentAnim = topBarButton.animate({
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

            SwitchView(UI.topBar.buttonMatches[topBarButtonKey]);
        })
    }

    // Main button
    {
        let mainButton = $(UI.views.mainView.mainButton);
        let currentAnim = null;
        let animInfo = {duration: 1000, specialEasing: {width: "easeOutElastic"}};
        mainButton.mouseenter(() => {
            if (currentAnim) currentAnim.stop();
            currentAnim = mainButton.animate({
                width: "90%",
            }, animInfo);
        });

        mainButton.mouseleave(() => {
            if (currentAnim) currentAnim.stop();
            currentAnim = mainButton.animate({
                width: "85%",
            }, animInfo);
        });
        
        mainButton.mousedown(() => {
            if (currentAnim) currentAnim.stop();
            if (currentAnim) currentAnim.stop();
            currentAnim = mainButton.animate({
                width: "85%",
            }, animInfo);

            PlaySound("./Audio/MainClick.wav", 0.15);
        });

        mainButton.mouseup(() => {
            if (currentAnim) currentAnim.stop();
            currentAnim = mainButton.animate({
                width: "90%",
            }, animInfo);

            PlaySound("./Audio/MainClick.wav", 0.15);
        });
    }

    setInterval(mainInterval, 1000 / 60); // Every 60 milliseconds
}

$(document).ready(main);
