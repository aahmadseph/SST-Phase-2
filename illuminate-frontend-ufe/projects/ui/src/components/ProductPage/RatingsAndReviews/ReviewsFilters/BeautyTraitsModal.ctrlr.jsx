/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import Actions from 'Actions';
import { Button, Grid } from 'components/ui';
import Modal from 'components/Modal/Modal';

import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/ReviewsFilters/locales', 'ReviewsFilters');

class BeautyTraitsModal extends BaseClass {
    requestClose = () => {
        store.dispatch(Actions.showBeautyTraitsModal({ isOpen: false }));
    };

    editProfile = () => {
        store.dispatch(Actions.showBeautyTraitsModal({ isOpen: false }));
        this.props.checkStatusCallback();
    };

    render() {
        return (
            <Modal
                isDrawer={true}
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{getText('title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {getText('saveTraits')}
                    <br />
                    {getText('experience')}
                    <strong>{getText('experienceValues')}</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Grid
                        gap={[2, 4]}
                        columns={2}
                    >
                        <Button
                            variant='primary'
                            onClick={this.editProfile}
                            children={getText('addTraits')}
                        />
                        <Button
                            variant='secondary'
                            onClick={this.requestClose}
                            children={getText('cancel')}
                        />
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(BeautyTraitsModal, 'BeautyTraitsModal', true);
