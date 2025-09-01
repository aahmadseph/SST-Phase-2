/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import { Text, Link } from 'components/ui';

class ReviewText extends BaseClass {
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Review/locales', 'ReviewText');
        const { isZeroCheckout, isShippableOrder, isZeroDollarOrderWithCVVValidation } = this.props;

        const isCanada = localeUtils.isCanada();

        if (isZeroCheckout) {
            let reviewOrderText;

            if (isZeroDollarOrderWithCVVValidation && !isShippableOrder) {
                reviewOrderText = getText('verifyCVVeFulfilledOrder');
            } else if (isZeroDollarOrderWithCVVValidation) {
                reviewOrderText = getText('verifyCVV');
            } else if (!isShippableOrder) {
                reviewOrderText = getText('noShippingAddressRequired');
            } else {
                reviewOrderText = getText('noPaymentRequired');
            }

            return <div data-at={Sephora.debug.dataAt('review_order_info_label')}>{reviewOrderText}</div>;
        }

        if (isCanada) {
            return (
                <div>
                    <Text
                        is='p'
                        marginBottom='1em'
                        data-at={Sephora.debug.dataAt('review_order_info_label')}
                    >
                        {getText('pleaseReviewOrderInfoText')}
                    </Text>
                    <Text
                        is='p'
                        marginBottom='1em'
                    >
                        {getText('byPlacingOrderCaText')}
                        <Link
                            display='inline'
                            padding={2}
                            margin={-2}
                            color='blue'
                            underline={true}
                            href='/terms-of-purchase'
                            children={getText('termsOfPurchase')}
                        />
                        ,{' '}
                        <Link
                            display='inline'
                            padding={2}
                            margin={-2}
                            color='blue'
                            underline={true}
                            href='/terms-of-use'
                            children={getText('termsOfUse')}
                        />
                        {getText('andText')}
                        <Link
                            display='inline'
                            padding={2}
                            margin={-2}
                            color='blue'
                            underline={true}
                            href='/privacy-policy'
                            children={getText('privacyPolicy')}
                        />
                        .
                    </Text>
                </div>
            );
        }

        return <div data-at={Sephora.debug.dataAt('review_order_info_label')}>{getText('pleaseReviewOrderInfoText')}</div>;
    }
}

export default wrapComponent(ReviewText, 'ReviewText');
