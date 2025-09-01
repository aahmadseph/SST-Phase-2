import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Markdown from 'components/Markdown/Markdown';
import localeUtils from 'utils/LanguageLocale';

const DenominationText = ({ getText, cbr: { appliedRewardsTotal }, pfd: { appliedPercentageOff = 0 }, createEligibilityInfoElement }) => {
    const pointsAreApplied = appliedRewardsTotal > 0;
    const isDiscountApplied = appliedPercentageOff > 0;
    let promoText = null;

    if (pointsAreApplied) {
        const localizedBiPointsAmount = localeUtils.getFormattedPrice(appliedRewardsTotal, false, false);
        promoText = (
            <Markdown
                is='span'
                display='inline'
                onPostParse={html => html.substring(3, html.length - 5)}
                content={getText('cbrPointsApplied', [localizedBiPointsAmount])}
            />
        );
    } else if (isDiscountApplied) {
        promoText = (
            <Markdown
                is='span'
                display='inline'
                onPostParse={html => html.substring(3, html.length - 5)}
                content={getText('pfdPointsApplied', [appliedPercentageOff])}
            />
        );
    } else {
        promoText = createEligibilityInfoElement();
    }

    return promoText;
};

DenominationText.propTypes = {
    cbr: PropTypes.shape({ appliedRewardsTotal: PropTypes.number.isRequired }).isRequired,
    pfd: PropTypes.shape({ appliedPercentageOff: PropTypes.number }).isRequired,
    getText: PropTypes.func.isRequired,
    createEligibilityInfoElement: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(DenominationText, 'DenominationText');
