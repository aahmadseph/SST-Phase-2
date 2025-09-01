import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import promosSelector from 'selectors/basket/promos/promosSelector';

export default connect(createStructuredSelector({ promos: promosSelector }));
