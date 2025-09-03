import wizardReducer from 'reducers/wizard';
const { ACTION_TYPES: TYPES } = wizardReducer;

export default {
    TYPES: TYPES,

    changeCurrentPage: function (currentPage) {
        return {
            type: TYPES.CHANGE_WIZARD_PAGE,
            currentPage
        };
    },

    goToNextPage: function (data, brandName, skuId, labValue) {
        return {
            type: TYPES.NEXT_WIZARD_PAGE,
            dataItem: data || {},
            brandName,
            skuId,
            labValue
        };
    },

    goToPreviousPage: function () {
        return { type: TYPES.PREVIOUS_WIZARD_PAGE };
    },

    setCurrentDataItem: function (data) {
        return {
            type: TYPES.SET_WIZARD_CURRENT_DATA_ITEM,
            dataItem: data || {}
        };
    },

    clearDataItem: function () {
        return { type: TYPES.CLEAR_WIZARD_DATA_ITEM };
    },

    setResult: function (data) {
        return {
            type: TYPES.SET_WIZARD_RESULT,
            data
        };
    },

    saveColorIQ: function (hexShadeCode, shade, desc) {
        return {
            type: TYPES.SAVE_COLOR_IQ,
            payload: {
                hexShadeCode,
                shade,
                desc
            }
        };
    },

    clearResult: function () {
        return { type: TYPES.CLEAR_WIZARD_RESULT };
    }
};
