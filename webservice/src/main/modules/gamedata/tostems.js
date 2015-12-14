'use strict';

var ELEMENTS = [
    'fire',
    'water',
    'earth',
    'air'
];

var DAMAGES = {
    fire: {
        fire: 100,
        water: 85,
        earth: 100,
        air: 115
    },
    water: {
        fire: 115,
        water: 100,
        earth: 85,
        air: 100
    },
    earth: {
        fire: 100,
        water: 115,
        earth: 100,
        air: 85
    },
    air: {
        fire: 85,
        water: 100,
        earth: 115,
        air: 100
    }
};

module.exports = {
    ELEMENTS: ELEMENTS,
    ELEMENT_DAMAGE: DAMAGES
};
