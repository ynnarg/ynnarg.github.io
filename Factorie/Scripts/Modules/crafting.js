
export let Crafting = {
    "From thick ground": { // Key is title
        Description: "It all comes from somewhere.", // String, description of the technique when selected
        Inputs: {}, // {ProductName (string): Amount (int), ...}, what is required to start crafting
        Outputs: {"Mud": 1}, // {ProductName (string): Amount (int), ...}, what is produced everytime the crafting finishes
        TimeToCraft: 2, // Number, the amount of time required to produce one set of outputs
        TechRequired: [], // [TechName (string), ...], all of the techs required to use this crafting technique
        CanBeDoneManually: true, // Bool, whether or not this technique can be done by hand
        CanBeDoneAutomatically: false, // Bool, whether or not this technique can be done by factories
    }
};
