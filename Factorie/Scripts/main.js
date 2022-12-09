console.log("working");



/*******************************************************************************************************************************\
*** IMPORTS *********************************************************************************************************************
\*******************************************************************************************************************************/



import jsCookie from "./Libs/js.cookie.min.mjs";

import { createTree, createUITree } from "./Modules/createtree.js";
import { Crafting } from "./Modules/crafting.js";
import { TypeTitles, Products } from "./Modules/products.js";
import { Tech } from "./Modules/tech.js";
import { Credits } from "./Modules/credits.js";



/*******************************************************************************************************************************\
*** CONFIGURATION ***************************************************************************************************************
\*******************************************************************************************************************************/



const Config = {
    Version: "0.2.1",
    Testing: false,
};



/*******************************************************************************************************************************\
*** VARIABLES *******************************************************************************************************************
\*******************************************************************************************************************************/



var MainVariables = { // Please put in alphabetical order
    Clicks: 0,
    CraftingTree: createTree(Crafting, "Inputs", "Outputs"),
    CurrentPhase: 0,
    CurrentBenefits: {
        SellPriceMul: 1,
        ClickMul: 1,
        StorageMul: 1
    },
    Extractors: {},
    LastIntervalTime: null,
    LastMajorIntervalTime: null,
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
            view_backgroundImage: document.getElementById("mainView_backgroundImage"),
            mainButton: document.getElementById("mainButton"),
            mainProgressBar: document.getElementById("mainProgressBar"),
        }, marketView: {
            view: document.getElementById("marketView"),
            buyButtons: {},
            splits: {}
        }, extractorView: {
            view: document.getElementById("extractorView")
        }, factoryView: {
            view: document.getElementById("factoryView"),
            factories: [],
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
    PlaySound: {URLs: {}, SoundInstances: [], SoundIndex: 0, MaxSoundIndex: 12},
    ShowClickText: {TextInstances: [], TextIndex: 0, AnimationInstances: []},
    SwitchView: {CurrentView: "mainView"},
};



/*******************************************************************************************************************************\
*** FUNCTIONS *******************************************************************************************************************
\*******************************************************************************************************************************/



function AddMoney(money) {
    MainVariables.Money += money;
    MainVariables.MoneyAllTime += money;
}


function ApplyBenefit(benefitKey, benefit) {
    switch (benefitKey) {
        default:
            MainVariables.CurrentBenefits[benefitKey] *= benefit;
            break;
    }
}


function BeautifyNum(num) {
    let negative = (num < 0);
    let fixed = num.toFixed(3);
    let decimal = "";
    //if (Math.abs(num) < 1000 && Math.floor(fixed) != fixed) { decimal = `.${fixed.toString().split(".")[1].substring(0, 2)}`; }
    if (Math.abs(num) < 1000) { decimal = `.${fixed.toString().split(".")[1].substring(0, 2)}`; }
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
        if (base >= FunctionVariables.BeautifyNum.format.length) { return "Infinity"; } else { notation = FunctionVariables.BeautifyNum.format[base]; }
    }
    output = (Math.round(num * 1000) / 1000).toString()
    if (notation) {
        output += notation;
    }

    output = output.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (output == "0") { negative = false; }
    return negative ? `-${output}` : output+decimal;
}


function GetBalancedFactoryInputs(factory) {
    let factoryUI = factory.ui;
    let factoryKey = factory.key;
    let crafting = Crafting[factoryKey];
    
    let inputs = crafting.Inputs;
    let outputs = crafting.Outputs;

    let primeInputKey = null;
    for (let inputKey in inputs) {
        if (!primeInputKey || inputs[inputKey] > inputs[primeInputKey]) {
            primeInputKey = inputKey;
        }
    }
    let primeInput = inputs[primeInputKey];
    let primeInputN = Products[primeInputKey].Amount;
    let scale = 1;

    for (let inputKey in inputs) {
        let input = inputs[inputKey];
        let inputN = Products[inputKey].Amount;
        let requiredN = (input / primeInput) * inputN;
        let ratio = inputN / requiredN;
        if (!isFinite(ratio)) { scale = 0; break; }
        if (inputN < requiredN) {
            scale = Math.max(ratio, 0);
        }
    }

    let scaled = {};
    for (let inputKey in inputs) {
        let input = inputs[inputKey];
        let required = (input / primeInput) * Products[inputKey].Amount * scale;
        scaled[inputKey] = required;
    }

    // Returns the scale relative the prime input, a list of scaled inputs, the prime inputs ratio amount, and the prime inputs count
    return {Scale: scale, Scaled: scaled, PrimeInput: primeInput, PrimeInputN: primeInputN};
}


