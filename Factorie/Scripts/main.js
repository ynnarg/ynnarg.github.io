console.log("working");

// Imports

import jsCookie from "./Libs/js.cookie.min.mjs";

import { createTree, createUITree } from "./Modules/createtree.js";
import { Crafting } from "./Modules/crafting.js";
import { TypeTitles, Products } from "./Modules/products.js";
import { Tech } from "./Modules/tech.js";

// Config

var Config = {
    Version: "0.1.0"
};

// Variables

var MainVariables = { // Please put in alphabetical order
    Clicks: 0,
    CraftingTree: createTree(Crafting, "Inputs", "Outputs"),
    CurrentPhase: 0,
    CurrentBenefits: {
        SellPriceMul: 1,
        ClickMul: 1,
    },
    LastIntervalTime: null,
    Money: 0,
    MoneyAllTime: 0,
    MoneyIncrement: 1,
    StartTime: Date.now(),
    TechTree: createTree(Tech, "Precursors"),
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
            topBar_settingsView: document.getElementById("topBar_settingsView"),
            topBar_creditsView: document.getElementById("topBar_creditsView")
        },

        buttonMatches: {
            topBar_mainView: "mainView", topBar_marketView: "marketView", topBar_factoryView: "factoryView",
            topBar_extractorView: "extractorView", topBar_techView: "techView",
            topBar_statsView: "statsView", topBar_settingsView: "settingsView",
            topBar_creditsView: "creditsView"
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
        }, creditsView: {
            view: document.getElementById("creditsView")
        }
    }
};

var FunctionVariables = {
    ApplyBenefit: {},
    BeautifyNum: {format: [" ", " million", " billion", " trillion", " quadrillion", " quintillion", " sextillion", " septillion", " octillion", " nonillion"], prefixes: ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"], suffixes: ["decillion", "vigintillion", "trigintillion", "quadragintillion", "quinquagintillion", "sexagintillion", "septuagintillion", "ocotogintillion", "nonagintillion"]},
    PlayMusic: {SoundInstances: {}, Animations: [], CurrentlyPlaying: null, PreviouslyPlaying: null},
    PlaySound: {URLs: {}, SoundInstances: [], SoundIndex: 0},
    ShowClickText: {TextInstances: [], TextIndex: 0, AnimationInstances: []},
    SwitchView: {CurrentView: "mainView"}
};

// Functions

function AddMoney(money) {
    MainVariables.Money += money;
    MainVariables.MoneyAllTime += money;
}


function ApplyBenefit(benefitKey, benefit) {
    switch (benefitKey) {
        case "SellPriceMul":
            MainVariables.CurrentBenefits.SellPriceMul *= benefit;
            break;
        case "ClickMul":
            MainVariables.CurrentBenefits.ClickMul *= benefit;
            break;
        default:
            break;
    }
}


function BeautifyNum(num) {
    let negative = (num < 0);
    let fixed = num.toFixed(3);
    let decimal = "";
    if (Math.abs(num) < 1000 && Math.floor(fixed) != fixed) { decimal = `.${fixed.toString().split(".")[1]}`; }
    num = Math.floor(Math.abs(num));
    if (fixed == num + 1) num++;

    let output = "";
    let notation = null;
    if (!isFinite(num)) { return "Infinity"; }
    else if (num >= 1000000) {
        num /= 1000;
        let base = 0;
        while (Math.round(num) >= 1000) {
            num /= 1000;
            base++;
        }
        if (base >= FunctionVariables.BeautifyNum.format.length) { output = "Infinity"; } else { notation = FunctionVariables.BeautifyNum.format[base]; }
    }
    output = (Math.round(num * 1000) / 1000).toString()
    if (notation) {
        output += notation;
    }

    output = output.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (output == "0") { negative = false; }
    return negative ? `-${output}` : output+decimal;
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
        sound.pause();
        if (sound.src != scope.URLs[url].src) { sound.src = scope.URLs[url].src; }
        scope.URLs[url].volume = Math.pow(volume, 2);
        try { scope.URLs[url].play() } catch(_) {  }
    } else {
        // Sound isn't loaded
        scope.URLs[url] = new Audio(url);
        scope.URLs[url].onloadeddata = (_) => { PlaySound(url, volume); }
    }
}


