import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import TopPageCMSBannerMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopPageCMSBannerMessage';

function TopContentCanadaPostStrikeMessage(props) {
    const { shouldRender } = props;

    if (!shouldRender) {
        return null;
    }

    return (
        <TopPageCMSBannerMessage
            {...props}
            alignItems={['start', 'center']}
        />
    );
}

TopContentCanadaPostStrikeMessage.propTypes = {
    shouldRender: PropTypes.bool
};

TopContentCanadaPostStrikeMessage.defaultProps = {
    shouldRender: true
};

export default wrapFunctionalComponent(TopContentCanadaPostStrikeMessage, 'TopContentCanadaPostStrikeMessage');
