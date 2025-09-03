import React from 'react';
import Store from 'Store';
import Actions from 'Actions';
import { Link, Text } from 'components/ui';
import languageLocaleUtils from 'utils/LanguageLocale';

const { dispatch } = Store;
const { getLocaleResourceFile } = languageLocaleUtils;
const { showInfoModal } = Actions;
const getText = getLocaleResourceFile('utils/locales', 'SDDRougeTestV2InfoModal');

const showModal = (callback, SDDRougeTestThreshold) => {
    const onClick = () => {
        callback();

        return dispatch(showInfoModal({ isOpen: false }));
    };

    const message = (
        <Text is='p'>
            {getText('ssdRougeTestV2InfoModalMsg1', [SDDRougeTestThreshold])}
            <br />
            <br />
            {getText('ssdRougeTestV2InfoModalMsg2')}{' '}
            <Link
                color='blue'
                onClick={onClick}
                children={getText('ssdRougeTestV2InfoModalMsgLink')}
            />{' '}
            {getText('ssdRougeTestV2InfoModalMsg3')}
        </Text>
    );

    return dispatch(
        showInfoModal({
            isOpen: true,
            title: getText('ssdRougeTestV2InfoModalTitle'),
            message,
            buttonText: getText('ssdRougeTestV2InfoModalMsgButton')
        })
    );
};

export default { showModal };
