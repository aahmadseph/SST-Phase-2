import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import { Grid, Icon, Text } from 'components/ui';
import EnhancedMarkdown from 'components/EnhancedMarkdown/EnhancedMarkdown';
import MarkdownEnhancer from 'utils/MarkdownEnhancer';
import analyticsConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { wrapComponent } = FrameworkUtils;

const ICON_SIZE = 24;

class PromoNotifications extends BaseClass {
    componentDidMount() {
        this.sendAnalytics(this.props.notifications);
    }

    componentDidUpdate(prevProps) {
        const prevTexts = prevProps.notifications.map(x => x.text);
        const newNotifications = this.props.notifications.filter(x => prevTexts.indexOf(x.text) < 0);
        this.sendAnalytics(newNotifications);
    }

    sendAnalytics = notifications => {
        notifications.forEach(message => {
            const pev2andprop55 = MarkdownEnhancer.createAnalyticsMessage(message);

            if (pev2andprop55) {
                const eventData = {
                    actionInfo: pev2andprop55,
                    linkName: pev2andprop55
                };

                processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, { data: eventData });
            }
        });
    };

    render() {
        const { notifications, qualifiedStyleProps, unqualifiedStyleProps, ...props } = this.props;

        return (
            <>
                {notifications.map((message, index) => (
                    <Grid
                        key={`PromoNotifications_${index}`}
                        columns='auto 1fr'
                        gap={[2, 3]}
                        alignItems='center'
                        lineHeight='tight'
                        {...(message.isQualified
                            ? {
                                backgroundColor: 'lightBlue',
                                paddingX: [3, 4],
                                paddingY: 2,
                                borderRadius: 2,
                                ...qualifiedStyleProps
                            }
                            : unqualifiedStyleProps)}
                        {...props}
                    >
                        {message.isEmoticon ? (
                            <Text
                                fontSize={ICON_SIZE}
                                lineHeight='none'
                                children={message.icon}
                            />
                        ) : (
                            <Icon
                                name={message.icon}
                                size={ICON_SIZE}
                            />
                        )}
                        <div>
                            <EnhancedMarkdown
                                content={message.text}
                                data-at={Sephora.debug.dataAt('promoNotifications_message')}
                            />
                        </div>
                    </Grid>
                ))}
            </>
        );
    }
}

PromoNotifications.propTypes = {
    notifications: PropTypes.array.isRequired,
    qualifiedStyleProps: PropTypes.object,
    unqualifiedStyleProps: PropTypes.object
};

export default wrapComponent(PromoNotifications, 'PromoNotifications', true);
