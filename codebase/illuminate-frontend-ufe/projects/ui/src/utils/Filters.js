import biUtils from 'utils/BiProfile';
import localeUtils from 'utils/LanguageLocale';

const REVIEW_FILTERS_TYPES = {
    SKU: 'SKU',
    CUSTOM: 'CUSTOM',
    EXTERNAL: 'EXTERNAL',
    INTERNAL: 'INTERNAL',
    SORT: 'SORT',
    ALL: 'ALL'
};

const QUESTIONS_SORT_TYPES = [
    {
        key: 'most_answers',
        value: 'TotalAnswerCount:desc',
        name: 'mostAnswers'
    },
    {
        key: 'most_recent_questions',
        value: 'SubmissionTime:desc',
        name: 'mostRecentQuestions'
    },
    {
        key: 'most_recent_answers',
        value: 'LastApprovedAnswerSubmissionTime:desc',
        name: 'mostRecentAnswers'
    },
    {
        key: 'oldest_questions',
        value: 'SubmissionTime:asc',
        name: 'oldestQuestions'
    }
];

const getFilterObj = type => {
    const getText = localeUtils.getLocaleResourceFile('utils/locales/Filters', 'Filters');

    switch (type) {
        case biUtils.TYPES.EYE_COLOR:
            return {
                label: getText('eyeColor'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 8,
                values: [getText('blue'), getText('brown'), getText('green'), getText('gray'), getText('hazel')],
                hasImages: true,
                bvValues: ['blue', 'brown', 'green', 'gray', 'hazel'],
                bvName: 'eyeColor'
            };
        case biUtils.TYPES.HAIR_COLOR:
            return {
                label: getText('hairColor'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 10,
                values: [getText('blonde'), getText('brunette'), getText('auburn'), getText('black'), getText('red'), getText('gray')],
                hasImages: true,
                bvValues: ['blonde', 'brunette', 'auburn', 'black', 'red', 'gray'],
                bvName: 'hairColor'
            };
        case biUtils.TYPES.SKIN_TONE:
            return {
                label: getText('skinTone'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 6,
                values: [
                    getText('porcelain'),
                    getText('fair'),
                    getText('light'),
                    getText('medium'),
                    getText('tan'),
                    getText('olive'),
                    getText('deep'),
                    getText('dark'),
                    getText('ebony')
                ],
                hasImages: true,
                bvValues: ['porcelain', 'fair', 'light', 'medium', 'tan', 'olive', 'deep', 'dark', 'ebony'],
                bvName: 'skinTone'
            };
        case biUtils.TYPES.SKIN_TYPE:
            return {
                label: getText('skinType'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 5,
                values: [getText('normal'), getText('combination'), getText('dry'), getText('oily')],
                bvValues: ['normal', 'combination', 'dry', 'oily'],
                bvName: 'skinType'
            };
        case biUtils.TYPES.SKIN_CONCERNS:
            return {
                label: getText('skinConcerns'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 7,
                values: [
                    getText('acne'),
                    getText('aging'),
                    getText('blackheads'),
                    getText('calluses'),
                    getText('cellulite'),
                    getText('cuticles'),
                    getText('darkCircles'),
                    getText('dullness'),
                    getText('redness'),
                    getText('sensitivity'),
                    getText('stretchMarks'),
                    getText('sunDamage'),
                    getText('unevenSkinTones')
                ],
                bvValues: [
                    'acne',
                    'aging',
                    'blackheads',
                    'calluses',
                    'cellulite',
                    'cuticles',
                    'darkCircles',
                    'dullness',
                    'redness',
                    'sensitivity',
                    'stretchMarks',
                    'sunDamage',
                    'unevenSkinTones'
                ],
                bvName: 'skinConcerns'
            };
        case biUtils.TYPES.HAIR_DESCRIBE:
            return {
                label: getText('hairType'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 9,
                values: [
                    getText('chemicallyTreated'),
                    getText('coarse'),
                    getText('curly'),
                    getText('dry'),
                    getText('fine'),
                    getText('normal'),
                    getText('oily'),
                    getText('straight'),
                    getText('wavy')
                ],
                bvValues: ['chemicallyTreated', 'coarse', 'curly', 'dry', 'fine', 'normal', 'oily', 'straight', 'wavy'],
                bvName: 'hairCondition'
            };
        case biUtils.TYPES.HAIR_CONCERNS:
            return {
                label: getText('hairConcerns'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 11,
                values: [
                    getText('antiAging'),
                    getText('colorProtection'),
                    getText('curlEnhancing'),
                    getText('damaged'),
                    getText('dandruff'),
                    getText('frizz'),
                    getText('heatProtection'),
                    getText('hold'),
                    getText('oiliness'),
                    getText('shine'),
                    getText('straighteningSmoothing'),
                    getText('thinning'),
                    getText('volumizing')
                ],
                bvValues: [
                    'AntiAging',
                    'ColorProtection',
                    'CurlyEnhancing',
                    'Damage',
                    'Dandruff',
                    'Frizz',
                    'HeatProtection',
                    'Hold',
                    'Oiliness',
                    'Shine',
                    'StraighteningSmoothing',
                    'Thinning',
                    'Volumizing'
                ],
                bvName: 'hairConcerns'
            };
        case biUtils.TYPES.AGE_RANGE:
            return {
                label: getText('ageRange'),
                type: REVIEW_FILTERS_TYPES.INTERNAL,
                order: 12,
                values: ['13-17', '18-24', '25-34', '35-44', '45-54', 'Over 54'],
                bvValues: ['13to17', '18to24', '25to34', '35to44', '45to54', 'over54'],
                bvName: 'age'
            };
        case 'reviewContent':
            return {
                label: getText('content'),
                type: REVIEW_FILTERS_TYPES.EXTERNAL,
                order: 13,
                values: [getText('photos'), getText('video')]
            };
        case 'verifiedPurchases':
            return {
                label: getText('verifiedPurchases'), //'Verified Purchaser',
                type: REVIEW_FILTERS_TYPES.EXTERNAL,
                order: 2,
                values: [true],
                bvValues: [true],
                bvName: 'VerifiedPurchaser'
            };
        case 'rating':
            return {
                label: getText('rating'),
                type: REVIEW_FILTERS_TYPES.EXTERNAL,
                order: 1,
                values: ['5', '4', '3', '2', '1'],
                bvValues: ['eq:5', 'eq:4', 'eq:3', 'eq:2', 'eq:1'],
                bvName: 'Rating'
            };
        default:
            return {};
    }
};

const getReviewFilters = () => {
    const reviewFilters = {};
    Object.keys(biUtils.TYPES).forEach(key => {
        reviewFilters[biUtils.TYPES[key]] = getFilterObj(biUtils.TYPES[key]);
    });

    return reviewFilters;
};

const filters = {
    REVIEW_FILTERS: {
        ...getReviewFilters(),
        rating: getFilterObj('rating'),
        reviewContent: getFilterObj('reviewContent'),
        verifiedPurchases: getFilterObj('verifiedPurchases')
    },

    QUESTIONS_SORT_TYPES: QUESTIONS_SORT_TYPES,

    REVIEW_FILTERS_TYPES: REVIEW_FILTERS_TYPES,

    getBVValues: function (name, values, isBeautyPreference) {
        const bvValue = [];
        const inputValues = Array.isArray(values) ? values : values.split(', ');

        inputValues.forEach(item => {
            const value = isBeautyPreference ? item.value : item;
            const valueIndex = filters.REVIEW_FILTERS[name].values.indexOf(value);

            if (valueIndex >= 0) {
                bvValue.push(filters.REVIEW_FILTERS[name].bvValues[valueIndex]);
            }
        });

        return bvValue.join(',');
    },

    getDescription: function (sku) {
        return `${sku.variationValue || ''} ${sku.variationDesc ? `- ${sku.variationDesc}` : ''}`;
    },

    isVerifiedPurchaser: function (badges) {
        if (badges) {
            const filteredBadges = badges.filter(badge => badge.toLowerCase() === 'verifiedpurchaser');

            return filteredBadges.length > 0;
        } else {
            return false;
        }
    }
};

export default filters;
