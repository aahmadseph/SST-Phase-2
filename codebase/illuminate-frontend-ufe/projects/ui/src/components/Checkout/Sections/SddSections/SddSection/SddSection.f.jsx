import basketConstants from 'constants/Basket';
import BasketItemsSection from 'components/Checkout/Sections/SddSections/BasketItemsSection';
import DeliveryInstructions from 'components/Checkout/Sections/SddSections/SddSection/DeliveryInstructions';
import SDUAgreement from 'components/Checkout/OrderSummary/OrderTotalSection/SDUAgreement';
import DeliveryWindow from 'components/Checkout/Sections/SddSections/SddSection/DeliveryWindow';
import React from 'react';
import PropTypes from 'prop-types';
import mediaUtils from 'utils/Media';
import { wrapFunctionalComponent } from 'utils/framework';
import { space } from 'style/config';

const { Media } = mediaUtils;

const SddSection = ({
    deliveryInfo,
    isDisabled,
    isError,
    promiseDateInfo,
    subTitle,
    title,
    error,
    isDeliveryVisible,
    isSDUInBasket,
    isUserSDUMember,
    displaySDUDeliveryPrice
}) => (
    <BasketItemsSection
        basketType={basketConstants.BasketType.SameDay}
        deliveryInfo={deliveryInfo}
        isDisabled={isDisabled}
        isError={isError}
        promiseDateInfo={promiseDateInfo}
        subTitle={subTitle}
        title={title}
        error={error}
        hasSDUInBasket={!isDeliveryVisible}
    >
        {isDeliveryVisible && (
            <>
                <DeliveryWindow
                    isUserSDUMember={isUserSDUMember}
                    displaySDUDeliveryPrice={displaySDUDeliveryPrice}
                />
                <DeliveryInstructions />
            </>
        )}
        {isSDUInBasket && (
            <Media lessThan='md'>
                <div css={styles.sduAgreement}>
                    <SDUAgreement />
                </div>
            </Media>
        )}
    </BasketItemsSection>
);

const styles = {
    sduAgreement: {
        margin: `${space[5]}px 0`
    }
};

SddSection.defaultProps = {
    deliveryInfo: '',
    error: null
};
SddSection.propTypes = {
    deliveryInfo: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    isDisabled: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    promiseDateInfo: PropTypes.object.isRequired,
    subTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isSDUOrderOnly: PropTypes.bool,
    isUserSDUMember: PropTypes.bool.isRequired,
    displaySDUDeliveryPrice: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(SddSection, 'SddSection');
