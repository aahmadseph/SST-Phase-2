import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import store from 'Store';
import Actions from 'Actions';
import { Button, Text, Link } from 'components/ui';
import Modal from 'components/Modal/Modal';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { getLocaleResourceFile } = localeUtils;
const getText = resourceWrapper(getLocaleResourceFile('components/GlobalModals/FreeReturnsModal/locale', 'FreeReturnsModal'));

function requestClose() {
    store.dispatch(Actions.showFreeReturnsModal({ isOpen: false }));
}

function FreeReturnsModal({ isOpen }) {
    return (
        <Modal
            isOpen={isOpen}
            onDismiss={requestClose}
            width={0}
        >
            <Modal.Header>
                <Modal.Title>{getText('freeReturns')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='p'
                    marginBottom={3}
                    fontWeight='bold'
                >
                    {getText('subHeader')}
                </Text>
                {localeUtils.isUS() && (
                    <p>
                        New or gently used products can be returned in person to any Sephora store or by mail with our pre-paid return shipping label.
                        No return shipping or handling fees apply. Buy Online, Pick Up In Store and Instacart orders can only be returned in store.
                        Gift cards and intimate devices are not eligible for returns.{' '}
                        <Link
                            color='blue'
                            underline={true}
                            padding={2}
                            margin={-2}
                            target='_blank'
                            href='https://www.sephora.com/beauty/returns-exchanges'
                        >
                            Learn more
                        </Link>
                    </p>
                )}
                {localeUtils.isCanada() && (
                    <p>
                        {getText('canadaText')}{' '}
                        <Link
                            color='blue'
                            underline={true}
                            padding={2}
                            margin={-2}
                            target='_blank'
                            href='https://www.sephora.com/ca/en/beauty/returns-exchanges'
                        >
                            {getText('learnMore')}
                        </Link>
                    </p>
                )}
            </Modal.Body>
            <Modal.Footer textAlign='center'>
                <Button
                    width={['100%', 'auto']}
                    hasMinWidth={true}
                    variant='primary'
                    onClick={requestClose}
                >
                    {getText('gotIt')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default wrapFunctionalComponent(FreeReturnsModal, 'FreeReturnsModal');
