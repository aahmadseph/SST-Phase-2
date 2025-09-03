import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import getBaseComponent from 'utils/framework/getBaseComponent';
import getStyledComponent from 'utils/framework/getStyledComponent';
import {
    compose, border, space, layout
} from 'styled-system';
import theme from 'style/theme';

const StyledImg = getStyledComponent({
    InnerComp: getBaseComponent({
        elementType: 'img',
        isBasicElement: false,
        useRef: true
    }),
    styledProps: [props => [props.baseCss, compose(layout, border, space), props.css]]
});

class Image extends BaseClass {
    imageRef = React.createRef();

    render() {
        const {
            alt, disableLazyLoad, isPageRenderImg, pageRenderImageIdentifier, role, src, srcSet, loading, ...props
        } = this.props;

        const isLazyLoaded = !isPageRenderImg && !disableLazyLoad;

        // When pageRenderImageIdentifier property is provided we have to use it instead of `src`
        // It's important for page render report because we need to use the same image identifier always
        // otherwise page render report time will be bigger than it actually was
        // For example it happens when we render next markup:
        // <picture>
        //     <source srcSet="urlA x1 urlB x3" />
        //     <img src="urlC" srcSet="urlC x1 urlD x2" />
        // </picture>
        // For the scenario from example above we need to use urlA from upper <source> tag rather than own
        // This is what we do when we render <Image/> component inside <ProductImage/> component
        // Primarily browser will try to render image from <source /> tag when <img /> will be used for fallback case
        // More info here - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
        const imageIdentifier = pageRenderImageIdentifier || src;

        // This needs to be done so that the page render event triggers even if the image
        // is rerendered before the image onload event has fired.
        // https://jira.sephora.com/browse/UA-604
        if (isPageRenderImg) {
            const originalDidMount = this.componentDidMount,
                originalDidUpdate = this.componentDidUpdate;
            const _self = this;

            const listenToOnload = () => {
                if (originalDidMount) {
                    originalDidMount.apply(_self);
                }

                if (originalDidUpdate) {
                    originalDidUpdate.apply(_self);
                }

                _self.componentDidMount = originalDidMount;
                _self.componentDidUpdate = originalDidUpdate;

                const img = this.imageRef.current;
                const imgLoadHandler = event => {
                    let imageSource;

                    if (event) {
                        const { target = {} } = event;
                        imageSource = target.currentSrc || target.src;
                    } else {
                        imageSource = img.currentSrc || img.src;
                    }

                    Sephora.Util.Perf.markPageRenderDedup(imageIdentifier, imageSource);
                    img.removeEventListener('load', imgLoadHandler);
                };

                if (img) {
                    if (img.complete) {
                        imgLoadHandler();
                    } else {
                        img.addEventListener('load', imgLoadHandler);
                    }
                }
            };

            this.componentDidMount = listenToOnload.bind(this);
            this.componentDidUpdate = listenToOnload.bind(this);
        }

        const imgElement = (
            <StyledImg
                src={src}
                srcSet={srcSet}
                loading={isLazyLoaded ? 'lazy' : loading}
                role={alt ? role : 'presentation'}
                alt={alt || ''}
                {...props}
                fetchpriority={isPageRenderImg ? 'high' : 'auto'}
                __ref={this.imageRef}
            />
        );

        if (isPageRenderImg) {
            if (Sephora.isNodeRender) {
                return (
                    <>
                        {imgElement}
                        <script dangerouslySetInnerHTML={{ __html: `Sephora.Util.Perf.markPageRender("${imageIdentifier}");` }} />
                    </>
                );
            } else {
                // Don't count images added to the page after the post load event fires
                Sephora.Util.Perf.imageExpectedDedup(imageIdentifier);

                return imgElement;
            }
        } else {
            return imgElement;
        }
    }
}

Image.defaultProps = {
    theme,
    display: 'inline-block',
    maxWidth: '100%',
    disableLazyLoad: null,
    isPageRenderImg: null
};

export default wrapComponent(Image, 'Image', true);
