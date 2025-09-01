import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const { showEditBeautyPreferencesModal } = Actions;

const functions = {
    showEditBeautyPreferencesModal
};

const withBeautyPreferenceSpokeProps = wrapHOC(connect(null, functions));

export {
    functions, withBeautyPreferenceSpokeProps
};
