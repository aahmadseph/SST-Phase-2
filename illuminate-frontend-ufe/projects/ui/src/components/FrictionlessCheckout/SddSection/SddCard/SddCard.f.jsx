import LayoutCard from 'components/FrictionlessCheckout/LayoutCard/LayoutCard';
import TwoColumnLayout from 'components/FrictionlessCheckout/LayoutCard/TwoColumnLayout';
import { wrapFunctionalComponent } from 'utils/framework';
import DeliveryWindow from 'components/FrictionlessCheckout/SddSection/DeliveryWindow';
import React from 'react';
import { Icon } from 'components/ui';
import CheckoutItemsList from 'components/FrictionlessCheckout/CheckoutItemsList';
import BasketConstants from 'constants/Basket';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { BasketType } = BasketConstants;

function SddCard({
    title,
    sectionNumber,
    isDeliveryVisible,
    isUserSDUMember,
    displaySDUDeliveryPrice,
    isSDUOnlyOrder,
    infoModalData,
    showContentModal,
    isNewUserFlow,
    sectionLevelError,
    error
}) {
    const { sid, title: infoModalTitle, width } = infoModalData || {};

    return (
        <LayoutCard
            sectionInfo={{
                sectionNumber: !sectionLevelError && sectionNumber,
                title: title,
                hasDivider: true,
                sectionLevelError,
                sectionName: SECTION_NAMES.SDD
            }}
            marginTop={[4, 4, 5]}
            isCollapsed={isNewUserFlow && !isSDUOnlyOrder}
            icon={
                !isSDUOnlyOrder && (
                    <Icon
                        name='infoOutline'
                        size={[14, 16]}
                        color='#757575'
                        cursor='pointer'
                        onClick={() => {
                            showContentModal({
                                isOpen: true,
                                data: {
                                    sid,
                                    title: infoModalTitle,
                                    width,
                                    isPrescreenModal: false
                                }
                            });
                        }}
                    />
                )
            }
            ariaLabel={title}
            role='region'
            {...(error?.error && error?.isSDDSkuOOSException && { CustomErrorComponent: error?.error })}
        >
            {isDeliveryVisible ? (
                <TwoColumnLayout
                    LeftComponent={
                        isDeliveryVisible && (
                            <DeliveryWindow
                                isUserSDUMember={isUserSDUMember}
                                displaySDUDeliveryPrice={displaySDUDeliveryPrice}
                            />
                        )
                    }
                    RightComponent={
                        <CheckoutItemsList
                            basketType={BasketType.SameDay}
                            isSDUOnlyOrder={isSDUOnlyOrder}
                            isDeliveryVisible={isDeliveryVisible}
                        />
                    }
                />
            ) : (
                <CheckoutItemsList
                    basketType={BasketType.SameDay}
                    isSDUOnlyOrder={isSDUOnlyOrder}
                />
            )}
        </LayoutCard>
    );
}

export default wrapFunctionalComponent(SddCard, 'SddCard');
