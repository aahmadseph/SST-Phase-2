import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import store from 'Store';
import Actions from 'Actions';
import Modal from 'components/Modal/Modal';
import { Flex, Link } from 'components/ui';
import Samples from 'components/Samples/Samples';
import Location from 'utils/Location';

import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class SampleModal extends BaseClass {
    state = {
        isInBasket: false,
        isSampleDisabled: false
    };

    isDone = () => {
        store.dispatch(Actions.showSampleModal({ isOpen: false }));
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/SampleModal/locales', 'SampleModal');

        const { isOpen, allowedQtyPerOrder, analyticsContext } = this.props;
        const isReplacementOrder = Location.isReplacementOrderPage();

        return (
            <Modal
                hasBodyScroll={true}
                isOpen={isOpen}
                onDismiss={this.isDone}
                showDismiss={isReplacementOrder}
            >
                <Modal.Header>
                    <Flex
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Modal.Title data-at={Sephora.debug.dataAt('samples_title')}>
                            {getText(isReplacementOrder ? 'alterTitle' : 'selectUpToSamples', [allowedQtyPerOrder])}
                        </Modal.Title>
                        {!isReplacementOrder && (
                            <Link
                                color='blue'
                                padding={3}
                                margin={-3}
                                onClick={this.isDone}
                                data-at={Sephora.debug.dataAt('samples_done_btn')}
                            >
                                {getText('done')}
                            </Link>
                        )}
                    </Flex>
                </Modal.Header>
                <Modal.Body>
                    <Samples
                        analyticsContext={analyticsContext}
                        allowedQtyPerOrder={allowedQtyPerOrder}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(SampleModal, 'SampleModal', true);
