import InflateComponents from 'utils/framework/InflateComponents';
import withRootComponentProps from 'utils/framework/withRootComponentProps';
import withReduxProvider from 'utils/framework/wrapWithReduxProvider';
import SpaUtils from 'utils/Spa';
import Header from 'components/Header';
import GlobalModalsWrapper from 'components/GlobalModals/GlobalModalsWrapper';
import GlobalContent from 'components/GlobalContent/GlobalContent';
import { HydrationFinished, PostLoad } from 'constants/events';
import withEmotionGlobal from 'utils/framework/wrapWithEmotionGlobalStyles';

Sephora.Util.InflatorSPA = {};
const HOCWrappingIsDisabled = Sephora.configurationSettings.core.disableHOCWrapping === true;

const createDisplayNameAsForSSR = component => {
    if (HOCWrappingIsDisabled) {
        const { displayName } = component;
        // Include all HOC names in the display name
        const ssrDisplayName = `ReduxProvider(EmotionGlobalProvider(${displayName}))`;

        return ssrDisplayName;
    } else {
        // Wrap original component with HOCs to get the display name as it was used during SSR
        const { displayName: ssrDisplayName } = withReduxProvider(withEmotionGlobal(component));

        return ssrDisplayName;
    }
};

const renderRootComponent = component => {
    const displayName = createDisplayNameAsForSSR(component);
    const element = document.body.querySelector(`[rootid="${displayName}"]`);

    if (element) {
        const componentWithProps = withReduxProvider(withEmotionGlobal(withRootComponentProps(component, displayName)));
        InflateComponents.render(componentWithProps, null, element);
    }
};

const renderRootComponents = async () => {
    const isSpaPage = SpaUtils.isSpaTemplate(Sephora.renderedData.template);
    let Page;

    if (isSpaPage) {
        Page = (await import(/* webpackMode: "eager" */ '../../SpaApplication')).default;
    } else {
        Page = Sephora.combinedPages[Sephora.renderedData.template];
    }

    renderRootComponent(Header);
    renderRootComponent(Page);
    renderRootComponent(GlobalModalsWrapper);
    renderRootComponent(GlobalContent);

    Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished = true;
    window.dispatchEvent(new CustomEvent(HydrationFinished));
    Sephora.Util.Perf.report(HydrationFinished);
};

const renderPostLoadRootComponents = async () => {
    Sephora.Util.Perf.report('PostLoad Ready');

    const Footer = (await import(/* webpackChunkName: "postload" */ 'components/Footer')).default;
    const { PostloadedGAdTagList } = (await import(/* webpackChunkName: "postload" */ 'components/GAdTag')).default;

    InflateComponents.services.loadEvents[PostLoad] = true;
    window.dispatchEvent(new CustomEvent(PostLoad));

    renderRootComponent(Footer);
    renderRootComponent(PostloadedGAdTagList);

    Sephora.Util.Perf.report('Post Load Rendered');
};

export default {
    renderPostLoadRootComponents,
    renderRootComponents
};
