
/*
List of benefits:
- SellPriceMul: Multiplier on sell price of items produced
- ClickMul: Multiplier on clicks
*/

export let Tech = {
    Market: {
        Description: "The basis of everything you do. Without the market, there would be no factories, no extractors, no technology, no game, no fun.", // String, description seen when tech is selected
        Benefits: {}, // A dictionary of benefits
        Precursors: [], // String, an array of precursor techs to be unlocked before this one
        Cost: 5, // Number, cost to start unlocking
        Unlocked: false, // Bool, whether or not this tech is currently unlocked.
    },

    Extractor: {
        Description: "A tool to take from the limited supply that you have been given from Earth.",
        Benefits: {},
        Precursors: ["Market"],
        Cost: 25,
        Unlocked: false,
    },

    Clickstractor: {
        Description: "Extract the clicks. What? You think these are unlimited? Your mouse has a lifetime, you know. Autoclicker? What's that?",
        Benefits: {ClickMul: 2},
        Precursors: ["Extractor"],
        Cost: 750,
        Unlocked: false,
    },

    Factorie: {
        Description: "Hot, humid, full of overworked factory workers, and useless managers.",
        Benefits: {},
        Precursors: ["Extractor"],
        Cost: 250,
        Unlocked: false,
    },

    Metallurgy: {
        Description: "Anything that even barely has a metal in it involves this somehow. yep.",
        Benefits: {},
        Precursors: ["Extractor"],
        Cost: 500,
        Unlocked: false,
    },

    Chemistry: {
        Description: "Xe + anything else -> Xe + anything else.",
        Benefits: {},
        Precursors: ["Extractor"],
        Cost: 500,
        Unlocked: false,
    },

    Minerals: {
        Description: "Mineralology. I can say what I want.",
        Benefits: {},
        Precursors: ["Extractor"],
        Cost: 500,
        Unlocked: false,
    },

    Extras: {
        Description: "Extra stuff. Probably not important.",
        Benefits: {},
        Precursors: ["Extractor"],
        Cost: 100,
        Unlocked: false,
    },

    Settings: {
        Description: "Bet your autoclicker annoyed you for the first few minutes. Either that or you turned off the sound in which case you didn't get to enjoy the music :-)",
        Benefits: {},
        Precursors: ["Extras"],
        Cost: 100,
        Unlocked: false,
    },

    Stats: {
        Description: "Yay! Stats! So exciting.",
        Benefits: {},
        Precursors: ["Extras"],
        Cost: 100,
        Unlocked: false,
    },

    Automation: {
        Description: "\"I said it, I said it, manual labour is the way! Automation will ruin our society!\" -- Don't believe them.",
        Benefits: {},
        Precursors: ["Factorie"],
        Cost: 850,
        Unlocked: false,
    },

    Electronics: {
        Description: "'Poof, poof, poof', the wizard said as he programmed with his punch cards. '... Oops...', the wizard quietly exclaimed.",
        Benefits: {},
        Precursors: ["Automation"],
        Cost: 1250,
        Unlocked: false
    },

    Metallurgy2: {
        Title: "Metallurgy 2",
        Description: "\"A monument of a bird whose eyes and beak were opened in flame.\"",
        Benefits: {},
        Precursors: ["Metallurgy"],
        Cost: 1250,
        Unlocked: false,
    },
};
