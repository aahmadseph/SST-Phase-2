/* eslint max-len: [2, 200] */
import urlUtils from 'utils/Url';
import mediaUtils from 'utils/Media';
import { breakpoints, site, radii } from 'style/config';
import keyConsts from 'utils/KeyConstants';
import { keyframes } from '@emotion/react';

let forcedUnlockedState = false;

const { findBreakpointAtWidth } = mediaUtils;

const ANIMATE_FADE = keyframes`
    from { opacity: 0.08 }
    to { opacity: 0.14 }
`;

const ANIMATE_SKELETON = {
    background: '#000',
    animationName: ANIMATE_FADE,
    animationDirection: 'alternate',
    animationDuration: '1s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out'
};

const SKELETON_ANIMATION = {
    position: 'relative',
    overflow: 'hidden',
    background: '#fff',
    '&, & *': {
        color: 'transparent !important'
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        ...ANIMATE_SKELETON,
        borderRadius: 'inherit'
    }
};

const SKELETON_OVERLAY = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: '#fff',
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        ...ANIMATE_SKELETON
    }
};

const SKELETON_TEXT = [
    SKELETON_ANIMATION,
    {
        borderRadius: radii.full,
        width: 'fit-content'
    }
];

// Requires block text elements to have an inner span
const SKELETON_COPY = {
    '& h1, & h2, & h3, & h4, & h5, & h6, & p, & li': {
        '& > span': {
            ...ANIMATE_SKELETON,
            display: 'unset',
            borderRadius: radii.full,
            WebkitBoxDecorationBreak: 'clone',
            boxDecorationBreak: 'clone',
            '&, & *': {
                color: 'transparent !important'
            }
        }
    }
};

