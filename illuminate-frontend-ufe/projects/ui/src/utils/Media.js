import { breakpoints } from 'style/config';
import { createMedia } from '@artsy/fresnel';

const AppMedia = createMedia({
    breakpoints: {
        xs: 0,
        sm: parseInt(breakpoints[0]),
        md: parseInt(breakpoints[1]),
        lg: parseInt(breakpoints[2])
    },
    interactions: {
        hover: '(hover: hover)',
        notHover: '(hover: none)'
    }
});

// Generate CSS to be injected into the head
const mediaStyle = AppMedia.createMediaStyle();

const { Media, MediaContextProvider, findBreakpointAtWidth } = AppMedia;

const isMobileView = () => {
    // preventing execution on server side
    if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
        return window?.matchMedia(breakpoints.smMax).matches;
    }

    return false;
};

export default {
    mediaStyle,
    Media,
    MediaContextProvider,
    findBreakpointAtWidth,
    isMobileView
};
