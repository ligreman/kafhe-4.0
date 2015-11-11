'use strict';

const CLASSES = [
    'bladed',
    'blunt',
    'piercing'
];

const BASE_STATS = {
    damage: 25,
    precision: 25,
    protection: 10,
    parry: 15
};

const CLASS_NAMES = {
    bladed: [
        {text: 'Espada', gender: 'f'},
        {text: 'Machete', gender: 'm'},
        {text: 'Cuchillo de cocina', gender: 'm'}
    ],
    blunt: [],
    piercing: []
};

const FEATURE_NAMES = {
    fire: [
        {text: {m: 'de fuego', f: 'de fuego'}},
        {text: {m: 'abrasador', f: 'abrasadora'}}
    ],
    water: [
        {text: {m: 'de agua', f: 'de agua'}}
    ],
    earth: [
        {text: {m: 'de tierra', f: 'de tierra'}}
    ],
    air: [
        {text: {m: 'de aire', f: 'de aire'}}
    ]
};

const OWNER_NAMES = {
    common: [
        {text: 'de Kafhe'},
        {text: 'de Achikhoria'},
        {text: 'de Têh'}
    ],
    lengendary: []
};


module.exports = {
    CLASSES: CLASSES,
    BASE_STATS: BASE_STATS,
    CLASS_NAMES: CLASS_NAMES,
    FEATURE_NAMES: FEATURE_NAMES,
    OWNER_NAMES: OWNER_NAMES
};
