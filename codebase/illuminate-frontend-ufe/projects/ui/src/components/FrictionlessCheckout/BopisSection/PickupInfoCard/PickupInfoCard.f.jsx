import LayoutCard from 'components/FrictionlessCheckout/LayoutCard/LayoutCard';
import { wrapFunctionalComponent } from 'utils/framework';
import React from 'react';
import {
    Icon, Text, Divider, Box, Link, Flex
} from 'components/ui';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';
import CheckoutItemsList from 'components/FrictionlessCheckout/CheckoutItemsList';
import BasketConstants from 'constants/Basket';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { BasketType } = BasketConstants;

function PickupInfoCard({
    localization, sectionNumber, pickupDetails, showInfoModal, showAlternatePickupPersonModal, sectionLevelError
}) {
    const {
        pickupCardTitle,
        pickupStore,
        pickupPerson,
        confirmationDetails,
        addAltPickupPerson,
        usuallyReady,
        inStorePickup,
        curbsidePickup,
        modalMessage,
        gotIt,
        altPickupPerson,
        edit,
        information,
        forThisOrderText,
        pickupConfirmationDetails,
        itemsToBePickedUp
    } = localization;
    const { displayName, isBopisable, isCurbsideEnabled } = pickupDetails?.storeDetails;

    const renderPickupStoreInfo = () => {
        return (
            <section
                aria-label={`${pickupStore} ${information}`}
                role='region'
            >
                <Text
                    is='p'
                    fontSize='sm'
                    lineHeight='tight'
                    marginBottom={1}
                    children={pickupStore}
                />
                <Text
                    is='h4'
                    fontWeight='bold'
                    lineHeight='tight'
                    children={displayName}
                />
                <Text
                    is='p'
                    color='green'
                    fontSize={['sm', 'base']}
                    lineHeight='tight'
                    children={usuallyReady}
                />
                <Box marginTop={1}>
                    {isBopisable && (
                        <CurbsidePickupIndicator
                            children={inStorePickup}
                            iconColor='gray'
                        />
                    )}
                    {isCurbsideEnabled && (
                        <CurbsidePickupIndicator
                            children={curbsidePickup}
                            iconColor='gray'
                        />
                    )}
                </Box>
            </section>
        );
    };

    const renderAlternatePickupPersonInfo = () => {
        const { email, firstName, lastName } = pickupDetails?.altPickupPersonDetails;
        const name = `${firstName} ${lastName}`;

        return (
            <Box
                marginTop={4}
                is='section'
                aria-label={`${altPickupPerson}`}
                role='region'
            >
                <Flex justifyContent='space-between'>
                    <Text
                        is='h4'
                        fontWeight='bold'
                        lineHeight='tight'
                        children={altPickupPerson}
                    />
                    <Link
                        color='link'
                        children={edit}
                        aria-label={`${edit} ${altPickupPerson}`}
                        onClick={() => {
                            showAlternatePickupPersonModal({
                                isOpen: true,
                                alternatePickupData: pickupDetails?.altPickupPersonDetails
                            });
                        }}
                    />
                </Flex>
                <Box marginTop={2}>
                    <Text
                        is='p'
                        lineHeight='tight'
                        children={name}
                    />
                    <Text
                        is='p'
                        lineHeight='tight'
                        children={email}
                    />
                </Box>
            </Box>
        );
    };

    const renderPickupPersonInfo = () => {
        const { lastName, firstname, email } = pickupDetails;
        const hasAlternatePickup = pickupDetails?.altPickupPersonDetails;
        const name = `${firstname} ${lastName}`;

        return (
            <section
                aria-label={`${pickupPerson}`}
                role='region'
            >
                <Text
                    is='h4'
                    fontWeight='bold'
                    lineHeight='tight'
                    children={pickupPerson}
                />
                <Box marginTop={2}>
                    <Text
                        is='p'
                        lineHeight='tight'
                        children={name}
                    />
                    <Text
                        is='p'
                        lineHeight='tight'
                        children={email}
                    />
                </Box>
                {hasAlternatePickup && renderAlternatePickupPersonInfo()}
                {renderConfirmationContainer()}
                {!hasAlternatePickup && (
                    <Link
                        children={addAltPickupPerson}
                        aria-label={`${addAltPickupPerson} ${forThisOrderText}`}
                        onClick={() => {
                            showAlternatePickupPersonModal({
                                isOpen: true
                            });
                        }}
                        color='link'
                    />
                )}
            </section>
        );
    };

    const renderConfirmationContainer = () => {
        return (
            <Box
                backgroundColor={'nearWhite'}
                paddingX={3}
                paddingY={2}
                maxWidth={[null, '372px']}
                marginY={4}
                role='note'
                aria-label={pickupConfirmationDetails}
            >
                <Text
                    is='p'
                    fontSize='sm'
                    lineHeight='tight'
                    dangerouslySetInnerHTML={{
                        __html: confirmationDetails
                    }}
                />
            </Box>
        );
    };

    const renderPickUpItemsInfo = () => {
        return (
            <section
                aria-label={itemsToBePickedUp}
                role='region'
            >
                <CheckoutItemsList basketType={BasketType.BOPIS} />
            </section>
        );
    };

    const openInfoModal = () => {
        showInfoModal({ isOpen: true, title: pickupCardTitle, message: modalMessage, buttonText: gotIt });
    };

    return (
        <LayoutCard
            sectionInfo={{
                sectionNumber: !sectionLevelError && sectionNumber,
                title: pickupCardTitle,
                hasDivider: true,
                sectionLevelError,
                sectionName: SECTION_NAMES.BOPIS_PICKUP_INFO
            }}
            marginTop={[4, 5]}
            icon={
                <Icon
                    name='infoOutline'
                    size={[14, 16]}
                    color='#757575'
                    cursor='pointer'
                    onClick={openInfoModal}
                    aria-label={`${pickupCardTitle} ${information}`}
                    role='button'
                    tabIndex={0}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openInfoModal();
                        }
                    }}
                />
            }
            ariaLabel={pickupCardTitle}
            role='region'
        >
            {renderPickupStoreInfo()}
            <Divider marginY={4} />
            {renderPickupPersonInfo()}
            <Divider marginY={4} />
            {renderPickUpItemsInfo()}
        </LayoutCard>
    );
}

export default wrapFunctionalComponent(PickupInfoCard, 'PickupInfoCard');
