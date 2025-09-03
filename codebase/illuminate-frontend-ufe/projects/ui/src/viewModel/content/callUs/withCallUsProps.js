import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import VibSegmentSelector from 'selectors/user/beautyInsiderAccount/vibSegmentSelector';

const { vibSegmentSelector } = VibSegmentSelector;
const withCallUsProps = connect(
    createStructuredSelector({
        vibSegment: vibSegmentSelector
    })
);

export { withCallUsProps };
