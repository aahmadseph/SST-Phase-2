import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import { Text } from 'components/ui';
import CheckoutItemsList from 'components/FrictionlessCheckout/CheckoutItemsList';

const PromiseDateAndItems = ({
    shippingMethod, showSplitEDD, cutOffDescriptionForSplitEdd, isEditView, standardOnly, showAutoReplenishItems
}) => {
    const { promiseDateCutOffDescription, promiseDateLabel, promiseDate, items } = shippingMethod;
    const showCheckoutDateAndTimerFormat = !localeUtils.isFRCanada();
    const cutOffDescriptionText =
        promiseDateCutOffDescription && showCheckoutDateAndTimerFormat
            ? `if you ${promiseDateCutOffDescription.toLowerCase()}`
            : promiseDateCutOffDescription;

    if (showSplitEDD && !items?.length) {
        return null;
    }

    return (
        <>
            <Text
                fontSize={['sm', null, 'base']}
                is='p'
                color='gray'
                marginBottom={isEditView ? 2 : 3}
                pt='2px'
            >
                {promiseDate && (
                    <Text
                        color='green'
                        fontWeight='bold'
                        children={`${promiseDateLabel} ${dateUtils.getPromiseDate(promiseDate)} `}
                    />
                )}
                {cutOffDescriptionForSplitEdd && <Text> {cutOffDescriptionForSplitEdd} </Text>}
                {cutOffDescriptionText && showCheckoutDateAndTimerFormat && <Text>{cutOffDescriptionText}</Text>}
            </Text>
            <CheckoutItemsList
                shouldDisplayTitle={false}
                splitEddItems={items}
                showSplitEDD={showSplitEDD}
                standardOnly={standardOnly}
                showAutoReplenishItems={showAutoReplenishItems}
            />
        </>
    );
};

export default wrapFunctionalComponent(PromiseDateAndItems, 'PromiseDateAndItems');
