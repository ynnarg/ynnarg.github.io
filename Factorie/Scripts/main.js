console.log("working");

// Imports

import jsCookie from "./Libs/js.cookie.min.mjs";

import { Crafting } from "./Modules/crafting.js";
import { Products } from "./Modules/products.js";
import { Tech } from "./Modules/tech.js";

// Config

var Config = {
    Version: "0.0.6"
};

// Variables

var MainVariables = {
    Clicks: 0,
    CurrentPhase: 0,
    CurrentBenefits: {
        SellPriceMul: 1
    },
    Money: 0,
    MoneyAllTime: 0,
    MoneyIncrement: 0.1,
    StartTime: Date.now()
};

var UI = {
    topBar: {
        topBar: document.getElementById("topBar"),
        buttons: {
            topBar_mainView: document.getElementById("topBar_mainView"),
            topBar_marketView: document.getElementById("topBar_marketView"),
            topBar_extractorView: document.getElementById("topBar_extractorView"),
            topBar_factoryView: document.getElementById("topBar_factoryView"),
            topBar_techView: document.getElementById("topBar_techView"),
            topBar_statsView: document.getElementById("topBar_statsView"),
            topBar_settingsView: document.getElementById("topBar_settingsView")
        },

        buttonMatches: {
            topBar_mainView: "mainView", topBar_marketView: "marketView", topBar_factoryView: "factoryView",
            topBar_extractorView: "extractorView", topBar_techView: "techView",
            topBar_statsView: "statsView", topBar_settingsView: "settingsView"
        }
    },

    views: {
        mainView: {
            view: document.getElementById("mainView"),
            mainButton: document.getElementById("mainButton"),
            mainProgressBar: document.getElementById("mainProgressBar"),
        }, marketView: {
            view: document.getElementById("marketView")
        }, extractorView: {
            view: document.getElementById("extractorView")
        }, factoryView: {
            view: document.getElementById("factoryView")
        }, techView: {
            view: document.getElementById("techView")
        }, statsView: {
            view: document.getElementById("statsView")
        }, settingsView: {
            view: document.getElementById("settingsView")
        }
    }
};

var FunctionVariables = {
    ApplyBenefit: {},
    PlayMusic: {SoundInstances: {}, Animations: [], CurrentlyPlaying: null, PreviouslyPlaying: null},
    PlaySound: {URLs: {}, SoundInstances: [], SoundIndex: 0},
    ShowClickText: {TextInstances: [], TextIndex: 0, AnimationInstances: []},
    SwitchView: {CurrentView: "mainView"}
};

// Functions

function ApplyBenefit(benefitKey, benefit) {
    switch (benefitKey) {
        case "SellPriceMul":

            break;
    }
}


function PlayMusic(musicUrl, volume) {
    let scope = FunctionVariables.PlayMusic;
    for (let key in scope.SoundInstances) {
        let sound = scope.SoundInstances[key];
        if (key != musicUrl && scope.Animations[key] && scope.Animations[key].volume > 0) {
            scope.Animations[key].animation.stop();
            let animation = $(sound).animate({volume: 0}, {duration: 5000, easing: "linear"});
            scope.Animations[key] = {volume: 0, animation: animation};
        }
    }
    scope.CurrentlyPlaying = musicUrl;
    if (scope.SoundInstances[musicUrl].paused) { scope.SoundInstances[musicUrl].play(); }
    let animation = $(scope.SoundInstances[musicUrl]).animate({volume: Math.pow(volume, 2)}, {duration: 5000, easing: "linear"})
    scope.Animations[musicUrl] = {volume: Math.pow(volume, 2), animation: animation};
}


