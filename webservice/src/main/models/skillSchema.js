'use strict';

module.exports = function (mongoose) {
    var SkillSchema = mongoose.Schema({
        id: String,
        name: String,
        element: {type: String, default: null},
        'class': {type: String, default: null}, //bladed, blunt, piercing
        level: Number, // Es el nivel del tostem
        source: String, // weapon, armor
        target_number: Number,
        uses: {type: Number, default: null},
        duration: {type: Number, default: null},
        cost: Number,
        stats: {
            life: {type: Number, default: null},
            fury: {type: Number, default: null},
            damage: {type: Number, default: null},
            damage_formula: {type: String, default: null},
            precision: {type: Number, default: null},
            precision_formula: {type: String, default: null},
            protection: {type: Number, default: null},
            protection_formula: {type: String, default: null},
            parry: {type: Number, default: null},
            parry_formula: {type: String, default: null}
        },
        blocked: {type: Boolean, default: false},
        action: String
    }, {versionKey: false});

    return SkillSchema;
};
