import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { firstNameSelector } from 'viewModel/selectors/user/firstNameSelector';
import { isBirthdayGiftEligibleSelector } from 'viewModel/selectors/user/isBirthdayGiftEligibleSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createStructuredSelector({
    firstName: firstNameSelector,
    isBirthdayGiftEligible: isBirthdayGiftEligibleSelector
});

const functions = null;

const withGreetingTextProps = wrapHOC(connect(fields, functions));

export {
    withGreetingTextProps, fields, functions
};