function MakeDraggable(view, dir, offsetView) {
    offsetView = offsetView || view;
    view = $(view);
    let mousedown = false;
    let mousedownX = null;
    let mousedownY = null;
    let startPosX = null;
    let startPosY = null;
    view.mousedown((event) => {
        mousedown = true;
        mousedownX = event.pageX; mousedownY = event.pageY;
        startPosX = view.position().left; startPosY = view.position().top;
        view.css({cursor: "grabbing"});
    });

    $(document).mousemove((event) => {
        if (!mousedown) { return; }
        let deltaX = event.pageX - mousedownX;
        let deltaY = event.pageY - mousedownY;
        let newPosX = Math.max(Math.min(startPosX + deltaX, 0), -offsetView.scrollWidth + offsetView.offsetWidth);
        let newPosY = Math.max(Math.min(startPosY + deltaY, 0), -offsetView.scrollHeight + offsetView.offsetHeight);
        let cssChange = {top: newPosY, left: newPosX, position: "absolute"};
        if (dir == "x") {
            cssChange.top = startPosY;
        } else if (dir == "y") {
            cssChange.left = startPosX;
        }
        view.css(cssChange);
    });

    $(document).mouseup(() => {
        mousedown = false;
        mousedownX = null; mousedownY = null;
        startPosX = null; startPosY = null;
        view.css({cursor: "grab"});
    });
}


function PlayMusic(musicUrl, volume) {
    $.get(`./Audio/${musicUrl}.mp3`).done(() => {
        console.log("ok");
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
    }).fail(() => {  });
}


function PlaySound(url, volume) {
    let scope = FunctionVariables.PlaySound
    if (scope.URLs[url] && scope.URLs[url].readyState >= 2) {
        // Sound is loaded
        volume = volume || 1.0;

        scope.SoundIndex = (scope.SoundIndex + 1) % scope.MaxSoundIndex;
        let sound = scope.SoundInstances[scope.SoundIndex];
        sound.pause();
        sound.currentTime = 0;
        if (sound.src != scope.URLs[url].src) { sound.src = scope.URLs[url].src; }
        sound.volume = Math.pow(volume, 2);
        try { sound.play() } catch(_) {  }
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


function UpdateFactories() {
    for (let factoryN in UI.views.factoryView.factories) {
        let factory = UI.views.factoryView.factories[factoryN];
        let factoryUI = factory.ui;
        let factoryKey = factory.key;
        let crafting = Crafting[factoryKey];
        
        let inputs = crafting.Inputs;
        let outputs = crafting.Outputs;

        let balanced = GetBalancedFactoryInputs(factory);
        let scale = balanced.Scale;
        let scaled = balanced.Scaled;
        let primeInput = balanced.PrimeInput;
        let primeInputN = balanced.PrimeInputN;
        
        let textString = "";
        let isFirst = true;
        for (let inputKey in scaled) {
            let input = scaled[inputKey];
            let required = (input / primeInput) * scale;
            if (!isFinite(required)) { required = 0; }
            let requiredStr = BeautifyNum(parseFloat(required));
            if (!isFirst) { textString += ` : ${requiredStr}`; }
            else { isFirst = false; textString += requiredStr; }
            textString += ` ${(Products[inputKey] || {}).Title || inputKey}`;
        }
        textString += " = ";
        isFirst = true;
        for (let outputKey in outputs) {
            let required = (primeInputN / primeInput) * outputs[outputKey] * scale;
            // let required = (outputs[outputKey] / primeInputN) * scale;
            if (!isFinite(required)) { required = 0; }
            let requiredStr = BeautifyNum(parseFloat(required));
            if (!isFirst) { textString += ` : ${requiredStr}` }
            else { isFirst = false; textString += requiredStr; }
            textString += ` ${(Products[outputKey] || {Title: `${outputKey} AN ISSUE`}).Title || outputKey}`;
        }

        factoryUI.importButton.text(textString);
        let outputTextStr = "";
        isFirst = true;
        for (let outputKey in outputs) {
            let current = BeautifyNum(parseFloat(Products[outputKey].Amount));
            if (!isFirst) { outputTextStr += ", "; }
            else { isFirst = false; }
            outputTextStr += `${current} / ${BeautifyNum(parseFloat(Products[outputKey].MaxAmount))} ${Products[outputKey].Title || outputKey}`
        }
        factoryUI.outputText.text(outputTextStr);
    }
}


function UpdateTopbar() {
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
                case "topBar_settingsView":
                    if (!Tech.Settings.Unlocked) { visibility = "hidden"; }
                    break;
                case "topBar_statsView":
                    if (!Tech.Stats.Unlocked) { visibility = "hidden"; }
                    break;
                case "topBar_creditsView":
                    visibility = "visible";
                    break;
                default:
                    visibility = "visible";
                    break;
            }
            // This is so hacky.
            let props = {visibility: visibility, height: "calc(100% - 2px)", width: "80px", "padding-left": "6px", "padding-right": "6px"};
            if (visibility == "hidden") {
                props.height = "0px";
                props.width = "0px";
                props["padding-left"] = "0px";
                props["padding-right"] = "0px"
            }

            topBarButton.css(props);
        }
    }
}

