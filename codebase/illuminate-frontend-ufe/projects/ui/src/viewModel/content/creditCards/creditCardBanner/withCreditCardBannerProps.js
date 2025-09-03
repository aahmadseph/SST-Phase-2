import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { prescreenBannerSelector } from 'selectors/creditCard/prescreenBannerSelector';

const withCreditCardBannerProps = connect(
    createSelector(prescreenBannerSelector, personalizedComponent => {
        return {
            personalizedComponent
        };
    })
);

export { withCreditCardBannerProps };
