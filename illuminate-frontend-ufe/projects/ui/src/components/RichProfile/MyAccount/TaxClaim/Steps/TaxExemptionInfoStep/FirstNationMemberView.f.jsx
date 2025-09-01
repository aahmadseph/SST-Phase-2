import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Step4ViewModeComponent from 'components/RichProfile/MyAccount/TaxClaim/Steps/TaxExemptionInfoStep/Step4ViewModeComponent';

const FirstNationMemberView = ({
    step4VariationData, taxClaimGetText, isTaxExemptionSelectionEnabled, taxAddressData, styles
}) => {
    let items = [
        { key: 'registrationNumber', value: step4VariationData.registrationNumber },
        { key: 'alias', value: step4VariationData.alias },
        { key: 'registryGroupNumber', value: step4VariationData.registryGroupNumber },
        { key: 'registryBandName', value: step4VariationData.registryBandName },
        { key: 'nameOfReservation', value: step4VariationData.nameOfReservation },
        { key: 'issueDateInputLabel', value: step4VariationData.issueDate },
        { key: 'expirationDateInputLabel', value: step4VariationData.expirationDate }
    ];

    if (isTaxExemptionSelectionEnabled) {
        items = [
            ...items,
            { key: 'streetAddress', value: taxAddressData.address1 },
            { key: 'address2Label', value: taxAddressData.address2 },
            { key: 'zipCode', value: taxAddressData.postalCode },
            { key: 'city', value: taxAddressData.city },
            { key: 'state', value: taxAddressData.state }
        ];
    }

    return (
        <>
            {items.map(({ key, value }) => (
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

export default wrapFunctionalComponent(FirstNationMemberView, 'FirstNationMemberView');
