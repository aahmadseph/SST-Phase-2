import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'components/ui';
import DenominationText from 'components/Reward/LoyaltyPromo/MultiplePointsView/DenominationText';
import { wrapFunctionalComponent } from 'utils/framework';
import Markdown from 'components/Markdown/Markdown';

const HeadContent = ({
    isCollapsible,
    isCheckout,
    isModal,
    netBeautyBankPointsAvailable,
    isCarousel,
    cbr,
    pfd,
    getText,
    createEligibilityInfoElement,
    isMobile = Sephora.isMobile()
}) => {
    return (
        <React.Fragment>
            <Text
                className={isCollapsible ? 'Collapse-target' : ''}
                fontSize={isModal ? 'md' : 'base'}
                fontWeight='bold'
            >
                {/* Apply Points */}
                {getText(isModal ? 'applyPointsLong' : 'applyPoints')}
            </Text>
            <Text fontSize={isMobile || isCarousel ? 'base' : 'sm'}>
                {isCarousel ? ': ' : <br />}
                {isModal ? (
                    <React.Fragment>
                        {(isCheckout || isModal) && (
                            // TODO let the extendedGetText pass props to Markdown
                            <Markdown
                                is={'span'}
                                display='inline'
                                onPostParse={html => html.substring(3, html.length - 5)}
                                content={getText('youNowHaveText', [netBeautyBankPointsAvailable])}
                            />
                        )}
                        {isMobile && <br />}
                    </React.Fragment>
                ) : (
                    <DenominationText
                        pfd={pfd}
                        cbr={cbr}
                        createEligibilityInfoElement={createEligibilityInfoElement}
                        getText={getText}
                    />
                )}
            </Text>
        </React.Fragment>
    );
};

HeadContent.propTypes = {
    isCollapsible: PropTypes.bool,
    isCheckout: PropTypes.bool,
    isModal: PropTypes.bool,
    netBeautyBankPointsAvailable: PropTypes.number.isRequired,
    isCarousel: PropTypes.bool,
    cbr: PropTypes.shape({
        appliedRewardsTotal: PropTypes.number.isRequired
    }).isRequired,
    pfd: PropTypes.shape({
        appliedPercentageOff: PropTypes.number
    }).isRequired,
    getText: PropTypes.func.isRequired,
    createEligibilityInfoElement: PropTypes.func.isRequired,
    isMobile: PropTypes.bool
};

export default wrapFunctionalComponent(HeadContent, 'HeadContent');
