
/*
List of requirements:
- Clicks (number): how many clicks the user has produced this transcendence (e.g. 1000)
- ClicksPerSec (number): how many clicks the user has produced in a second
- FactorieOwned (string): key of the product factorie (e.g. "Iron" or "ElectronicComponent")
- ExtractorOwned (string): key of the product extractor (e.g. "IronOre" or "Coal" or "Gas")
- Money (number): how much money the player currently has (e.g. 1000)
- TotalMoney (number): how much money the player has earnt over the current transcendence (e.g. 100.32)
*/

export let Achievements = {
    ScrapMetal: {
        Title: "Scrap Metal", // String (not required), default is the key, this is the title displayed
        Description: "You just love picking up scrap metal, don't you? You're never going anywhere. Cheapo.", // String, description displayed when achieved
        Requirements: {TotalMoney: 1}, // List of requirements to get this achievement
    },

    FirstExtractor: {
        Title: "Your First Extractor!",
        Description: "So you were so lazy with picking up scrap metal, that you made a robot to do it for you? Pathetic.",
        Requirements: {ExtractorOwned: "IronOre"}
    },

    FirstFactorie: {
        Title: "Your First Factorie!",
        Description: "Learn how to spell. Loser woser.",
        Requirements: {FactorieOwned: "Iron"}
    },

    AFewClicks: {
        Title: "A Few Clicks",
        Description: "\"Bro my game is better than yours.\" -- Guy. I feel like this could be controversial.",
        Requirements: {Clicks: 1000}
    },

    MoreClicks: {
        Title: "A Few More Clicks",
        Description: "\"Do YOU own a bugatti?\" -- Guy, without a bugatti",
        Requirements: {Clicks: 10000}
    },

    ManyClicks: {
        Title: "Many More Clicks",
        Description: "\"I've got a lambo, I lift bricks bro.\" -- Guy, who has never worked in his life nor has a 'lambo'",
        Requirements: {Clicks: 25000}
    },

    SeriousClicks: {
        Title: "Serious Clicking Powah!",
        Description: "\"My company made $2.7m last quarter bro\" -- Guy, unaware that 'm' means 'milli', not 'million'",
        Requirements: {Clicks: 50000}
    },

    SRSClicks: {
        Title: "SRS CL1CKZZZ",
        Description: "\"Bro stocks are where it's at\" -- Guy, at a 78% loss in value out of his initial investment of $10000, which is all he had",
        Requirements: {Clicks: 100000}
    },

    Autoclicker: {
        Title: "Autoclicker Lovah",
        Description: "\"Normal people don't click this many times in a second.\" -- Developer, who autoclicks",
        Requirements: {ClicksPerSec: 30}
    }
}