import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const CheckoutTermsConditions = function () {
    const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Review/locales', 'ReviewText');

    return localeUtils.isCanada() ? (
        <Text
            is='p'
            fontSize='sm'
            color='gray'
            lineHeight='tight'
            borderTop={1}
            borderColor='divider'
            marginTop={[5, 6]}
            paddingTop={5}
        >
            {getText('pleaseReviewOrderInfoText')}
            <br />
            {getText('byPlacingOrderCaText')}{' '}
            <Link
                color='blue'
                underline={true}
                href='/terms-of-purchase'
                children={getText('termsOfPurchase')}
            />
            {', '}
            <Link
                color='blue'
                underline={true}
                href='/terms-of-use'
                children={getText('termsOfUse')}
            />
            {getText('andText')}
            <Link
                color='blue'
                underline={true}
                href='/privacy-policy'
                children={getText('privacyPolicy')}
            />
        </Text>
    ) : null;
};

export default wrapFunctionalComponent(CheckoutTermsConditions, 'CheckoutTermsConditions');
