import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PromoUtils from 'utils/Promos';
import {
    Box, Text, Button, Link
} from 'components/ui';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import localeUtils from 'utils/LanguageLocale';

const { PROMO_TYPES } = PromoUtils;
const getText = localeUtils.getLocaleResourceFile('components/Reward/LoyaltyPromo/locales', 'LoyaltyPromo');

class PromoCta extends BaseClass {
    static getAriaLabel(option) {
        const isApplied = option.isApplied ? 'remove' : 'apply';
        const promoTypeAmount = option.localizedDiscountAmount ? option.localizedDiscountAmount : option.localizedDiscountPercentage;

        return getText(isApplied) + ` ${promoTypeAmount} ${option.displayName}`;
    }

    render() {
        const {
            option, applyConfig = {}, removeConfig = {}, onApply, onRemove, isDisabled = false
        } = this.props;
        const promoType = PROMO_TYPES[option.promotionType].toLowerCase();
        const ariaLabel = PromoCta.getAriaLabel(option);

        return option.isApplied ? (
            <Box {...removeConfig}>
                <Text
                    display='block'
                    fontWeight='bold'
                >
                    <IconCheckmark
                        fontSize='.75em'
                        verticalAlign='middle'
                        marginRight={1}
                    />
                    {getText('applied')}
                </Text>
                <Link
                    aria-label={ariaLabel}
                    color='blue'
                    padding={2}
                    margin={-2}
                    data-at={Sephora.debug.dataAt(promoType + '_remove_btn')}
                    onClick={onRemove}
                    children={getText('remove')}
                />
            </Box>
        ) : (
            <Button
                variant='secondary'
                size='sm'
                {...applyConfig}
                aria-label={ariaLabel}
                onClick={onApply}
                disabled={!option.isEligible || isDisabled}
                data-at={Sephora.debug.dataAt(promoType + '_apply_btn')}
                children={getText('apply')}
            />
        );
    }
}

export default wrapComponent(PromoCta, 'PromoCta');