function PlaySound(url, volume) {
    let scope = FunctionVariables.PlaySound
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


function ShowClickText(x, y) {
    let scope = FunctionVariables.ShowClickText;
    scope.TextIndex = (scope.TextIndex + 1) % 20;
    let textIndex = scope.TextIndex;
    if (scope.AnimationInstances[textIndex]) { scope.AnimationInstances[textIndex].stop(); }
    let div = scope.TextInstances[textIndex];
    $(div).text(`$${MainVariables.MoneyIncrement}`);
    $(div).css({top: y, left: x, transform: "Translate(-50%, -100%)", color: "#FFF"});
    document.getElementById("wrapper").appendChild(div);
    scope.AnimationInstances[textIndex] = $(div).animate({
        top: y - 50,
        color: "rgba(255, 255, 255, 0)"
    }, {
        duration: 1500,
        specialEasing: {top: "linear"},
        complete: () => { div.parentElement.removeChild(div); }
    });
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
function MainInterval() {
    MainVariables.Money = Math.round(MainVariables.Money * 100) / 100;
    MainVariables.MoneyAllTime = Math.round(MainVariables.MoneyAllTime * 100) / 100;
    MainVariables.MoneyIncrement = Math.round(MainVariables.MoneyIncrement * 100) / 100;

    $("#statsView_timePlayed").text(`Time played: ${SecondsToDHMS(Date.now() - MainVariables.StartTime)}`);
    $("#statsView_moneyInBank").text(`Money in bank: $${MainVariables.Money}`);
    $("#statsView_moneyMadeAllTime").text(`Money made (all time): $${MainVariables.MoneyAllTime}`);
    $("#statsView_clicksMade").text(`Clicks made: ${MainVariables.Clicks}`);

    $("title").text(`Factorie | $${MainVariables.Money}`);
    $("#topBar_money").text(`$${MainVariables.Money}`);

    let shouldBePhase = 0;
    for (let i = 3; i >= 1; i--) {
        if (MainVariables.MoneyAllTime >= Math.pow(10, i*3)) { shouldBePhase = i; break; }
    }
    if (MainVariables.CurrentPhase != shouldBePhase) {
        console.log("Next phase");
        MainVariables.CurrentPhase = shouldBePhase;
        PlayMusic(`Phase${shouldBePhase}`, 0.5);
    }
}

// Main Interact (calls when user performs first interaction, good for playing music)
function MainInteract() {
    PlayMusic(`Phase${MainVariables.CurrentPhase}`, 0.5);
}

// Main Func
function main() {
    // Prep
    $("#versionText").text(`v${Config.Version}`.toString());

    for (let i = 0; i < 12; i++) { FunctionVariables.PlaySound.SoundInstances[i] = new Audio(); }
    for (let i = 0; i < 20; i++) {
        let div = document.createElement("div");
        div.appendChild(document.createTextNode(`+$${MainVariables.MoneyIncrement}`));
        $(div).css({position: "absolute", "user-select": "none", "pointer-events": "none", color: "#FFF"});
        FunctionVariables.ShowClickText.TextInstances[i] = div;
    }
    for (let i = 0; i < 4; i++) {
        FunctionVariables.PlayMusic.SoundInstances[`Phase${i}`] = new Audio(`./Audio/Phase${i}.mp3`);
        FunctionVariables.PlayMusic.SoundInstances[`Phase${i}`].volume = 0;
        FunctionVariables.PlayMusic.SoundInstances[`Phase${i}`].loop = true;
    }

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

    {
        let hasInteracted = false;
        ["mousedown", "keydown", "scroll", "touchstart"].forEach((eventName) => {
            document.addEventListener(eventName, () => {
                if (hasInteracted) { return; }
                hasInteracted = true;
                MainInteract();
            })
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

        mainButton.mouseup((event) => {
            if (currentAnim) currentAnim.stop();
            currentAnim = mainButton.animate({
                width: "90%",
            }, animInfo);

            MainVariables.Clicks += 1;
            MainVariables.Money += MainVariables.MoneyIncrement;
            MainVariables.MoneyAllTime += MainVariables.MoneyIncrement;
            ShowClickText(event.clientX, event.clientY);

            PlaySound("./Audio/MainClick.wav", 0.15);
        });
    }

    setInterval(MainInterval, 1000 / 60); // Every 60 milliseconds
}

$(document).ready(main);