console.log("still working");



/*******************************************************************************************************************************\
*** MAIN INTERVAL ***************************************************************************************************************
\*******************************************************************************************************************************/



function MainInterval() {
    let dt = (Date.now() - (MainVariables.LastIntervalTime || Date.now() - 0.01)) / 1000;
    MainVariables.Money = Math.round(MainVariables.Money * 100) / 100;
    MainVariables.MoneyAllTime = Math.round(MainVariables.MoneyAllTime * 100) / 100;
    MainVariables.MoneyIncrement = Math.round(MainVariables.MoneyIncrement * 100) / 100;

    let shouldBePhase = 0;
    if (Products.PCBs.Amount > 0) { shouldBePhase = 3; }
    else if (Products.Iron.Amount > 0) { shouldBePhase = 2; }
    else if (Products.IronOre.Amount > 0) { shouldBePhase = 1; }

    if (MainVariables.CurrentPhase < shouldBePhase) {
        console.log("Next phase");
        MainVariables.CurrentPhase = shouldBePhase;
        PlayMusic(`Phase${shouldBePhase}`, 0.25);
        $(UI.views.mainView.view_backgroundImage).css({"background-image": `url("./Images/The\ Perfect\ Scene\ Phase\ ${shouldBePhase}.png")`});
    }
    
    // Update extracted products
    for (let p in Products) {
        let product = Products[p];
        if ((!product.FromExtractor) || (!product.ExtractorInfo.ExtractorOwned)) { continue; }
        let yieldMul = MainVariables.Extractors[p].YieldMul;
        let richnessMul = MainVariables.Extractors[p].RichnessMul;
        let storageMul = MainVariables.Extractors[p].StorageMul;
        product.Amount = Math.min(product.Amount + (1 / product.ExtractorInfo.YieldDifficulty) * yieldMul * richnessMul * dt, product.MaxAmount * storageMul);
    }

    // Update market
    let marketView_inner = $(document).find("#marketView_inner");
    if (marketView_inner) {
        for (let p in Products) {
            let product = Products[p];
            let storageMul = MainVariables.CurrentBenefits.StorageMul;
            if (product.FromExtractor) { storageMul = MainVariables.Extractors[p].StorageMul; }

            let jBuyButton = UI.views.marketView.buyButtons[p];//marketView_inner.find(`#${p}_buyButton`);
            let unit = product.Unit || "Units";
            jBuyButton.text(`Sell (${BeautifyNum(product.Amount)}/${BeautifyNum(product.MaxAmount * storageMul)}) ${unit} of ${product.Title || p} for $${BeautifyNum(product.Prices.Middle * product.Amount)}`);
        }
    }

    $("#topBar_money").text(`$${BeautifyNum(MainVariables.Money)}`);
    if (!MainVariables.LastMajorIntervalTime || (Date.now() - MainVariables.LastMajorIntervalTime) >= 1000) {
        // Run this every second
        $("#statsView_timePlayed").text(`Time played: ${SecondsToDHMS(Date.now() - MainVariables.StartTime)}`);
        $("#statsView_moneyInBank").text(`Money in bank: $${BeautifyNum(MainVariables.Money)}`);
        $("#statsView_moneyMadeAllTime").text(`Money made (all time): $${BeautifyNum(MainVariables.MoneyAllTime)}`);
        $("#statsView_clicksMade").text(`Clicks made: ${BeautifyNum(MainVariables.Clicks)}`);

        $("title").text(`Factorie | $${BeautifyNum(MainVariables.Money)}`);

        UpdateTopbar();
        UpdateFactories();

        let largestSplit = 0;
        for (let s in UI.views.marketView.splits) {
            let split = UI.views.marketView.splits[s].find(`.marketSplit_section`);
            let splitWidth = split[0].scrollWidth + split[0].getBoundingClientRect().left;
            if (splitWidth > largestSplit) { largestSplit = splitWidth; }
        }

        let viewWidth = $(UI.views.marketView.view)[0].scrollWidth;
        if (largestSplit > 0) { $(UI.views.marketView.view).css({width: Math.max(largestSplit, viewWidth)}); }

        MainVariables.LastMajorIntervalTime = Date.now();
    }

    MainVariables.LastIntervalTime = Date.now();
}



