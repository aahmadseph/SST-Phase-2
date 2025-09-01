/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Text, Link } from 'components/ui';

class ReviewText extends BaseClass {
    render() {
        const {
            isZeroCheckout,
            isShippableOrder,
            isZeroDollarOrderWithCVVValidation,
            pleaseReviewOrderInfoText,
            byPlacingOrderCaText,
            termsOfPurchase,
            termsOfUse,
            andText,
            privacyPolicy,
            verifyCVVeFulfilledOrder,
            verifyCVV,
            noShippingAddressRequired,
            noPaymentRequired,
            isCanada
        } = this.props;

        if (isZeroCheckout) {
            let reviewOrderText;

            if (isZeroDollarOrderWithCVVValidation && !isShippableOrder) {
                reviewOrderText = verifyCVVeFulfilledOrder;
            } else if (isZeroDollarOrderWithCVVValidation) {
                reviewOrderText = verifyCVV;
            } else if (!isShippableOrder) {
                reviewOrderText = noShippingAddressRequired;
            } else {
                reviewOrderText = noPaymentRequired;
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
                        {pleaseReviewOrderInfoText}
                    </Text>
                    <Text
                        is='p'
                        marginBottom='1em'
                    >
                        {byPlacingOrderCaText}
                        <Link
                            display='inline'
                            color='blue'
                            underline={true}
                            href='/terms-of-purchase'
                            children={termsOfPurchase}
                        />
                        ,{' '}
                        <Link
                            display='inline'
                            color='blue'
                            underline={true}
                            href='/terms-of-use'
                            children={termsOfUse}
                        />
                        {andText}
                        <Link
                            display='inline'
                            color='blue'
                            underline={true}
                            href='/privacy-policy'
                            children={privacyPolicy}
                        />
                        .
                    </Text>
                </div>
            );
        }

        return <div data-at={Sephora.debug.dataAt('review_order_info_label')}>{pleaseReviewOrderInfoText}</div>;
    }
}

export default wrapComponent(ReviewText, 'ReviewText');
