import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import MarkdownEnhancer from 'utils/MarkdownEnhancer';
import AddSignInEnhancer from 'components/EnhancedMarkdown/AddSignInEnhancer';
import ApplyPromoEnhancer from 'components/EnhancedMarkdown/ApplyPromoEnhancer';
import JoinBiEnhancer from 'components/EnhancedMarkdown/JoinBiEnhancer';
import BiSummaryRedirectEnhancer from 'components/EnhancedMarkdown/BiSummaryRedirectEnhancer/BiSummaryRedirectEnhancer';
import PromoNotificationsBindings from 'analytics/bindingMethods/components/promoNotifications/PromoNotificationsBindings';

const trackingMap = {
    signInCTA: PromoNotificationsBindings.BBQSignIn,
    joinBiCTA: PromoNotificationsBindings.BBQJoinBi
};

function EnhancedMarkdown(props) {
    const createEnhancer = fragment => {
        const { enhancerType, content, args } = fragment;

        const enhancerProps = {
            children: MarkdownEnhancer.markedFragment(content),
            args: args.split(',')
        };

        const enhancerMap = {
            applyPromoCTA: ApplyPromoEnhancer,
            signInCTA: AddSignInEnhancer,
            joinBiCTA: JoinBiEnhancer,
            beautyInsiderSummaryCTA: BiSummaryRedirectEnhancer
        };

        const Enhancer = enhancerMap[enhancerType] || null;
        const SOTTrackingEvent = trackingMap[enhancerType] || null;

        return Enhancer ? (
            <Enhancer
                SOTTrackingEvent={SOTTrackingEvent}
                {...enhancerProps}
            />
        ) : null;
    };

    const { content } = props;
    const fragments = MarkdownEnhancer.getContentInObjects(content);
    const components = fragments.map(x => (typeof x === 'object' ? createEnhancer(x) : MarkdownEnhancer.markedFragment(x)));

    return (
        <>
            {components.map((x, i) => (
                <React.Fragment key={i}>{x}</React.Fragment>
            ))}
        </>
    );
}

export default wrapFunctionalComponent(EnhancedMarkdown, 'EnhancedMarkdown');
