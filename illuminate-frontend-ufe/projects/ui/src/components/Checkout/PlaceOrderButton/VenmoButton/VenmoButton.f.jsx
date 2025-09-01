import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button, Image } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { colors } from 'style/config';
import checkoutUtils from 'utils/Checkout';
import orderUtils from 'utils/Order';

function isAddressComplete() {
    const isShipToHome = orderUtils.isShipToHome();
    const isSdd = orderUtils.isSdd();

    if (isSdd) {
        return checkoutUtils.isSameDayShipAddressComplete();
    }

    if (isShipToHome) {
        return checkoutUtils.isShipAddressComplete();
    } else {
        return true;
    }
}

function VenmoButton({ isDisabled, handleClick, ...props }) {
    const getText = localeUtils.getLocaleResourceFile('components/Checkout/PlaceOrderButton/locales', 'PlaceOrderButton');
    const disabledButton = Sephora.isAgent ? true : isDisabled || !isAddressComplete();
    const srcImage = `/img/ufe/payments/no-border/${disabledButton ? 'venmo-disabled' : 'venmo'}.svg`;

    return (
        <Button
            {...props}
            variant='special'
            disabled={disabledButton}
            onClick={handleClick}
            css={styles}
        >
            {getText('continueTo')}
            <Image
                src={srcImage}
                alt='Venmo'
                marginLeft='5px'
            />
        </Button>
    );
}

const styles = {
    backgroundColor: colors.venmoBlue,
    width: '100%',
    '.no-touch &:hover': {
        backgroundColor: colors.venmoLightBlue
    }
};

export default wrapFunctionalComponent(VenmoButton, 'VenmoButton');
