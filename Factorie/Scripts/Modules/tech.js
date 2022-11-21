
/*
List of benefits:
- SellPriceMul: Multiplier on sell price of items produced
*/

export let Tech = {
    Factorie: {
        Description: "Hot, humid, full of overworked factory workers, and useless managers", // String, description seen when tech is selected
        Benefits: {}, // A dictionary of benefits
        Precursors: [], // An array of precursor techs to be unlocked before this one
        Cost: 1, // Number, cost to start unlocking
        TimeToUnlock: 5, // Amount of time for tech to completely be unlocked after the player clicks the tech
        Unlocked: false,
    },
    Automation: {
        Description: "\"I said it, I said it, manual labour is the way! Automation will ruin our society!\" -- Don't believe them.",
        Benefits: {},
        Prevursors: ["Factorie"],
        Cost: 25,
        TimeToUnlock: 15,
        Unlocked: false,
    },
};
