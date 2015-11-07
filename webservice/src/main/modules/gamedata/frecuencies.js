'use strict';

const FRECUENCIES = {
    common: 1,
    uncommon: 2,
    rare: 3,
    extraordinary: 4,
    legendary: 5
};

const INVERSE_FRECUENCIES = {
    1: 'common',
    2: 'uncommon',
    3: 'rare',
    4: 'extraordinary',
    5: 'legendary'
};

module.exports = {
    FRECUENCIES: FRECUENCIES,
    INVERSE_FRECUENCIES: INVERSE_FRECUENCIES
};
