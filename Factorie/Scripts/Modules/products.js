
export let TypeTitles = {
    RawMaterials: "Raw Materials"
}

export let Products = {
    // Extracted (Layer 1)

    IronOre: { // Key is title
        Title: "Iron Ore", // If there's a space in the key, the title has to be put here
        Description: "The beginning of something great.", // String, description of product when selected
        Prices: { // Dictionary, contains information about the price of the product
            Middle: 3, // Number, the general average value of the product
            Variance: 0.3, // Number, every market tick, the price will change by a percentage of variance which gets smaller as you deviate from the 'Middle', and bigger as you approach the 'Middle'
        },
        Amount: 0, // Number, how many of the product the player owns
        MaxAmount: 1, // Number, the maximum amount the player can own
        Type: "RawMaterials", // String, the type of product
        Unit: "Kilograms", // String (not required), the unit for the product. Default is 'Units' if not provided
        FromExtractor: true, // Bool, whether or not this product *can* come from an extractor
        ExtractorInfo: { // Optional (required if 'FromExtractor' is true) dictionary, contains information about extracting this resource
            Yield: 1e21, // min(yield / yielded, 1) = current yield, basically as you yield more, the current yield used by the extractors lowers. A yield <= 0 will be infinite
            YieldDifficulty: 65, // 1 / yielddifficulty = yielded per extraction, as you increase this number, you get less stuff from extracting
            Yielded: 0, // number, the amount yielded so far
            TechRequired: [], // [string], techs required to unlock this extractor type
            ExtractorCost: 15, // number, cost to buy the extractor
            ExtractorBackground: "\"../../Images/The\ Perfect\ Iron\ Ore\ Extractor.png\"", // string, the background of the extractor
            Upgrades: { // dictionary of upgrades
                Yield: {Start: 500, PriceMul: 6, IncMul: 4.5, Level: 0}, // Each entry is a dictionary of a starting price, multiplication of that price each upgrade,
                Richness: {Start: 5000, PriceMul: 6, IncMul: 4.5, Level: 0}, // and the actual effect multiplier, followed by it's upgrade level, starting at 0.
                Storage: {Start: 100, PriceMul: 10.5, IncMul: 10, Level: 0}
            },
            ExtractorOwned: false, // bool, whether or not extractor is owned
        }
    },

    CopperOre: {
        Title: "Copper Ore",
        Description: "LET THAH ELECTRICITY FLOW THRU YAH",
        Prices: {
            Middle: 5,
            Variance: 0.2,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "RawMaterials",
        Unit: "Kilograms",
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e20,
            YieldDifficulty: 100,
            Yielded: 0,
            TechRequired: ["Electricity"],
            ExtractorCost: 125,
            Upgrades: {
                Yield: {Start: 2500, PriceMul: 6, IncMul: 4.5, Level: 0},
                Richness: {Start: 25000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Storage: {Start: 500, PriceMul: 10.5, IncMul: 10, Level: 0}
            },
            ExtractorOwned: false
        }
    },

    Coal: {
        Description: "Burn, burn, burn! CO2! CO!",
        Prices: {
            Middle: 1,
            Variance: 0.15,
        },
        Amount: 0,
        MaxAmount: 1,
        Unit: "Kilograms",
        Type: "RawMaterials",
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e15,
            YieldDifficulty: 50,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 250,
            Upgrades: {
                Yield: {Start: 4500, PriceMul: 6, IncMul: 4.5, Level: 0},
                Richness: {Start: 45000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Storage: {Start: 900, PriceMul: 10.5, IncMul: 10, Level: 0}
            },
            ExtractorOwned: false
        }
    },

    Oil: {
        Description: "Glad these petro-dollars aren't going to some sand nation. They're going to you! You non-tax paying freak.",
        Prices: {
            Middle: 15,
            Variance: 0.5,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "RawMaterials",
        Unit: "Barrels",
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e17,
            YieldDifficulty: 50,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 450,
            Upgrades: {
                Yield: {Start: 6000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Richness: {Start: 60000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Storage: {Start: 1200, PriceMul: 10.5, IncMul: 10, Level: 0}
            },
            ExtractorOwned: false
        }
    },

    Gas: {
        Description: "No, not farts. Natural gas! Also not farts. Really good for heating and oil-related products.",
        Prices: {
            Middle: 12,
            Variance: 0.35,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "RawMaterials",
        Unit: "Balloons",
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e18,
            YieldDifficulty: 75,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 500,
            Upgrades: {
                Yield: {Start: 7500, PriceMul: 6, IncMul: 4.5, Level: 0},
                Richness: {Start: 75000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Storage: {Start: 1500, PriceMul: 10.5, IncMul: 10, Level: 0}
            },
            ExtractorOwned: false
        }
    },

    Minerals: {
        Description: "Destroying the environment for that sweet, sweet rock! You can get pretty much every other raw material from this with enough processing.",
        Prices: {
            Middle: 7,
            Variance: 0.05,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "RawMaterials",
        Unit: "Fractions",
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e28,
            YieldDifficulty: 100,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 600,
            Upgrades: {
                Yield: {Start: 9000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Richness: {Start: 90000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Storage: {Start: 1800, PriceMul: 10.5, IncMul: 10, Level: 0}
            },
            ExtractorOwned: false
        }
    },

    Water: {
        Description: "Nice, H2O. We'll just ignore all the processing that goes behind getting pure H2O, this isn't modded Factorio.",
        Prices: {
            Middle: 2,
            Variance: 0.02,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "RawMaterials",
        Unit: "Litres",
        FromExtractor: true,
        ExtractorInfo: {
            Yield: -1,
            YieldDifficulty: 25,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 800,
            Upgrades: {
                Yield: {Start: 11000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Richness: {Start: 110000, PriceMul: 6, IncMul: 4.5, Level: 0},
                Storage: {Start: 2200, PriceMul: 10.5, IncMul: 10, Level: 0}
            },
            ExtractorOwned: false
        }
    },


    // Manufactured (Layer 2)

    Iron: {
        Description: "The new age, the iron age.",
        Prices: {
            Middle: 10,
            Variance: 0.07,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Metals",
        Unit: "Kilograms",
        FromExtractor: false
    },

    Copper: {
        Description: "The new age, the electronic age. Wait no, that's silicon. Woops!",
        Prices: {
            Middle: 12,
            Variance: 0.06,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Metals",
        Unit: "Kilograms",
        FromExtractor: false
    },

    Plastics: {
        Description: "Polyethylene. Long chains of H-C-H that can become incredibly strong.",
        Prices: {
            Middle: 2,
            Variance: 0.7,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Others",
        Unit: "Kilograms",
        FromExtractor: false
    },

    Metals: {
        Description: "Whatever you want. Silver. Gold. Tin. Lead. Anything!",
        Prices: {
            Middle: 20,
            Variance: 0.2,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Metals",
        Unit: "Kilograms",
        FromExtractor: false
    },

    Rock: {
        Description: "From the minerals comes rock. What is rock?",
        Prices: {
            Middle: 5,
            Variance: 0.04,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Others",
        Unit: "Kilograms",
        FromExtractor: false
    },

    Silicon: {
        Description: "The new age, the electronic age. GOT IT RIGHT THIS TIME.",
        Prices: {
            Middle: 16,
            Variance: 0.3,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Electronics",
        FromExtractor: false
    },

    // Layer 2

    Steel: {
        Description: "Straight from the skyforge!",
        Prices: {
            Middle: 20,
            Variance: 0.2,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Metals",
        Unit: "Kilograms",
        FromExtractor: false
    },

    Brass: {
        Description: "10% Zinc, 90% Copper, and then whatever else you feel like putting in.",
        Prices: {
            Middle: 22,
            Variance: 0.3,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Metals",
        Unit: "Kilograms",
        FromExtractor: false
    },

    ElectronicComponents: {
        Title: "Electronic Components",
        Description: "Capacitors, resistors, batteries, etc... (+4.8Kb of data left)",
        Prices: {
            Middle: 20,
            Variance: 0.1,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Electronics",
        FromExtractor: false
    },

    Concrete: {
        Description: "The most widely used material behind water. Big industry on this one, bucko.",
        Prices: {
            Middle: 0.5,
            Variance: 0.4,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Others",
        Unit: "Kilograms",
        FromExtractor: false
    },
    
    // Layer 3

    PCBs: {
        Description: "(P)rinted (C)ircuit (B)oard. (s)",
        Prices: {
            Middle: 45,
            Variance: 0.3,
        },
        Amount: 0,
        MaxAmount: 1,
        Type: "Electronics",
        FromExtractor: false
    }
};
