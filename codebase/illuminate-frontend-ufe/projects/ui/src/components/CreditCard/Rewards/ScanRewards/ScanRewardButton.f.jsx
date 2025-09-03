import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image, Button } from 'components/ui';
import languageLocale from 'utils/LanguageLocale';

const ScanRewardButton = props => {
    const getText = languageLocale.getLocaleResourceFile('components/CreditCard/Rewards/ScanRewards/locales', 'ScanRewardButton');

    const { id, showBarCode, text = getText('showBarcode'), activeId } = props;

    return (
        <Button
            marginTop={5}
            block={true}
            variant='secondary'
            onClick={e => showBarCode(e, id)}
            style={activeId === id ? { display: 'none' } : null}
        >
            <Image
                src='/img/ufe/barcode.svg'
                disableLazyLoad
                width={20}
                height={16}
                marginRight={2}
            />
            {text}
        </Button>
    );
};

export default wrapFunctionalComponent(ScanRewardButton, 'ScanRewardButton');
