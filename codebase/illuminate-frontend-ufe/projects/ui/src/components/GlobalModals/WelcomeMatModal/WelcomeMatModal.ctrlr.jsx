/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import {
    Text, Button, Box, Link
} from 'components/ui';
import UrlUtils from 'utils/Url';
import Location from 'utils/Location';

const { getLink } = UrlUtils;

class WelcomeMatModal extends BaseClass {
    continueToSephora = e => {
        e.preventDefault();
        const { onDismiss } = this.props;
        onDismiss();
        Location.navigateTo(e, '/');
    };

    continueToInternationalSites = e => {
        const { onDismiss } = this.props;
        onDismiss();
        const link = getLink('/beauty/international-websites');
        Location.navigateTo(e, link);
    };

    render() {
        const {
            isOpen,
            onDismiss,
            localization: {
                accessMessage1, accessMessage2, doesNotShip, internationalSites, continueTo
            }
        } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismiss}
                width={2}
                showDismiss={true}
                isDrawer={true}
                disableFocusTrap={true}
            >
                <Modal.Body padForX={true}>
                    <Box textAlign='center'>
                        <Text
                            is='p'
                            fontSize='xl'
                            fontWeight='bold'
                            marginBottom={4}
                        >
                            {accessMessage1}
                            <br />
                            <Link
                                color='blue'
                                onClick={this.continueToSephora}
                            >
                                Sephora.com
                            </Link>{' '}
                            (USA & Canada) <br />
                            {accessMessage2}
                        </Text>
                        <Text
                            is='p'
                            fontSize='lg'
                            marginBottom={4}
                            children={doesNotShip}
                        />
                        <Button
                            variant='special'
                            marginBottom={4}
                            onClick={this.continueToInternationalSites}
                            children={internationalSites}
                        />
                        <Text
                            is='p'
                            fontSize='sm'
                        >
                            {continueTo}
                            <Link
                                color='blue'
                                onClick={this.continueToSephora}
                            >
                                Sephora.com
                            </Link>
                            {'.'}
                        </Text>
                    </Box>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(WelcomeMatModal, 'WelcomeMatModal', true);
