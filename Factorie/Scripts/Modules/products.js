
export let Products = {
    Mud: { // Key is title
        Description: "The beginning of something great.", // String, description of product when selected
        Prices: {
            Middle: 0.1, // Number, the general average value of the product
            Variance: 0.3, // Number, every market tick, the price will change by a percentage of variance which gets smaller as you deviate from the 'Middle', and bigger as you approach the 'Middle'
        },
        Amount: 0, // Int, how many of the product the player owns
    }
};
