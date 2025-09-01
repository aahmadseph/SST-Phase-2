import React from 'react';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';

import { Grid, Icon, Text } from 'components/ui';
import EnhancedMarkdown from 'components/EnhancedMarkdown/EnhancedMarkdown';
import TopContentLayout from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentLayout';

import MarkdownEnhancer from 'utils/MarkdownEnhancer';

import analyticsConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { wrapComponent } = FrameworkUtils;

const ICON_SIZE = 20;

// Bounceback promotions (BBQ)
class TopContentBBQMessage extends BaseClass {
    componentDidMount() {
        this.sendAnalytics(this.props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.messageContext !== this.props.messageContext || prevProps.messages !== this.props.messages) {
            this.sendAnalytics(this.props);
        }
    }

    sendAnalytics = ({ messageContext, messages }) => {
        const isQualified = messageContext.includes('.qualified');
        const text = messages[0];

        const pev2andprop55 = MarkdownEnhancer.createAnalyticsMessage({ isQualified, text });

        if (pev2andprop55) {
            const eventData = {
                actionInfo: pev2andprop55,
                linkName: pev2andprop55
            };

            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, { data: eventData });
        }
    };

    render() {
        const {
            messages, messageLogo, messageContext, backgroundColor, showBasketGreyBackground
        } = this.props;

        const text = messages[0];
        const isEmoticon = messageLogo.includes('emoticon:');
        const icon = messageLogo.replace('emoticon:', '');
        const isQualified = messageContext.includes('.qualified');

        return (
            <TopContentLayout
                backgroundColor={(isQualified && 'lightBlue') || (showBasketGreyBackground && backgroundColor)}
                showBasketGreyBackground={showBasketGreyBackground}
            >
                <Grid
                    key={'PromoNotifications'}
                    columns='auto 1fr'
                    gap={[2, 3]}
                    lineHeight='tight'
                    alignItems={[null, 'center']}
                >
                    {isEmoticon ? (
                        <Text
                            fontSize={ICON_SIZE}
                            lineHeight='none'
                            children={icon}
                        />
                    ) : (
                        <Icon
                            name={icon}
                            size={ICON_SIZE}
                        />
                    )}
                    <div>
                        <EnhancedMarkdown
                            content={text}
                            data-at={Sephora.debug.dataAt('promoNotifications_message')}
                        />
                    </div>
                </Grid>
            </TopContentLayout>
        );
    }
}

export default wrapComponent(TopContentBBQMessage, 'TopContentBBQMessage', true);
