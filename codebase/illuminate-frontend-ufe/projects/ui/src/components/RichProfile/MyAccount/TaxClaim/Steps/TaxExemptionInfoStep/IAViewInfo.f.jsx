import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Step4ViewModeComponent from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/Step4ViewModeComponent';
import dateUtils from 'utils/Date';

const IAViewInfo = ({
    step4VariationData, taxClaimGetText, isTaxExemptionSelectionEnabled, taxAddressData, styles
}) => {
    // Destructure and format dates using dateUtils.formatDateMDY
    let formattedItems = [
        { key: 'tribeNameLabel', value: step4VariationData.ia.tribeName },
        { key: 'tribeIdLabel', value: step4VariationData.ia.tribeIdNumber },
        { key: 'tribeReserveNameLabel', value: step4VariationData.ia.tribeReserveName },
        { key: 'idCardIssueDateLabel', value: dateUtils.formatDateMDY(step4VariationData.ia.issueDate) },
        { key: 'idCardExpirationDateLabel', value: dateUtils.formatDateMDY(step4VariationData.ia.expirationDate) }
    ];

    if (isTaxExemptionSelectionEnabled) {
        formattedItems = [
            ...formattedItems,
            { key: 'streetAddress', value: taxAddressData.address1 },
            { key: 'address2Label', value: taxAddressData.address2 },
            { key: 'zipCode', value: taxAddressData.postalCode },
            { key: 'city', value: taxAddressData.city },
            { key: 'state', value: taxAddressData.state }
        ];
    }

    return (
        <>
            {formattedItems.map(({ key, value }) => (
                <Step4ViewModeComponent
                    key={key}
                    label={taxClaimGetText(key)}
                    value={value}
                    styles={styles}
                />
            ))}
        </>
    );
};

export default wrapFunctionalComponent(IAViewInfo, 'IAViewInfo');
