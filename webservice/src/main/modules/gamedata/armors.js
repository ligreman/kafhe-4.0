'use strict';

var CLASSES = [
    'light',
    'medium',
    'heavy'
];

var BASE_STATS = {
    protection: 10,
    parry: 15
};

var CLASS_NAMES = {
    light: [
        {text: 'Espada', gender: 'f'},
        {text: 'Machete', gender: 'm'},
        {text: 'Cuchillo de cocina', gender: 'm'}
    ],
    medium: [],
    heavy: []
};

var FEATURE_NAMES = {
    fire: [
        {text: {m: 'hipercalórico', f: 'hipercalórica'}},
        {text: {m: 'devastador', f: 'devastadora'}},
        {text: {m: 'carmesí', f: 'carmesí'}},
        {text: {m: 'meteórico', f: 'meteórica'}},
        {text: {m: 'refulgente', f: 'refulgente'}},
        {text: {m: 'iracundo', f: 'iracunda'}},
        {text: {m: 'incandescente', f: 'incandescente'}},
        {text: {m: 'calcinado', f: 'calcinada'}}
    ],
    water: [
        {text: {m: 'acrílico', f: 'acrílica'}},
        {text: {m: 'reflectante', f: 'reflectante'}},
        {text: {m: 'catarata', f: 'catarata'}},
        {text: {m: 'milagroso', f: 'milagrosa'}},
        {text: {m: 'aquático', f: 'aquática'}},
        {text: {m: 'fluído', f: 'fluída'}},
        {text: {m: 'líquido', f: 'líquida'}},
        {text: {m: 'jugoso', f: 'jugosa'}}
    ],
    earth: [
        {text: {m: 'plástificado', f: 'plástificada'}},
        {text: {m: 'de látex', f: 'de látex'}},
        {text: {m: 'recauchutado', f: 'recauchutada'}},
        {text: {m: 'pajizo', f: 'pajiza'}},
        {text: {m: 'papiráceo', f: 'papirácea'}},
        {text: {m: 'de celofán', f: 'de celofán'}},
        {text: {m: 'protector', f: 'protectora'}},
        {text: {m: 'absorbente', f: 'absorbente'}}

    ],
    air: [
        {text: {m: 'aislante', f: 'aislante'}},
        {text: {m: 'impermeable', f: 'impermeable'}},
        {text: {m: 'eléctrico', f: 'eléctrica'}},
        {text: {m: 'eólico', f: 'eólica'}},
        {text: {m: 'etéreo', f: 'etérea'}},
        {text: {m: 'onírico', f: 'onírica'}},
        {text: {m: 'de los cielos', f: 'de los cielos'}},
        {text: {m: 'ventoso', f: 'ventosa'}}
    ],
    adjetives: [
        {text: {m: 'superchulo', f: 'superchula'}},
        {text: {m: 'estúpido', f: 'estúpida'}},
        {text: {m: 'apoteósico', f: 'apoteósica'}},
        {text: {m: 'de verano', f: 'de verano'}},
        {text: {m: 'de otoño', f: 'de otoño'}},
        {text: {m: 'de invierno', f: 'de invierno'}},
        {text: {m: 'de primavera', f: 'de primavera'}},
        {text: {m: 'de pega', f: 'de pega'}},
        {text: {m: 'sobrenatural', f: 'sobrenatural'}},
        {text: {m: 'voluptuoso', f: 'voluptuosa'}},
        {text: {m: 'centelleante', f: 'centelleante'}},
        {text: {m: 'sexy', f: 'sexy'}},
        {text: {m: 'heroíco', f: 'heroíca'}},
        {text: {m: 'espantoso', f: 'espantosa'}},
        {text: {m: 'épico', f: 'épica'}},
        {text: {m: 'colosal', f: 'colosal'}},
        {text: {m: 'cósmico', f: 'cósmica'}},
        {text: {m: 'repelente', f: 'repelente'}},
        {text: {m: 'indecente', f: 'indecente'}},
        {text: {m: 'rutilante', f: 'rutilante'}},
        {text: {m: 'deleznable', f: 'deleznable'}},
        {text: {m: 'infausto', f: 'infausta'}},
        {text: {m: 'abyecto', f: 'abyecta'}},
        {text: {m: 'ornamentado', f: 'ornamentada'}},
        {text: {m: 'floreado', f: 'floreada'}},
        {text: {m: 'tétrico', f: 'tétrica'}},
        {text: {m: 'maquiavélico', f: 'maquiavélica'}},
        {text: {m: 'decisivo', f: 'decisiva'}},
        {text: {m: 'oculto', f: 'oculta'}}
    ]
};

var OWNER_NAMES = {
    common: [
        {text: 'de Kafhe'},
        {text: 'de Achikhoria'},
        {text: 'de Têh'}
    ],
    uncommon: [],
    rare: [],
    extraordinary: []
};

var LEGEND_NAMES = {
    fire: [
        {text: ""}
    ],
    water: [
        {text: ""}
    ],
    earth: [
        {text: ""}
    ],
    air: [
        {text: ""}
    ]
};

module.exports = {
    CLASSES: CLASSES,
    BASE_STATS: BASE_STATS,
    CLASS_NAMES: CLASS_NAMES,
    FEATURE_NAMES: FEATURE_NAMES,
    OWNER_NAMES: OWNER_NAMES,
    LEGEND_NAMES: LEGEND_NAMES
};
