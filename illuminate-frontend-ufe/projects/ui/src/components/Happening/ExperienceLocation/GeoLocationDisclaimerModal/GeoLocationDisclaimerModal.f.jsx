import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import {
    Button, Grid, Link, Text
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

function GeoLocationDisclaimerModal({ showGeoLocationDisclaimerModal, onAcceptGeoLocationDisclaimer, onCloseModal }) {
    const getText = localeUtils.getLocaleResourceFile(
        'components/Happening/ExperienceLocation/GeoLocationDisclaimerModal/locales',
        'GeoLocationDisclaimerModal'
    );

    return (
        <Modal
            width={0}
            isOpen={showGeoLocationDisclaimerModal}
            onDismiss={onCloseModal}
        >
            <Modal.Header>
                <Modal.Title>{getText('useMyLocation')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text>
                    {getText('useMyLocationText')}
                    <Link
                        href='https://policies.google.com/privacy?hl=en-US'
                        color='blue'
                        target='_blank'
                        children={getText('privacyPolicy')}
                    />
                    {'.'}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Grid
                    gap={4}
                    columns={2}
                >
                    <Button
                        variant='secondary'
                        onClick={onCloseModal}
                    >
                        {getText('nevermind')}
                    </Button>
                    <Button
                        variant='primary'
                        onClick={() => {
                            onAcceptGeoLocationDisclaimer();
                            onCloseModal();
                        }}
                    >
                        {getText('continue')}
                    </Button>
                </Grid>
            </Modal.Footer>
        </Modal>
    );
}

GeoLocationDisclaimerModal.propTypes = {
    showGeoLocationDisclaimerModal: PropTypes.bool,
    onAcceptGeoLocationDisclaimer: PropTypes.func,
    onCloseModal: PropTypes.func
};

GeoLocationDisclaimerModal.defaultProps = {
    showGeoLocationDisclaimerModal: false
};

export default wrapFunctionalComponent(GeoLocationDisclaimerModal, 'GeoLocationDisclaimerModal');
