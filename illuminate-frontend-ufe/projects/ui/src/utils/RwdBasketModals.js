import React from 'react';
import Actions from 'actions/Actions';
import Store from 'store/Store';
import Markdown from 'components/Markdown/Markdown';
import helperUtils from 'utils/Helpers';
import languageLocaleUtils from 'utils/LanguageLocale';

const { dispatch } = Store;
const { getLocaleResourceFile } = languageLocaleUtils;
const { showInfoModal } = Actions;
const { replaceDoubleAsterisks } = helperUtils;

function showChangeMethodEmptyBasketModal({ basket, goToPickUpBasket, goToPreBasket }) {
    const getText = getLocaleResourceFile('utils/locales', 'RwdBasketModals');

    const { switchedItem, itemCount } = basket;
    const isEmptyBasket = switchedItem && itemCount === 0;

    const commonProps = {
        isOpen: true,
        showCloseButton: true,
        buttonWidth: 164,
        footerDisplay: 'flex',
        footerJustifyContent: 'flex-end',
        buttonText: getText('gotIt')
    };

    return isEmptyBasket
        ? dispatch(
            showInfoModal({
                title: getText('emptyBasket'),
                message: getText('emptyDcBasket'),
                callback: () => dispatch(goToPickUpBasket()),
                ...commonProps
            })
        )
        : switchedItem?.isBopisFirstItem &&
              dispatch(
                  showInfoModal({
                      title: getText('itemMoved'),
                      message: <Markdown content={replaceDoubleAsterisks(switchedItem.itemMovedMsg)} />,
                      callback: () => dispatch(goToPreBasket()),
                      ...commonProps
                  })
              );
}

export default { showChangeMethodEmptyBasketModal };
