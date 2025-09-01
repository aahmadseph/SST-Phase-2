import ComponentList from 'components/Content/ComponentList/ComponentList';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { showReorderCarouselHPSOSelector } from 'viewModel/selectors/testTarget/showReorderCarouselHPSOSelector';
import { showReorderCarouselHPSISelector } from 'viewModel/selectors/testTarget/showReorderCarouselHPSISelector';
import userUtils from 'utils/User';
import biIdSelector from 'selectors/user/beautyInsiderAccount/biIdSelector';

const fields = createStructuredSelector({
    showReorderCarouselHPSO: showReorderCarouselHPSOSelector,
    showReorderCarouselHPSI: showReorderCarouselHPSISelector,
    isAnonymous: () => userUtils.isAnonymous(),
    userId: biIdSelector
});

export default connect(fields)(ComponentList);

