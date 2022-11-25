
export let Products = {
    // Extracted

    "Iron Ore": { // Key is title
        Description: "The beginning of something great.", // String, description of product when selected
        Prices: { // Dictionary, contains information about the price of the product
            Middle: 3, // Number, the general average value of the product
            Variance: 0.3, // Number, every market tick, the price will change by a percentage of variance which gets smaller as you deviate from the 'Middle', and bigger as you approach the 'Middle'
        },
        Amount: 0, // Int, how many of the product the player owns
        FromExtractor: true, // Bool, whether or not this product *can* come from an extractor
        ExtractorInfo: { // Optional (required if 'FromExtractor' is true) dictionary, contains information about extracting this resource
            Yield: 1e21, // min(yield / yielded, 1) = current yield, basically as you yield more, the current yield used by the extractors lowers. A yield <= 0 will be infinite.
            YieldDifficulty: 2 // 1 / yielddifficulty = yielded / extraction, as you increase this number, you get less stuff from extracting.
        }
    },

    "Copper Ore": {
        Description: "Conductive both thermally and electrically, and doesn't weather quickly! Perfect for cabling.",
        Prices: {
            Middle: 5,
            Variance: 0.2,
        },
        Amount: 0,
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e20,
            YieldDifficulty: 3
        }
    },

    Coal: {
        Description: "Burn, burn, burn! CO2! CO!",
        Prices: {
            Middle: 1,
            Variance: 0.15,
        },
        Amount: 0,
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e15,
        }
    },

    Oil: {
        Description: "Glad these petro-dollars aren't going to some sand nation. They're going to you! You non-tax paying freak.",
        Prices: {
            Middle: 15,
            Variance: 0.5,
        },
        Amount: 0,
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e17,
        }
    },

    Gas: {
        Description: "No, not farts. Natural gas! Also not farts. Really good for heating and oil-related products.",
        Prices: {
            Middle: 12,
            Variance: 0.35,
        },
        Amount: 0,
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e18,
        }
    },

    Minerals: {
        Description: "Destroying the environment for that sweet, sweet rock! You can get pretty much every other raw material from this with enough processing.",
        Prices: {
            Middle: 7,
            Variance: 0.05,
        },
        Amount: 0,
        FromExtractor: true,
        ExtractorInfo: {
            Yield: 1e28
        }
    },

    Water: {
        Description: "Nice, H2O. We'll just ignore all the processing that goes behind getting pure H2O, this isn't modded Factorio.",
        Prices: {
            Middle: 2,
            Variance: 0.02,
        },
        FromExtractor: true,
        ExtractorInfo: {
            Yield: -1
        }
    },


    // Manufactured

    Iron: {
        Description: "The new age, the iron age.",
        Prices: {
            Middle: 10,
            Variance: 0.07,
        },
        Amount: 0,
        FromExtractor: false
    },

    Copper: {
        Description: "The new age, the electronic age. Wait no, that's silicon. Woops!",
        Prices: {
            Middle: 12,
            Variance: 0.06,
        },
        Amount: 0,
        FromExtractor: false
    },

    Plastics: {
        Description: "Polyethylene. Long chains of HCH that can become incredibly strong.",
        Prices: {
            Middle: 2,
            Variance: 0.7,
        },
        Amount: 0,
        FromExtractor: false
    },

    Metals: {
        Description: "Whatever you want. Silver. Gold. Tin. Lead. Anything!",
        Prices: {
            Middle: 20,
            Variance: 0.2,
        },
        Amount: 0,
        FromExtractor: false
    },

    Rock: {
        Description: "From the minerals comes rock. What is rock?",
        Prices: {
            Middle: 5,
            Variance: 0.04,
        },
        Amount: 0,
        FromExtractor: false
    },

    Silicon: {
        Description: "The new age, the electronic age. GOT IT RIGHT THIS TIME.",
        Prices: {
            Middle: 16,
            Variance: 0.3,
        },
        Amount: 0,
        FromExtractor: false
    },

    Steel: {
        Description: "Straight from the skyforge!",
        Prices: {
            Middle: 20,
            Variance: 0.2,
        },
        Amount: 0,
        FromExtractor: false
    },

    "Electronic Component": {
        Description: "Capacitors, resistors, batteries, etc... (+4.8Kb of data left)",
        Prices: {
            Middle: 20,
            Variance: 0.1,
        },
        Amount: 0,
        FromExtractor: false
    },

    Concrete: {
        Description: "The most widely used material behind water. Big industry on this one, bucko.",
        Prices: {
            Middle: 0.5,
            Variance: 0.4,
        },
        Amount: 0,
        FromExtractor: false
    },

    PCB: {
        Description: "(P)rinted (C)ircuit (B)oard. (s)",
        Prices: {
            Middle: 45,
            Variance: 0.3,
        },
        Amount: 0,
        FromExtractor: false
    }
};
