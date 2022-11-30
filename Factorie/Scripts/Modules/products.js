
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
            YieldDifficulty: 200, // 1 / yielddifficulty = yielded per extraction, as you increase this number, you get less stuff from extracting
            Yielded: 0, // number, the amount yielded so far
            TechRequired: [], // [string], techs required to unlock this extractor type
            ExtractorCost: 45, // number, cost to buy the extractor
            ExtractorOwned: false // bool, whether or not extractor is owned
        }
    },

    CopperOre: {
        Title: "Copper Ore",
        Description: "Conductive both thermally and electrically, and doesn't weather quickly! Perfect for cabling.",
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
            YieldDifficulty: 300,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 250,
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
            YieldDifficulty: 100,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 450,
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
            YieldDifficulty: 100,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 600,
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
            YieldDifficulty: 150,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 750,
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
            YieldDifficulty: 2,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 900,
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
            YieldDifficulty: 0.5,
            Yielded: 0,
            TechRequired: [],
            ExtractorCost: 1100,
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
        FromExtractor: false
    },

    ElectronicComponent: {
        Title: "Electronic Component",
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
        FromExtractor: false
    },
    
    // Layer 3

    PCB: {
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
