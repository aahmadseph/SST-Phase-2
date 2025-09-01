/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import ErrorMsg from 'components/ErrorMsg';

const ErrorMessage = props => {
    const { couponCode, isModal, isCarousel, errorMessage, errorPromoCode, ...restProps } = props;
    const showError = errorMessage && (!couponCode || couponCode.toLowerCase() === errorPromoCode);

    if (showError) {
        return (
            <ErrorMsg
                {...restProps}
                marginTop={isModal || isCarousel ? 4 : 3}
                marginBottom={0}
            >
                {errorMessage}
            </ErrorMsg>
        );
    }

    return null;
};

ErrorMessage.defaultProps = {
    isModal: false,
    isCarousel: false,
    couponCode: null,
    errorMessage: null,
    errorPromoCode: null
};
ErrorMessage.propTypes = {
    couponCode: PropTypes.string,
    isModal: PropTypes.bool,
    isCarousel: PropTypes.bool,
    errorMessage: PropTypes.string,
    errorPromoCode: PropTypes.string
};

export default wrapFunctionalComponent(ErrorMessage, 'ErrorMessage');
