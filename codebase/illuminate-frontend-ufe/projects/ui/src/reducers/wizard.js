const ACTION_TYPES = {
    SHOW_WIZARD: 'SHOW_WIZARD',
    CHANGE_WIZARD_PAGE: 'CHANGE_WIZARD_PAGE',
    NEXT_WIZARD_PAGE: 'NEXT_WIZARD_PAGE',
    PREVIOUS_WIZARD_PAGE: 'NEXT_WIPREVIOUS_WIZARD_PAGEZARD_PAGE',
    SET_WIZARD_CURRENT_DATA_ITEM: 'SET_WIZARD_CURRENT_DATA_ITEM',
    CLEAR_WIZARD_DATA_ITEM: 'CLEAR_WIZARD_DATA_ITEM',
    SET_WIZARD_RESULT: 'SET_WIZARD_RESULT',
    CLEAR_WIZARD_RESULT: 'CLEAR_WIZARD_RESULT',
    SAVE_COLOR_IQ: 'SAVE_COLOR_IQ'
};

const initialState = {
    isOpen: false,
    currentPage: 0,
    componentIndex: 0,
    dataArray: []
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_WIZARD: {
            const toggle = action.isOpen ? action.isOpen : !state.isOpen;

            return Object.assign({}, state, { isOpen: toggle });
        }

        case ACTION_TYPES.CHANGE_WIZARD_PAGE:
            return Object.assign({}, state, { currentPage: action.currentPage });

        case ACTION_TYPES.NEXT_WIZARD_PAGE:
            return Object.assign({}, state, {
                currentPage: state.currentPage + 1,
                componentIndex: state.currentPage,
                dataArray: [...state.dataArray]
                    .slice(0, state.currentPage)
                    .concat(action.dataItem)
                    .concat([...state.dataArray].slice(state.currentPage, state.dataArray.length)),
                brandName: action.brandName,
                skuId: action.skuId,
                labValue: action.labValue
            });

        case ACTION_TYPES.PREVIOUS_WIZARD_PAGE: {
            const page = state.currentPage === 0 ? 0 : state.currentPage - 1;
            const componentIndex = page === 0 ? 0 : page - 1;

            return Object.assign({}, state, {
                currentPage: page,
                componentIndex,
                dataArray: [...state.dataArray].splice(0, state.currentPage)
            });
        }

        case ACTION_TYPES.SET_WIZARD_CURRENT_DATA_ITEM:
            return Object.assign({}, state, {
                dataArray: [...state.dataArray]
                    .slice(0, state.currentPage)
                    .concat(action.dataItem)
                    .concat([...state.dataArray].slice(state.currentPage, state.dataArray.length))
            });

        case ACTION_TYPES.CLEAR_WIZARD_DATA_ITEM:
            return Object.assign({}, state, { dataArray: [] });

        case ACTION_TYPES.SET_WIZARD_RESULT:
            return Object.assign({}, state, {
                result: action.data.result,
                matchText: action.data.matchText,
                labCode: action.data.labCode
            });

        case ACTION_TYPES.SAVE_COLOR_IQ:
            return Object.assign({}, state, {
                hexShadeCode: action.payload.hexShadeCode,
                shade: action.payload.shade,
                desc: action.payload.desc
            });

        case ACTION_TYPES.CLEAR_WIZARD_RESULT:
            return Object.assign({}, state, {
                result: false,
                matchText: false
            });

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
