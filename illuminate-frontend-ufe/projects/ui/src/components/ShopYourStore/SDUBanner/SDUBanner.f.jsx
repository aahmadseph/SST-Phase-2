import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text, Button } from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import Empty from 'constants/empty';
import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal';

function SDUBanner(props) {
    const {
        localization, showSDULandingPageModal, isSDULandingPageModalOpen, isUserSDUTrialEligible, isSDUAddedToBasket
    } = props;
    const closeSDULandingPageModal = () => showSDULandingPageModal(false);

    return (
        <Box
            backgroundColor={['nearWhite', null, 'white']}
            borderColor={[null, null, 'lightGray']}
            borderRadius={3}
            borderWidth={[0, null, 1]}
            marginTop={4}
            padding={3}
        >
            <Box>
                <Text
                    color='red'
                    fontWeight='bold'
                >
                    {localization.getFreeSameDayDelivery}
                </Text>
                <Markdown content={localization.startSaving} />
                <Button
                    size='xs'
                    variant='secondary'
                    marginTop={2}
                    fontWeight='bold'
                    onClick={showSDULandingPageModal}
                >
                    {localization.tryNowForFree}
                </Button>
            </Box>
            <SDULandingPageModal
                skipConfirmationModal
                isOpen={isSDULandingPageModalOpen}
                onDismiss={closeSDULandingPageModal}
                isSDUAddedToBasket={isSDUAddedToBasket}
                isUserSDUTrialEligible={isUserSDUTrialEligible}
            />
        </Box>
    );
}

SDUBanner.propTypes = {
    localization: PropTypes.object,
    isSDULandingPageModalOpen: PropTypes.bool,
    showSDULandingPageModal: PropTypes.func
};

SDUBanner.defaultProps = {
    localization: Empty.Object,
    isSDULandingPageModalOpen: false,
    showSDULandingPageModal: Empty.Function
};

export default wrapFunctionalComponent(SDUBanner, 'SDUBanner');