/*******************************************************************************************************************************\
*** MAIN INTERACT ***************************************************************************************************************
\*******************************************************************************************************************************/



function MainInteract() {
    PlayMusic(`Phase${MainVariables.CurrentPhase}`, 0.5);
}



/*******************************************************************************************************************************\
*** MAIN FUNCTION ***************************************************************************************************************
\*******************************************************************************************************************************/



function main() {
    if (Config.Testing) { MainVariables.MoneyIncrement *= 1_000_000_000; }

    // ************************** //
    // ***** Pre Processing ***** //
    // ************************** //

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

    for (let i = 0; i < FunctionVariables.PlaySound.MaxSoundIndex; i++) { FunctionVariables.PlaySound.SoundInstances[i] = new Audio(); }
    for (let i = 0; i < 20; i++) {
        let div = document.createElement("div");
        div.appendChild(document.createTextNode(`+$${MainVariables.MoneyIncrement}`));
        $(div).css({position: "absolute", "user-select": "none", "pointer-events": "none", color: "#FFF"});
        FunctionVariables.ShowClickText.TextInstances[i] = div;
    }
    for (let i = 0; i < 6; i++) {
        FunctionVariables.PlayMusic.SoundInstances[`Phase${i}`] = new Audio(`./Audio/Phase${i}.mp3`);
        FunctionVariables.PlayMusic.SoundInstances[`Phase${i}`].volume = 0;
        FunctionVariables.PlayMusic.SoundInstances[`Phase${i}`].loop = true;
    }

    // ************************** //
    // ***** Views ************** //
    // ************************** //

    // ***** Technology View ***** //

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
            let jTech = jClone.find("#exampleTechnology_tech");
            let jDescription = jClone.find("#exampleTechnology_description");
            jClone.attr("id", `${block.key}`);
            jTech.attr("id", `${block.key}_tech`);
            jTech.text(title);
            jDescription.attr("id", `${block.key}_description`);
            jDescription.text(tech.Description);
            let jBuy = jClone.find("#exampleTechnology_buy");
            jBuy.attr("id", `${block.key}_buy`);
            let jBuyButton = jClone.find("#exampleTechnology_buyButton");
            jBuyButton.attr("id", `${block.key}_buyButton`);
            jBuyButton.text(`Buy ($${BeautifyNum(tech.Cost)})`);
            jClone.css({top: `${block.top}px`, left: `${block.left}px`, visibility: (tech.Precursors.length > 0 && "hidden") || "visible"});

            jBuyButton.mouseup(() => {
                let isMultiAvailable = false;
                let cost = tech.Cost;
                let benefits = tech.Benefits;
                if ((tech.Unlocked) && tech.MultiInfo && tech.MultiInfo.MultiLevel < tech.MultiInfo.MaxMultiLevel) {
                    isMultiAvailable = true;
                    cost = tech.MultiInfo.Costs[tech.MultiInfo.MultiLevel + 1];
                    benefits = tech.MultiInfo.Benefits[tech.MultiInfo.MultiLevel + 1];
                }

                if ((isMultiAvailable || !Tech[block.key].Unlocked) && MainVariables.Money >= cost) {
                    Tech[block.key].Unlocked = true;
                    if (isMultiAvailable) {
                        Tech[block.key].MultiInfo.MultiLevel++;
                    }

                    for (let benefitKey in benefits) {
                        ApplyBenefit(benefitKey, benefits[benefitKey]);
                    }

                    MainVariables.Money -= cost;
                    if (!tech.MultiInfo || (tech.MultiInfo.MultiLevel >= tech.MultiInfo.MaxMultiLevel)) {
                        jBuyButton.text(`Unlocked`);
                        jBuyButton.css({"pointer-events": "none"});
                        jBuy.css({cursor: "auto", "pointer-events": "none"});
                    } else {
                        let desc = tech.MultiInfo.Descriptions[tech.MultiInfo.MultiLevel]
                        if (desc) { jDescription.text(tech.MultiInfo.Descriptions[tech.MultiInfo.MultiLevel]); }
                        jBuyButton.text(`(${tech.MultiInfo.MultiLevel + 2}) Buy ($${tech.MultiInfo.Costs[tech.MultiInfo.MultiLevel + 1]})`);
                    }

                    for (let techKey in Tech) {
                        if (Tech[techKey].Precursors.find((key) => { return (key == block.key); })) {
                            $(techView_inner).find(`#${techKey}`).css({visibility: "visible"});
                        }
                    }

                    PlaySound("./Audio/MainClick.mp3", 0.10);
                } else if ((!isMultiAvailable && tech.Unlocked) || MainVariables.Money < cost) {
                    PlaySound("./Audio/BadClick.mp3", 0.15);
                }
            })

            techView_inner.appendChild(clone);
        }
    }

    // ***** Market View ***** //

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
            UI.views.marketView.splits[product.Type] = jMarketSplit;
        }

        for (let p in Products) {
            let product = Products[p];
            let typeBlock = marketTypeBlocks[product.Type].Block;
            let marketClone = exampleMarket.cloneNode(true);
            let jMarketClone = $(marketClone);
            jMarketClone.attr("id", `product_${p}`);
            jMarketClone.find("#exampleMarket_type").attr("id", `${p}_type`);
            jMarketClone.find(`#${p}_type`).text(`${product.Title || p}`);
            jMarketClone.find("#exampleMarket_description").attr("id", `${p}_description`);
            jMarketClone.find(`#${p}_description`).text(product.Description);
            jMarketClone.find("#exampleMarket_buy").attr("id", `${p}_buy`);
            jMarketClone.find(`#${p}_buy`).css({height: "60px"});
            let jBuyButton = jMarketClone.find("#exampleMarket_buyButton");
            jBuyButton.attr("id", `${p}_buyButton`);
            jMarketClone.css({visibility: "hidden", position: "absolute"});

            jMarketClone.find(`#${p}_buy`).mouseup((event) => {
                if (Products[p].Amount <= 0) { return; }
                let add = Products[p].Amount * product.Prices.Middle;
                AddMoney(add);
                ShowClickText(event.clientX, event.clientY, add);
                Products[p].Amount = 0;

                PlaySound("./Audio/MainClick.mp3", 0.10);
            })

            $(typeBlock).find(".marketSplit_section").append(marketClone);
            UI.views.marketView.buyButtons[p] = jBuyButton;
        }
    }

    // ***** Extractor View ***** //

    {
        let extractorView_inner = document.getElementById("extractorView_inner");
        let exampleExtractorSplit = document.getElementById("exampleExtractorSplit");
        let exampleExtractor = document.getElementById("exampleExtractor");
        exampleExtractorSplit.removeChild(exampleExtractor);
        extractorView_inner.removeChild(exampleExtractorSplit);
        for (let p in Products) {
            let product = Products[p];
            if (!product.FromExtractor) { continue; }
            MainVariables.Extractors[p] = {YieldMul: 1, RichnessMul: 1, StorageMul: 1};
            let extractorInfo = product.ExtractorInfo;
            let extractorSplit = exampleExtractorSplit.cloneNode(true);
            let extractor = exampleExtractor.cloneNode(true);
            let jExtractor = $(extractor);
            let type = jExtractor.find("#exampleExtractor_type");
            let buy_wrapper = jExtractor.find("#exampleExtractor_buy");
            let buyButton = jExtractor.find("#exampleExtractor_buyButton");
            let buyYieldButton = jExtractor.find("#exampleExtractor_buyYieldButton");
            let buyRichnessButton = jExtractor.find("#exampleExtractor_buyRichnessButton");
            let buyStorageButton = jExtractor.find("#exampleExtractor_buyStorageButton");
            jExtractor.attr("id", p);
            type.attr("id", `${p}_type`)
            type.text(`${product.Title || p} Ex.`);
            buy_wrapper.attr("id", `${p}_buy`);
            buyButton.attr("id", `${p}_buy`);
            buyButton.text(`Buy ($${extractorInfo.ExtractorCost})`);
            buyYieldButton.text(`Upgrade Yield ($${extractorInfo.Upgrades.Yield.Start})`);
            buyRichnessButton.text(`Upgrade Richness ($${extractorInfo.Upgrades.Richness.Start})`);
            buyStorageButton.text(`Upgrade Storage ($${extractorInfo.Upgrades.Storage.Start})`);

            if (extractorInfo.ExtractorBackground) { $(extractorSplit).css({"background-image": `url(${extractorInfo.ExtractorBackground})`}); }

            buyButton.mouseup(() => {
                if (!extractorInfo.ExtractorOwned && MainVariables.Money >= extractorInfo.ExtractorCost) {
                    let block = $(marketView_inner).find(`#${product.Type}`);
                    Products[p].ExtractorInfo.ExtractorOwned = true;
                    $(marketView_inner).find("#market_empty").text("");
                    if (!marketTypeBlocks[product.Type].Visible) {
                        marketTypeBlocks[product.Type].Visible = true;
                        block.css({visibility: "visible"});
                    }
                    block.find(`#product_${p}`).css({visibility: "visible", position: "relative"});

                    buyYieldButton.css({visibility: "visible"});
                    buyRichnessButton.css({visibility: "visible"});
                    buyStorageButton.css({visibility: "visible"});

                    MainVariables.Money -= extractorInfo.ExtractorCost;

                    buyButton.text(`Owned`);
                    PlaySound("./Audio/MainClick.mp3", 0.10);
                } else {
                    PlaySound("./Audio/BadClick.mp3", 0.15);
                }
            });

            let mouseupButton = (button, upgradeName) => {
                let upgrade = extractorInfo.Upgrades[upgradeName];
                let cost = upgrade.Start * Math.max(upgrade.PriceMul**upgrade.Level, 1);
                if (MainVariables.Money >= cost) {
                    upgrade.Level++;
                    MainVariables.Extractors[p][`${upgradeName}Mul`] *= upgrade.IncMul;

                    MainVariables.Money -= cost;

                    button.text(`Upgrade ${upgradeName} ($${BeautifyNum(upgrade.Start * upgrade.PriceMul**upgrade.Level)})`);
                    PlaySound("./Audio/MainClick.mp3", 0.10);
                } else {
                    PlaySound("./Audio/BadClick.mp3", 0.15);
                }
            }

            buyYieldButton.mouseup(() => { mouseupButton(buyYieldButton, "Yield"); });
            buyRichnessButton.mouseup(() => { mouseupButton(buyRichnessButton, "Richness"); });
            buyStorageButton.mouseup(() => { mouseupButton(buyStorageButton, "Storage"); });

            extractorSplit.appendChild(extractor);
            extractorView_inner.appendChild(extractorSplit);
        }
    }

    // ***** Factories View ***** //

    {
        let factoryView_inner = document.getElementById("factoryView_inner");
        let exampleFactory = document.getElementById("exampleFactory");
        factoryView_inner.removeChild(exampleFactory);
        let craftingUITree = createUITree(MainVariables.CraftingTree, 500, 20, 100);
        for (let blockKey in craftingUITree) {
            let block = craftingUITree[blockKey];
            let crafting = Crafting[block.key];

            let factoryClone = exampleFactory.cloneNode(true);
            let jFactoryClone = $(factoryClone);
            let jFactoryBuy = jFactoryClone.find("#exampleFactory_buy");
            let jFactoryBuyButton = jFactoryClone.find("#exampleFactory_buyButton");
            let jFactoryInput = jFactoryClone.find("#exampleFactory_input");
            let jFactoryInputText = jFactoryClone.find("#exampleFactory_input_text");
            let jFactoryImport = jFactoryClone.find("#exampleFactory_input_import");
            let jFactoryImportButton = jFactoryClone.find("#exampleFactory_input_importButton");
            let jFactoryMain = jFactoryClone.find("#exampleFactory_main");
            let jFactoryOutput = jFactoryClone.find("#exampleFactory_output");
            let jFactoryOutputText = jFactoryClone.find("#exampleFactory_output_text");

            jFactoryClone.attr("id", `${block.key}Factory`);
            jFactoryBuy.attr("id", `${block.key}Factory_buy`);
            jFactoryBuyButton.attr("id", `${block.key}Factory_buyButton`);
            jFactoryInput.attr("id", `${block.key}Factory_input`);
            jFactoryInputText.attr("id", `${block.key}Factory_input_text`);
            jFactoryImport.attr("id", `${block.key}Factory_input_import`);
            jFactoryImportButton.attr("id", `${block.key}Factory_input_importButton`);
            jFactoryMain.attr("id", `${block.key}Factory_main`);
            jFactoryOutput.attr("id", `${block.key}Factory_output`);
            jFactoryOutputText.attr("id", `${block.key}Factory_output_text`);
            let factory = {ui: {
                head: jFactoryClone, input: jFactoryInput, inputText: jFactoryInputText, importButton: jFactoryImportButton,
                main: jFactoryMain, output: jFactoryOutput, outputText: jFactoryOutputText
            }, key: block.key};

            let inputTextStr = null;
            for (let inputKey in crafting.Inputs) {
                let input = BeautifyNum(parseFloat(crafting.Inputs[inputKey]));
                if (inputTextStr) { inputTextStr += ` : ${input}`; }
                else { inputTextStr = input; }
                inputTextStr += ` ${(Products[inputKey] || {Title: `${inputKey} AN ISSUE`}).Title || inputKey}`;
            }
            inputTextStr += " = ";
            let isFirst = true;
            for (let outputKey in crafting.Outputs) {
                let output = BeautifyNum(parseFloat(crafting.Outputs[outputKey]));
                if (!isFirst) { inputTextStr += ` : ${output}`; }
                else { isFirst = false; inputTextStr += output; }
                inputTextStr += ` ${(Products[outputKey] || {Title: `${outputKey} AN ISSUE`}).Title || outputKey}`;
            }
            jFactoryInputText.text(inputTextStr);

            jFactoryBuyButton.text(`Buy Factory ($${crafting.FactoryInfo.FactoryCost})`);
            jFactoryBuyButton.mouseup(() => {
                if (!crafting.FactoryInfo.FactoryOwned && MainVariables.Money >= crafting.FactoryInfo.FactoryCost) {
                    crafting.FactoryInfo.FactoryOwned = true;

                    for (let p in crafting.Outputs) {
                        let product = Products[p];
                        let block = $(marketView_inner).find(`#${product.Type}`);
                        $(marketView_inner).find("#market_empty").text("");
                        if (!marketTypeBlocks[product.Type].Visible) {
                            marketTypeBlocks[product.Type].Visible = true;
                            block.css({visibility: "visible"});
                        }
                        block.find(`#product_${p}`).css({visibility: "visible", position: "relative"});
                    }
                    
                    jFactoryBuyButton.css({visibility: "hidden"});
                    jFactoryInput.css({visibility: "visible"});
                    jFactoryMain.css({visibility: "visible"});
                    jFactoryOutput.css({visibility: "visible"});

                    MainVariables.Money -= crafting.FactoryInfo.FactoryCost;
                    PlaySound("./Audio/MainClick.mp3", 0.10);
                } else {
                    PlaySound("./Audio/BadClick.mp3", 0.15);
                }
            });

            jFactoryImport.mouseup(() => {
                let balanced = GetBalancedFactoryInputs(factory);
                let scale = balanced.Scale;
                let scaled = balanced.Scaled;
                let primeInput = balanced.PrimeInput;
                let primeInputN = balanced.PrimeInputN;

                if (primeInputN <= 0) { return; }
                for (let inputKey in scaled) {
                    Products[inputKey].Amount -= scaled[inputKey];
                }

                for (let outputKey in crafting.Outputs) {
                    let required = (primeInputN / primeInput) * crafting.Outputs[outputKey] * scale;
                    Products[outputKey].Amount += required;
                }

                UpdateFactories();
            });


            UI.views.factoryView.factories.push(factory);

            jFactoryClone.css({left: `${block.left}px`, top: `${block.top}px`});
            factoryView_inner.appendChild(factoryClone);
        }
    }

    // ***** Credits View ***** //

    {
        let creditsView_inner = document.getElementById("creditsView_inner");
        let exampleCreditSplit = document.getElementById("exampleCreditSplit");
        let exampleCredit = document.getElementById("exampleCredit");
        $(exampleCreditSplit).find("#exampleCreditSplit_section").empty();
        creditsView_inner.removeChild(exampleCreditSplit);
        for (let creditSplitKey in Credits) {
            let creditSplitClone = exampleCreditSplit.cloneNode(true);
            let jCreditSplitClone = $(creditSplitClone);
            let jCreditSplitSection = jCreditSplitClone.find("#exampleCreditSplit_section");
            jCreditSplitClone.find("#exampleCreditSplit_type").text(creditSplitKey);
            let heightSum = 0;
            for (let creditKey in Credits[creditSplitKey]) {
                let credit = Credits[creditSplitKey][creditKey];
                let creditClone = exampleCredit.cloneNode(true);
                let jCreditClone = $(creditClone);
                jCreditClone.text(credit);
                jCreditSplitSection.append(creditClone);
                heightSum++;
            }
            jCreditSplitSection.css({height: `${heightSum * 20}px`});
            jCreditSplitClone.css({height: `${heightSum * 20 + 36}px`});
            creditsView_inner.appendChild(creditSplitClone);
        }
    }

    // ***** Remove Other Views ***** //

    for (let key in UI.views) {
        let view = UI.views[key].view;
        if (view && key != "mainView" && view.parentElement) {
            view.parentElement.removeChild(view);
        }
    }


    // ************************** //
    // ***** Other ************** //
    // ************************** //

    // ***** Top Bar Buttons ***** //

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

    // ***** Main Button ***** //

    {
        let mainButton = $(UI.views.mainView.mainButton);
        let currentAnim = null;
        let animInfo = {duration: 1000, specialEasing: {width: "easeOutElastic"}};
        let intervalId = null;
        let toolN = 0;
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
        
        let mousedown = false;
        mainButton.mousedown(() => {
            mousedown = true;
            if (toolN == 0) {
                toolN++;
                setTimeout(() => {
                    toolN++;
                    mainButton.css({"background-image": `url("./Images/The\ Imperfect\ Tool\ ${toolN}.png")`});
                    setTimeout(() => {
                        toolN++;
                        mainButton.css({"background-image": `url("./Images/The\ Imperfect\ Tool\ ${toolN}.png")`});
                        setTimeout(() => { toolN++; }, 150);
                    }, 100);
                }, 100);
            }

            if (currentAnim) currentAnim.stop();
            if (currentAnim) currentAnim.stop();
            currentAnim = mainButton.animate({
                width: "85%",
            }, animInfo);

            PlaySound("./Audio/MainClick.mp3", 0.10);
        });

        $(document).mouseup((event) => {
            if (!mousedown) { return; }
            mousedown = false;

            if (!intervalId && toolN > 0) {
                intervalId = setInterval(() => {
                    if (toolN == 4) {
                        toolN--;
                        clearInterval(intervalId);
                        setTimeout(() => {
                            toolN--;
                            mainButton.css({"background-image": `url("./Images/The\ Imperfect\ Tool\ ${toolN}.png")`});
                            setTimeout(() => {
                                toolN--;
                                mainButton.css({"background-image": `url("./Images/The\ Imperfect\ Tool\ ${toolN}.png")`});
                                setTimeout(() => { toolN--; intervalId = null; }, 150)
                            }, 100)
                        }, 100)
                    }
                });
            }
            if (currentAnim) currentAnim.stop();
            currentAnim = mainButton.animate({
                width: "90%",
            }, animInfo);

            MainVariables.Clicks += 1;
            AddMoney(MainVariables.MoneyIncrement * MainVariables.CurrentBenefits.ClickMul);
            ShowClickText(event.clientX, event.clientY);

            PlaySound("./Audio/MainClick.mp3", 0.15);
        });
    }

    // ***** Post Processing ***** //

    MakeDraggable(UI.views.techView.view, null, $(UI.views.techView.view).find("#techView_inner")[0]);
    MakeDraggable(UI.views.marketView.view, null, $(UI.views.techView.view).find("#marketView_inner")[0]);
    MakeDraggable(UI.views.extractorView.view, "x");
    MakeDraggable(UI.views.factoryView.view, null, $(UI.views.factoryView.view).find("#factoryView_inner")[0]);

    setInterval(MainInterval, 1000 / 60); // Every 60 milliseconds
}

$(document).ready(main);