const UI = {
    SKELETON_ANIMATION,
    SKELETON_OVERLAY,
    SKELETON_TEXT,
    SKELETON_COPY,

    toggleMain: function () {
        if (Sephora.isMobile()) {
            var main = document.getElementById('main');
            main.classList.toggle('active');
            main.classList.toggle('in');
        }
    },

    /**
     * Lock the body once your element needs it,
     * and unlock it right after its closed
     */
    preventBackgroundScroll: function (elementIsOpen) {
        if (!Sephora.isNodeRender) {
            if (elementIsOpen && document.body.style.overflow !== 'hidden') {
                document.body.style.overflow = 'hidden';
            } else if (!elementIsOpen && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = '';
            }
        }
    },

    lockBackgroundPosition: function (forced = false) {
        if (forced) {
            forcedUnlockedState = false;
        }

        if (document.body.style.position !== 'fixed' && !forcedUnlockedState) {
            const offset = window.scrollY;
            const doc = document.documentElement;
            Object.assign(document.body.style, {
                position: 'fixed',
                top: offset * -1 + 'px',
                width: '100%',
                overflowY: ''
            });
            doc.style.height = window.innerHeight + 'px';
            doc.style.overflow = 'hidden';
        }
    },

    unlockBackgroundPosition: function (forced = false) {
        forcedUnlockedState = forced;

        if (document.body.style.position === 'fixed') {
            document.documentElement.style.height = '';
            document.documentElement.style.overflow = '';
            const scrollPosition = parseInt(document.body.style.top, 10) * -1;
            Object.assign(document.body.style, {
                position: '',
                top: '',
                width: ''
            });
            window.scrollTo(0, scrollPosition);
        }
    },

    isBackgroundLocked: function () {
        return document.body.style.position === 'fixed';
    },

    getSrcSet: function (src) {
        if (src) {
            const imagePath = urlUtils.getImagePath(src);

            return imagePath + ' 1x, ' + imagePath + ' 2x';
        } else {
            return null;
        }
    },

    getRetinaSrcSet: function (src) {
        if (src) {
            const ext = src.substring(src.lastIndexOf('.') + 1);
            const src2x = src.replace('.' + ext, '@2x.' + ext);

            return urlUtils.getImagePath(src) + ' 1x, ' + urlUtils.getImagePath(src2x) + ' 2x';
        } else {
            return null;
        }
    },

    scrollToTop: function () {
        // Cross-browser support: document.documentElement for Mozilla
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },

    scrollElementToTop: function (element) {
        element.scrollTop = 0;
    },

    // Smooth scroll to an element either by Ref or by ID
    scrollTo: function ({ ref, elementId, hasOffset = true, extraOffset = 0 }) {
        let element;

        if (ref && ref.current) {
            element = ref.current;
        } else if (document && elementId) {
            element = document.getElementById(elementId);
        }

        if (element && window) {
            const yAxis = element.getBoundingClientRect().top + window.scrollY;
            const offset = (hasOffset && window.matchMedia(breakpoints.xsMax).matches ? site.headerHeight : 0) + extraOffset;
            window.scroll({
                top: yAxis - offset,
                behavior: 'smooth'
            });
        }
    },

    observeElement: function (callback) {
        return new MutationObserver(callback);
    },

    hasHorizontalScrollBar: function (element = {}) {
        return element.scrollWidth > element.clientWidth;
    },

    refreshStuckUIRender: function () {
        if (!Sephora.isNodeRender && this.isIOS()) {
            const element = document.body;
            element.scrollTop++;
            element.scrollTop--;
        }
    },

    isIOS: function () {
        if (!Sephora.isNodeRender) {
            return /iPad|iPhone|iPod/.test(navigator.userAgent);
        }

        return false;
    },

    isAndroid: function () {
        if (typeof this.isAndroidDevice !== 'undefined') {
            return this.isAndroidDevice;
        }

        if (navigator && navigator.userAgent) {
            this.isAndroidDevice = navigator.userAgent.toLowerCase().indexOf('android') > -1;

            return this.isAndroidDevice;
        }

        return false;
    },

    isFirefox: function () {
        return /firefox/i.test(navigator.userAgent);
    },

    isChrome: function () {
        return /chrome/i.test(navigator.userAgent);
    },

    isMac: function () {
        if (!Sephora.isNodeRender && navigator && navigator.userAgent) {
            return /macintosh|mac os x/i.test(navigator.userAgent);
        }

        return false;
    },

    isWindows: function () {
        if (!Sephora.isNodeRender && navigator && navigator.userAgent) {
            return /windows/i.test(navigator.userAgent);
        }

        return false;
    },

    isSMUI: function () {
        return window?.matchMedia(breakpoints.xsMax).matches;
    },

    getScrollSmooth: function (element, offsetValue = -55) {
        const isMobile = Sephora.isMobile();
        const offset = isMobile ? offsetValue : 0;
        const el = document.getElementById(element);
        const y = el.getBoundingClientRect().top + window.pageYOffset + offset;

        window.scrollTo({ top: y, behavior: 'smooth' });
    },

    requestFrame: function (callback) {
        if (window.requestAnimationFrame && typeof window.requestAnimationFrame === 'function') {
            return requestAnimationFrame(callback);
        } else {
            return callback();
        }
    },

    cancelFrame: function (animationFrameHandle) {
        if (window.cancelAnimationFrame && typeof window.cancelAnimationFrame === 'function') {
            cancelAnimationFrame(animationFrameHandle);
        }
    },

    restoreScrollPosition: function () {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    },

    uuid: function (length) {
        const start = 2;

        return Math.random()
            .toString(36)
            .substring(start, start + length);
    },

    getBreakpoint: function () {
        return findBreakpointAtWidth(window.innerWidth);
    },

    isResponsiveLayout: () => Sephora.channel && Sephora.channel.toUpperCase() === 'RWD',

    getAriaButtonProps: function (defaultTag, props) {
        let tag = defaultTag;

        if (props.is) {
            tag = props.is;
        } else if (props.href) {
            tag = 'a';
        } else if (
            (props.onClick || props.type) &&
            // iOS safari doesn't support styling `button` element as `grid`
            props.display !== 'grid' &&
            !props.display?.includes('grid')
        ) {
            tag = 'button';
        }

        const ariaProps = {
            is: tag,
            // prevent form submission
            type: props.type || (tag === 'button' ? 'button' : null)
        };

        if (tag !== 'button' && !props.href && props.onClick) {
            ariaProps.tabIndex = props.tabIndex || 0;
            ariaProps.role = props.role || 'button';
            ariaProps.onClick = !props.disabled ? props.onClick : null;

            if (props.disabled) {
                ariaProps['aria-disabled'] = props.disabled;
            } else {
                ariaProps.onKeyPress = e => {
                    if (props.onClick) {
                        switch (e.key) {
                            case keyConsts.ENTER:
                            case keyConsts.SPACE:
                                e.preventDefault();
                                e.stopPropagation();
                                props.onClick(e);

                                break;
                            default:
                                break;
                        }
                    }

                    props.onKeyPress && props.onKeyPress(e);
                };
            }
        }

        return ariaProps;
    },

    getAppLink: function () {
        if (this.isIOS()) {
            return 'https://itunes.apple.com/us/app/sephora-makeup-beauty-more/id393328150';
        } else if (this.isAndroid()) {
            return 'https://play.google.com/store/apps/details?id=com.sephora';
        } else {
            return '';
        }
    },

    isIOSSafari: function () {
        if (!Sephora.isNodeRender) {
            const userAgent = navigator.userAgent;
            const isIOSDevice =
                ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
                (userAgent.includes('Mac') && 'ontouchend' in document);

            const isSafariBrowser = userAgent.includes('Safari') && !userAgent.includes('Chrome');

            return isIOSDevice && isSafariBrowser;
        }

        return false;
    }
};

export default UI;
