import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import { space } from 'style/config';

const CheckoutTermsConditions = ({ localization, marginTop, paddingTop, paddingBottom }) => {
    const {
        pleaseReviewOrderInfoText, byPlacingOrderCaText, termsOfPurchase, termsOfUse, andText, privacyPolicy
    } = localization;

    // Default styles that can be overridden with space values
    const defaultStyles = {
        marginTop: [5, 6],
        paddingTop: space[5],
        paddingBottom: 0
    };

    return localeUtils.isCanada() ? (
        <Text
            is='p'
            fontSize='sm'
            color='gray'
            lineHeight='tight'
            borderTop={1}
            borderColor='divider'
            marginTop={marginTop || defaultStyles.marginTop}
            paddingTop={paddingTop || defaultStyles.paddingTop}
            paddingBottom={paddingBottom || defaultStyles.paddingBottom}
        >
            {pleaseReviewOrderInfoText}
            <br />
            {byPlacingOrderCaText}{' '}
            <Link
                color='blue'
                underline={true}
                href='/terms-of-purchase'
                children={termsOfPurchase}
            />
            {', '}
            <Link
                color='blue'
                underline={true}
                href='/terms-of-use'
                children={termsOfUse}
            />
            {andText}
            <Link
                color='blue'
                underline={true}
                href='/privacy-policy'
                children={privacyPolicy}
            />
        </Text>
    ) : null;
};

export default wrapFunctionalComponent(CheckoutTermsConditions, 'CheckoutTermsConditions');
