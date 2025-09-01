import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import actions from 'actions/Actions';

import {
    Box, Image, Text, Button
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import { space } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import helperUtils from 'utils/Helpers';

const { getProp } = helperUtils;

const ICON_SIZE = 32;

const styles = {
    label: {
        flex: 1,
        textAlign: 'left',
        marginLeft: space[4],
        marginRight: space[4]
    },
    pts: {
        fontWeight: 'var(--font-weight-bold)',
        textAlign: 'right'
    }
};

class ValueTable extends BaseClass {
    constructor(props) {
        super(props);
    }

    openModal = function (event, mediaId) {
        event.preventDefault();
        store.dispatch(
            actions.showMediaModal({
                isOpen: true,
                mediaId
            })
        );
    };

    renderDefault = () => {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/ValueTable/locales', 'ValueTable');

        const year = this.props.clientSummary.currentYear.year;
        const isMobile = Sephora.isMobile();

        return (
            <Box textAlign='center'>
                <Image
                    size={128}
                    marginX='auto'
                    marginBottom={4}
                    src='/img/ufe/no-rewards.svg'
                />
                <Text
                    is='p'
                    children={getText('yearEarnings', [year])}
                />
                <Text
                    is='p'
                    children={getText('keepShopping')}
                />
                <Button
                    variant='secondary'
                    children={getText('shopNow')}
                    href='/'
                    marginTop={5}
                    block={isMobile}
                    hasMinWidth={!isMobile}
                />
            </Box>
        );
    };

    // eslint-disable-next-line complexity
    render() {
        const isDesktop = Sephora.isDesktop();

        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/ValueTable/locales', 'ValueTable');

        const { clientSummary, rewardsTotal } = this.props;

        if (Object.keys(clientSummary).length === 0) {
            return null;
        }

        const rougeRcDollarCurrent = getProp(clientSummary, 'currentYear.rougeRcDollar', {});
        const hasRougeRcDollar = !!rougeRcDollarCurrent.value;

        const dollarsSavedCurrent = getProp(clientSummary, 'currentYear.dollarsSaved', {});
        const hasDollarsSaved = !!dollarsSavedCurrent.value;

        const cashApplied = getProp(clientSummary, 'currentYear.cashApplied', {});
        const hasCashApplied = !!cashApplied.value;

        const referralPointsEarned = getProp(clientSummary, 'currentYear.referralPtsEarned', {});
        const hasEarnedReferralPoints = !!referralPointsEarned.value;

        const isUS = localeUtils.isUS();
        const { isGlobalEnabled } = Sephora.fantasticPlasticConfigurations;
        const hasCCRewards = isUS && isGlobalEnabled && rewardsTotal > 0;

        const shouldDisplayDefault = !hasDollarsSaved && !hasRougeRcDollar && !hasCCRewards && !hasCashApplied && !hasEarnedReferralPoints;

        const hasTwoCol = isDesktop && (hasCashApplied || hasDollarsSaved) && (hasRougeRcDollar || hasCCRewards);

        const cellProps = {
            width: isDesktop ? '50%' : null,
            display: 'flex',
            alignItems: 'center',
            marginTop: 3
        };

        return (
            <div>
                {shouldDisplayDefault ? (
                    this.renderDefault()
                ) : (
                    <Box
                        marginX={isDesktop && 9}
                        lineHeight='tight'
                        marginTop={-3}
                    >
                        <LegacyGrid
                            gutter={isDesktop && 9}
                            {...(isDesktop &&
                                !hasTwoCol && {
                                flexFlow: 'column',
                                alignItems: 'center'
                            })}
                            fontSize='md'
                        >
                            {hasDollarsSaved && (
                                <LegacyGrid.Cell
                                    {...cellProps}
                                    order={1}
                                >
                                    <Image
                                        src='/img/ufe/icons/saving.svg'
                                        width={ICON_SIZE}
                                        height={ICON_SIZE}
                                    />
                                    <span css={styles.label}>{getText('promos')}</span>
                                    <span css={styles.pts}>{clientSummary.currentYear.dollarsSaved.text}</span>
                                </LegacyGrid.Cell>
                            )}

                            {hasCCRewards && Sephora.fantasticPlasticConfigurations.isGlobalEnabled && isUS && (
                                <LegacyGrid.Cell
                                    {...cellProps}
                                    order={isDesktop ? 2 : 3}
                                >
                                    <Image
                                        src='/img/ufe/icons/cc.svg'
                                        size={ICON_SIZE}
                                    />
                                    <span css={styles.label}>{getText('creditCardRewards')}</span>
                                    <span css={styles.pts}>{localeUtils.getCurrencySymbol() + this.props.rewardsTotal}</span>
                                </LegacyGrid.Cell>
                            )}

                            {hasCashApplied && (
                                <LegacyGrid.Cell
                                    {...cellProps}
                                    order={isDesktop ? 3 : 2}
                                    data-at={Sephora.debug.dataAt('cash_saved_label')}
                                >
                                    <Image
                                        src='/img/ufe/icons/points-cash.svg'
                                        size={ICON_SIZE}
                                    />
                                    <span css={styles.label}>{getText('biCashApplied')}</span>
                                    <span css={styles.pts}>{clientSummary.currentYear.cashApplied.text}</span>
                                </LegacyGrid.Cell>
                            )}

                            {hasRougeRcDollar && (
                                <LegacyGrid.Cell
                                    {...cellProps}
                                    order={4}
                                    marginLeft={hasTwoCol && 'auto'}
                                >
                                    <Image
                                        src='/img/ufe/icons/rouge-rewards.svg'
                                        size={ICON_SIZE}
                                    />
                                    <span css={styles.label}>{getText('rougeRewardsEarned')}</span>
                                    <span css={styles.pts}>{clientSummary.currentYear.rougeRcDollar.text}</span>
                                </LegacyGrid.Cell>
                            )}
                            {hasEarnedReferralPoints && (
                                <LegacyGrid.Cell
                                    {...cellProps}
                                    order={5}
                                >
                                    <Image
                                        src='/img/ufe/icons/refer.svg'
                                        size={ICON_SIZE}
                                    />
                                    <span css={styles.label}>{getText('referralPointsEarned')}</span>
                                    <span css={styles.pts}>{clientSummary.currentYear.referralPtsEarned.text + ' ' + getText('points')}</span>
                                </LegacyGrid.Cell>
                            )}
                        </LegacyGrid>
                    </Box>
                )}
            </div>
        );
    }
}

export default wrapComponent(ValueTable, 'ValueTable', true);
