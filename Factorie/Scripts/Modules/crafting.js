
export let Crafting = {

    // Raw

    ["Iron Mining"]: {
        Description: "From red dust, or smooth magnetite, unto the truck and into the farlands of factories it goes.",
        Inputs: {},
        Outputs: {"Iron Ore": 1},
        TimeToCraft: 1,
        TechRequired: []
    },

    // Manufacturing

    "Iron Smelting": { // Key is title
        Description: "Cya, oxygen.", // String, description of the technique when selected
        Inputs: {"Iron Ore": 1}, // {ProductName (string): Amount (int), ...}, what is required to start crafting
        Outputs: {Iron: 1}, // {ProductName (string): Amount (int), ...}, what is produced everytime the crafting finishes
        TimeToCraft: 2, // Number, the amount of time required to produce one set of outputs
        TechRequired: ["Metallurgy"] // [TechName (string), ...], all of the techs required to use this crafting technique
    },

    "Copper Smelting": {
        Description: "Bye bye iron, sulfur, antimony, zinc, carbon, oxygen, hydrogen, aluminium, silicon, nitrogen, and arsenic.",
        Inputs: {"Copper Ore": 1},
        Outputs: {Copper: 1},
        TimeToCraft: 3,
        TechRequired: ["Metallurgy"]
    },

    "Steam Cracking & Polymerisation": {
        Description: "Take those nasty oils, fa- I mean gases, water, do a bunch of chemical wizardry, and now you have plastic!",
        Inputs: {Water: 3, Gas: 2, Oil: 1},
        Outputs: {Plastic: 10},
        TimeToCraft: 5,
        TechRequired: ["Chemistry"]
    },

    "Basic Mineral Filtering": {
        Description: "\"Break those rocks down!\" -- manager on a lawn chair.",
        Inputs: {Minerals: 6},
        Outputs: {Metals: 2, Rock: 3, Silicon: 1},
        TimeToCraft: 4,
        TechRequired: ["Minerals"]
    },

    "Steel Making": {
        Description: "Cya, carbon. Hello, chromium.",
        Inputs: {Metals: 1, Iron: 3, Coal: 1},
        Outputs: {Steel: 4},
        TimeToCraft: 6,
        TechRequired: ["Metallurgy 2"]
    },

    "Electronic Components Manufacturing": {
        Description: "Melt the zinc, the tin, the lead, the iron and the copper together! Fuse in that order! You have created so many components.",
        Inputs: {Iron: 1, Copper: 3, Metals: 2},
        Outputs: {"Electronic Component": 60},
        TimeToCraft: 8,
        TechRequired: ["Electronics"]
    },

    "PCB Manufacturing": {
        Description: "The magic of photolithography to create miniature silicon patterns! -- END SCRIPT -- Did I say it right? Photolithography? What a mouthful. Can I leave yet?",
        Inputs: {Iron: 1, Copper: 2, Plastic: 1, "Electronic Component": 40},
        Outputs: {PCB: 1},
        TimeToCraft: 5,
        TechRequired: ["Electronics"]
    }
};