function ShowClickText(x, y, add) {
    add = add || MainVariables.MoneyIncrement * MainVariables.CurrentBenefits.ClickMul;
    let scope = FunctionVariables.ShowClickText;
    scope.TextIndex = (scope.TextIndex + 1) % 20;
    let textIndex = scope.TextIndex;
    if (scope.AnimationInstances[textIndex]) { scope.AnimationInstances[textIndex].stop(); }
    let div = scope.TextInstances[textIndex];
    $(div).text(`$${BeautifyNum(add)}`);
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
    let dt = (Date.now() - (MainVariables.LastIntervalTime || Date.now() - 0.01)) / 1000;
    MainVariables.Money = Math.round(MainVariables.Money * 100) / 100;
    MainVariables.MoneyAllTime = Math.round(MainVariables.MoneyAllTime * 100) / 100;
    MainVariables.MoneyIncrement = Math.round(MainVariables.MoneyIncrement * 100) / 100;

    $("#statsView_timePlayed").text(`Time played: ${SecondsToDHMS(Date.now() - MainVariables.StartTime)}`);
    $("#statsView_moneyInBank").text(`Money in bank: $${BeautifyNum(MainVariables.Money)}`);
    $("#statsView_moneyMadeAllTime").text(`Money made (all time): $${BeautifyNum(MainVariables.MoneyAllTime)}`);
    $("#statsView_clicksMade").text(`Clicks made: ${BeautifyNum(MainVariables.Clicks)}`);

    $("title").text(`Factorie | $${BeautifyNum(MainVariables.Money)}`);
    $("#topBar_money").text(`$${BeautifyNum(MainVariables.Money)}`);

    let shouldBePhase = 0;
    for (let i = 3; i >= 1; i--) {
        if (MainVariables.MoneyAllTime >= Math.pow(10, i*3)) { shouldBePhase = i; break; }
    }
    if (MainVariables.CurrentPhase != shouldBePhase) {
        console.log("Next phase");
        MainVariables.CurrentPhase = shouldBePhase;
        PlayMusic(`Phase${shouldBePhase}`, 0.5);
    }

    // Update topbar button visibility
    for (let topBarButtonKey in UI.topBar.buttons) {
        let topBarButton = $(UI.topBar.buttons[topBarButtonKey]);
        if (topBarButtonKey != "topBar_mainView") {
            let visibility = "visible";
            switch(topBarButtonKey) {
                case "topBar_techView":
                    if (MainVariables.MoneyAllTime < 10) { visibility = "hidden"; }
                    break;
                case "topBar_marketView":
                    if (!Tech.Market.Unlocked) { visibility = "hidden"; }
                    break;
                case "topBar_extractorView":
                    if (!Tech.Extractor.Unlocked) { visibility = "hidden"; }
                    break;
                case "topBar_factoryView":
                    if (!Tech.Factorie.Unlocked) { visibility = "hidden"; }
                    break;
                default:
                    visibility = "hidden";
                    break;
            }
            topBarButton.css({visibility: visibility});
        }
    }
    // Update extracted products
    for (let p in Products) {
        let product = Products[p];
        if ((!product.FromExtractor) || (!product.ExtractorInfo.ExtractorOwned)) { continue; }
        product.Amount = Math.min(product.Amount + (1 / product.ExtractorInfo.YieldDifficulty) * dt, product.MaxAmount);
    }

    // Update market
    let marketView_inner = $(document).find("#marketView_inner");
    if (marketView_inner) {
        for (let p in Products) {
            let product = Products[p];
            let jBuyButton = marketView_inner.find(`#${p}_buyButton`);
            jBuyButton.text(`Sell ${BeautifyNum(product.Amount)} of ${product.Title || p} for $${BeautifyNum(product.Prices.Middle * product.Amount)}`);
        }
    }

    MainVariables.LastIntervalTime = Date.now();
}

// Main Interact (calls when user performs first interaction, good for playing music)
function MainInteract() {
    PlayMusic(`Phase${MainVariables.CurrentPhase}`, 0.5);
}

