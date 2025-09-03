import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import { authSelector } from 'selectors/auth/authSelector';

const withBasketLovesProps = connect(createStructuredSelector({ user: userSelector, auth: authSelector }));

export default withBasketLovesProps;
