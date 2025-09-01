import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';

const withPhotoCaptureProps = connect(createStructuredSelector({ user: coreUserDataSelector }));

export { withPhotoCaptureProps };