// Main Func
function main() {
    // Prep
    $(document).mousedown((e) => {
        if (e.which == 2) { return false; }
    })
    $("#versionText").text(`v${Config.Version}`.toString());

    for (let s in FunctionVariables.BeautifyNum.suffixes) {
        for (let p in FunctionVariables.BeautifyNum.prefixes) {
            let prefixes = FunctionVariables.BeautifyNum.prefixes;
            let suffixes = FunctionVariables.BeautifyNum.suffixes;
            FunctionVariables.BeautifyNum.format.push(` ${prefixes[p]}${suffixes[s]}`);
        }
    }

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

    // Technology view
    {
        let techView_inner = document.getElementById("techView_inner");
        let exampleTechnology = document.getElementById("exampleTechnology");
        techView_inner.removeChild(exampleTechnology);
        let techUITree = createUITree(MainVariables.TechTree, 140, 20, 100);
        for (let blockKey in techUITree) {
            let block = techUITree[blockKey];
            let tech = Tech[block.key];
            let title = tech.Title || block.key;
            let clone = exampleTechnology.cloneNode(true);

            let jClone = $(clone);
            jClone.attr("id", `${block.key}`);
            jClone.find("#exampleTechnology_tech").attr("id", `${block.key}_tech`);
            jClone.find(`#${block.key}_tech`).text(`${title}`);
            jClone.find("#exampleTechnology_description").attr("id", `${block.key}_description`);
            jClone.find(`#${block.key}_description`).text(tech.Description);
            jClone.find("#exampleTechnology_buy").attr("id", `${block.key}_buy`);
            jClone.find("#exampleTechnology_buyButton").attr("id", `${block.key}_buyButton`);
            jClone.find(`#${block.key}_buyButton`).text(`Buy ($${tech.Cost})`);
            jClone.css({top: `${block.top}px`, left: `${block.left}px`, visibility: (tech.Precursors.length > 0 && "hidden") || "visible"});

            jClone.find(`#${block.key}_buyButton`).mouseup(() => {
                if (!Tech[block.key].Unlocked && MainVariables.Money >= tech.Cost) {
                    Tech[block.key].Unlocked = true;
                    for (let benefitKey in tech.Benefits) {
                        ApplyBenefit(benefitKey, tech.Benefits[benefitKey]);
                    }

                    MainVariables.Money -= tech.Cost;
                    jClone.find(`#${block.key}_buyButton`).text(`Unlocked`);
                    for (let techKey in Tech) {
                        if (Tech[techKey].Precursors.find((key) => { return (key == block.key); })) {
                            $(techView_inner).find(`#${techKey}`).css({visibility: "visible"});
                        }
                    }
                }
            })

            techView_inner.appendChild(clone);
        }
    }

    // Market View
    let marketView_inner = document.getElementById("marketView_inner");
    let marketTypeBlocks = {};
    {
        let exampleMarketSplit = document.getElementById("exampleMarketSplit");
        let exampleMarket = document.getElementById("exampleMarket");
        $(exampleMarketSplit).find("#exampleMarketSplit_section").empty();
        marketView_inner.removeChild(exampleMarketSplit);

        for (let p in Products) {
            let product = Products[p];
            if (Object.keys(marketTypeBlocks).find((type) => { return (type == product.Type); })) { continue; }
            let marketSplit = exampleMarketSplit.cloneNode(true);
            let jMarketSplit = $(marketSplit);
            jMarketSplit.attr("id", `${product.Type}`);
            jMarketSplit.find("#exampleMarketSplit_type").attr("id", `${product.Type}_type`);
            jMarketSplit.find(`#${product.Type}_type`).text(TypeTitles[product.Type] || product.Type);
            jMarketSplit.find("#exampleMarketSplit_section").attr("id", `${product.Type}_section`);
            jMarketSplit.css({visibility: "hidden"});
            marketView_inner.appendChild(marketSplit);
            marketTypeBlocks[product.Type] = {Block: marketSplit, Visible: false};
        }

        for (let p in Products) {
            let product = Products[p];
            let typeBlock = marketTypeBlocks[product.Type].Block;
            let marketClone = exampleMarket.cloneNode(true);
            let jMarketClone = $(marketClone);
            jMarketClone.attr("id", p);
            jMarketClone.find("#exampleMarket_type").attr("id", `${p}_type`);
            jMarketClone.find(`#${p}_type`).text(`${product.Title || p}`);
            jMarketClone.find("#exampleMarket_description").attr("id", `${p}_description`);
            jMarketClone.find(`#${p}_description`).text(product.Description);
            jMarketClone.find("#exampleMarket_buy").attr("id", `${p}_buy`);
            jMarketClone.find(`#${p}_buy`).css({height: "40px"});
            jMarketClone.find("#exampleMarket_buyButton").attr("id", `${p}_buyButton`);
            jMarketClone.css({visibility: "hidden"});

            jMarketClone.find(`#${p}_buy`).mouseup((event) => {
                if (Products[p].Amount <= 0) { return; }
                let add = Products[p].Amount * product.Prices.Middle;
                AddMoney(add);
                ShowClickText(event.clientX, event.clientY, add);
                Products[p].Amount = 0;
            })

            $(typeBlock).find(".marketSplit_section").append(marketClone);
        }
    }

    // Extractor view
    {
        let extractorView_inner = document.getElementById("extractorView_inner");
        let exampleExtractor = document.getElementById("exampleExtractor");
        extractorView_inner.removeChild(exampleExtractor);
        for (let p in Products) {
            let product = Products[p];
            if (!product.FromExtractor) { continue; }
            let extractor = exampleExtractor.cloneNode(true);
            $(extractor).attr("id", p);
            let type = $(extractor).find("#exampleExtractor_type");
            type.attr("id", `${p}_type`)
            type.text(`${product.Title || p} Ex.`);
            let buy_wrapper = $(extractor).find("#exampleExtractor_buy");
            buy_wrapper.attr("id", `${p}_buy`);
            let buyButton = $(extractor).find("#exampleExtractor_buyButton");
            buyButton.attr("id", `${p}_buy`);
            buyButton.text(`Buy ($${product.ExtractorInfo.ExtractorCost})`);
            buyButton.mouseup(() => {
                if (!product.ExtractorInfo.ExtractorOwned && MainVariables.Money >= product.ExtractorInfo.ExtractorCost) {
                    let block = $(marketView_inner).find(`#${product.Type}`);
                    Products[p].ExtractorInfo.ExtractorOwned = true;
                    $(marketView_inner).find("#market_empty").text("");
                    if (!marketTypeBlocks[product.Type].Visible) {
                        marketTypeBlocks[product.Type].Visible = true;
                        block.css({visibility: "visible"});
                    }
                    block.find(`#${p}`).css({visibility: "visible"});
                    MainVariables.Money -= product.ExtractorInfo.ExtractorCost;
                    buyButton.text(`Owned`);
                }
            });
            extractorView_inner.appendChild(extractor);
        }
    }

    // Remove other views
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
            AddMoney(MainVariables.MoneyIncrement * MainVariables.CurrentBenefits.ClickMul);
            ShowClickText(event.clientX, event.clientY);

            PlaySound("./Audio/MainClick.wav", 0.15);
        });
    }

    {
        let techView = $(UI.views.techView.view);
        let mousedown = false;
        let mousedownX = null;
        let mousedownY = null;
        let startPosX = null;
        let startPosY = null;
        techView.mousedown((event) => {
            mousedown = true;
            mousedownX = event.pageX; mousedownY = event.pageY;
            startPosX = techView.position().left; startPosY = techView.position().top;
        });

        $(document).mousemove((event) => {
            if (!mousedown) { return; }
            let deltaX = event.pageX - mousedownX;
            let deltaY = event.pageY - mousedownY;
            let newPosX = Math.min(startPosY + deltaY, 0);
            let newPosY = Math.min(startPosX + deltaX, 0);
            techView.css({top: newPosX, left: newPosY, position: "absolute"});
        });

        $(document).mouseup(() => {
            mousedown = false;
            mousedownX = null; mousedownY = null;
            startPosX = null; startPosY = null;
        });
    }

    setInterval(MainInterval, 1000 / 60); // Every 60 milliseconds
}

$(document).ready(main);
