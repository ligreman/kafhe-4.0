'use strict';

const CLASSES = [
    'bladed',
    'blunt',
    'piercing'
];

const BASE_STATS = {
    damage: 25,
    precision: 25
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
        {text: {m: 'abrasador', f: 'abrasadora'}},
        {text: {m: 'explosivo', f: 'explosiva'}},
        {text: {m: 'flamígero', f: 'flamígera'}},
        {text: {m: 'ígneo', f: 'ígnea'}},
        {text: {m: 'mortífero', f: 'mortífera'}},
        {text: {m: 'intimidante', f: 'intimidante'}},
        {text: {m: 'inflamable', f: 'inflamable'}},
        {text: {m: 'infernal', f: 'infernal'}}
    ],
    water: [
        {text: {m: 'de agua', f: 'de agua'}},
        {text: {m: 'de hielo', f: 'de hielo'}},
        {text: {m: 'místico', f: 'mística'}},
        {text: {m: 'sopero', f: 'sopera'}},
        {text: {m: 'anticlima', f: 'anticlima'}},
        {text: {m: 'arco iris', f: 'arco iris'}},
        {text: {m: 'fundido', f: 'fundida'}},
        {text: {m: 'de lapislázuli', f: 'de lapislázuli'}},
        {text: {m: 'ilusorio', f: 'ilusoria'}}

    ],
    earth: [
        {text: {m: 'de tierra', f: 'de tierra'}},
        {text: {m: 'de plomo', f: 'de plomo'}},
        {text: {m: 'de mierda', f: 'de mierda'}},
        {text: {m: 'cromático', f: 'cromática'}},
        {text: {m: 'de polvo', f: 'de polvo'}},
        {text: {m: 'terráqueo', f: 'terráquea'}},
        {text: {m: 'rancio', f: 'rancia'}},
        {text: {m: 'empíreo', f: 'empírea'}},
        {text: {m: 'magro', f: 'magra'}}
    ],
    air: [
        {text: {m: 'de aire', f: 'de aire'}},
        {text: {m: 'de biruji', f: 'de biruji'}},
        {text: {m: 'de protones', f: 'de protones'}},
        {text: {m: 'de los tifones', f: 'de los tifones'}},
        {text: {m: 'de las tempestades', f: 'de las tempestades'}},
        {text: {m: 'soplador', f: 'sopladora'}},
        {text: {m: 'atmosférico', f: 'atmosférica'}},
        {text: {m: 'trifásico', f: 'trifásica'}},
        {text: {m: 'sónico', f: 'sónica'}}
    ],
    adjetives: [
        {text: {m: 'de cortar el pan', f: 'de cortar el pan'}},
        {text: {m: 'de untar', f: 'de untar'}},
        {text: {m: 'de la hostia', f: 'de la hostia'}},
        {text: {m: 'de juguete', f: 'de juguete'}},
        {text: {m: 'delgado', f: 'delgada'}},
        {text: {m: 'fino', f: 'fina'}},
        {text: {m: 'cutre', f: 'cutre'}},
        {text: {m: 'punzante', f: 'punzante'}},
        {text: {m: 'romo', f: 'roma'}},
        {text: {m: 'viperino', f: 'viperina'}},
        {text: {m: 'excelso', f: 'excelsa'}},
        {text: {m: 'a pilas', f: 'a pilas'}},
        {text: {m: 'sanguinolento', f: 'sanguinolenta'}},
        {text: {m: 'irritante', f: 'irritante'}},
        {text: {m: 'guay', f: 'guay'}},
        {text: {m: 'maleable', f: 'maleable'}},
        {text: {m: 'de conocimiento', f: 'de conocimiento'}},
        {text: {m: 'de poder', f: 'de poder'}},
        {text: {m: 'bestial', f: 'bestial'}},
        {text: {m: 'vil', f: 'vil'}},
        {text: {m: 'retorcido', f: 'retorcida'}},
        {text: {m: 'mellado', f: 'mellada'}},
        {text: {m: 'del tueste', f: 'del tueste'}},
        {text: {m: 'falso', f: 'falsa'}},
        {text: {m: 'simpático', f: 'simpática'}},
        {text: {m: 'irrisorio', f: 'irrisoria'}},
        {text: {m: 'indeleble', f: 'indeleble'}},
        {text: {m: 'severo', f: 'severa'}},
        {text: {m: 'prohibido', f: 'prohibida'}}
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
