import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import PersonalizedPlacementActions from 'actions/PersonalizedPlacementActions';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { createStructuredSelector } from 'reselect';
import Actions from 'Actions';
const { showInfoModal } = Actions;
const { setPersonalizedVariations, setActiveVariation, setSidData, updateSidData } = PersonalizedPlacementActions;

const { wrapHOC } = FrameworkUtils;

const fields = createStructuredSelector({ p13n: p13nSelector });

const functions = {
    setPersonalizedVariations,
    setActiveVariation,
    setSidData,
    updateSidData,
    showInfoModal
};

const withPersonalizedPlacementProps = wrapHOC(connect(fields, functions));

export {
    withPersonalizedPlacementProps, fields, functions
};
