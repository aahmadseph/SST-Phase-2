import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Icon, Button } from 'components/ui';
import languageLocale from 'utils/LanguageLocale';
import myListsUtils from 'utils/MyLists';

const getText = (text, vars) =>
    languageLocale.getLocaleResourceFile('components/Product/ProductLove/ProductLoveButton/locales', 'ProductLoveButton')(text, vars);

function ProductLoveButton({
    skuLoveData, mouseEnter, mouseLeave, isActive, hover, isCustomSetsProduct, handleOnClick, ...props
}) {
    const extraText = isCustomSetsProduct ? getText('allText') : '';
    const isHoverOrActive = isActive || hover;
    const isSharableListEnabled = myListsUtils.isSharableListEnabled();
    let buttonText = '';

    if (isActive) {
        if (hover) {
            buttonText = `${getText('unLoveText')}${extraText}`;
        } else {
            buttonText = `${getText('lovedText')}${extraText}`;
        }
    } else {
        buttonText = isSharableListEnabled ? getText('addToLists', [extraText]) : getText('addAllText', [extraText]);
    }

    return (
        <Button
            variant='secondary'
            data-at={Sephora.debug.dataAt(isActive ? 'loved' : 'unloved')}
            onClick={e => handleOnClick(e, skuLoveData)}
            onMouseEnter={mouseEnter}
            onFocus={mouseEnter}
            onMouseLeave={mouseLeave}
            onBlur={mouseLeave}
            {...props}
        >
            <Icon
                name={isHoverOrActive ? 'heart' : 'heartOutline'}
                color={isHoverOrActive && 'red'}
                size='1.5em'
                marginRight='.375em'
            />
            {buttonText}
        </Button>
    );
}

export default wrapFunctionalComponent(ProductLoveButton, 'ProductLoveButton');
