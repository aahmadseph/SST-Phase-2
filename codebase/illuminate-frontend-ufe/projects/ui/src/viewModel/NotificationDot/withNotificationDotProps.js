import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import personalizedPromotionsSelector from 'selectors/personalizedPromotions/personalizedPromotionsSelector';
import userUtils from 'utils/User';

const withNotificationDotProps = compose(
    connect(
        createStructuredSelector({
            user: userSelector,
            personalizedPromotions: personalizedPromotionsSelector
        })
    ),
    WrappedComponent => {
        const NotificationDotWrapper = ({ personalizedPromotions, ...restProps }) => {
            if (userUtils.isAnonymous() || !personalizedPromotions.hasNewPersonalizedPromotions) {
                return null;
            }

            return <WrappedComponent {...restProps} />;
        };

        NotificationDotWrapper.displayName = `NotificationDotWrapper(${WrappedComponent.displayName})`;

        return NotificationDotWrapper;
    }
);

export default withNotificationDotProps;
