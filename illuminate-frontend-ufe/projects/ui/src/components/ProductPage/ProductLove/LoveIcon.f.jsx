import React from 'react';
import { space } from 'style/config';
import { Icon } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import withLoveInteractions from 'components/ProductPage/ProductLove/withLoveInteractions';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage');

// The LoveIcon component uses a Higher Order Component
// for shared functionality, see withLoveInteractions.js
const LoveIcon = props => {
    const {
        skuLoveData, mouseEnter, mouseLeave, isActive, hover, handleOnClick
    } = props;

    const isHoverOrActive = isActive || hover;

    return (
        <button
            aria-label={getText('addToLoves')}
            data-at={Sephora.debug.dataAt(isActive ? 'loved' : 'unloved')}
            onClick={e => handleOnClick(e, skuLoveData)}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            css={{
                lineHeight: 0,
                padding: space[2],
                margin: -space[2]
            }}
        >
            <Icon
                name={isHoverOrActive ? 'heart' : 'heartOutline'}
                color={isHoverOrActive && 'red'}
                size={[20, null, 26]}
            />
        </button>
    );
};

export default withLoveInteractions(wrapFunctionalComponent(LoveIcon, 'LoveIcon'));
