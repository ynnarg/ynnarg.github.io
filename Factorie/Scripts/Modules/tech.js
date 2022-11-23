
/*
List of benefits:
- SellPriceMul: Multiplier on sell price of items produced
*/

export let Tech = {
    Factorie: {
        Description: "Hot, humid, full of overworked factory workers, and useless managers", // String, description seen when tech is selected
        Benefits: {}, // A dictionary of benefits
        Precursors: [], // String, an array of precursor techs to be unlocked before this one
        Cost: 1, // Number, cost to start unlocking
        TimeToUnlock: 5, // Number, amount of time for tech to completely be unlocked after the player clicks the tech
        Unlocked: false, // Bool, whether or not this tech is currently unlocked.
    },

    Metallurgy: {
        Description: "Anything that even barely has a metal in it involves this somehow.                                yep.",
        Benefits: {},
        Precursors: [],
        Cost: 50,
        TimeToUnlock: 20,
        Unlocked: false,
    },

    Chemistry: {
        Description: "Xe + N(anything else) -> Xe",
        Benefits: {},
        Precursors: [],
        Cost: 50,
        TimeToUnlock: 30,
        Unlocked: false,
    },

    Minerals: {
        Description: "Mineralology. I can say what I want.",
        Benefits: {},
        Precursors: [],
        Cost: 50,
        TimeToUnlock: 30,
        Unlocked: false
    },

    Automation: {
        Description: "\"I said it, I said it, manual labour is the way! Automation will ruin our society!\" -- Don't believe them.",
        Benefits: {},
        Precursors: ["Factorie"],
        Cost: 85,
        TimeToUnlock: 30,
        Unlocked: false,
    },

    Electronics: {
        Description: "'Poof, poof, poof', the wizard bravingly said as he programmed with his punch cards.              '... Oops...', the wizard quietly exclaimed.",
        Benefits: {},
        Precursors: ["Automation"],
        Cost: 125,
        TimeToUnlock: 35,
        Unlocked: false
    }
};
