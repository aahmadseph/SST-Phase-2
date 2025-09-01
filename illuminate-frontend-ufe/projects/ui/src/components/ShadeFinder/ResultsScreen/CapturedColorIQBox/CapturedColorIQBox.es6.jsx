import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { PREFERENCE_TYPES } from 'constants/beautyPreferences';
import {
    Box, Button, Flex, Icon, Text
} from 'components/ui';

const { wrapComponent } = FrameworkUtils;

class CapturedColorIQBox extends BaseClass {
    state = {
        isHidden: false
    };

    handleCloseBox = () => {
        this.setState({ isHidden: true });
        this.props.unsetCapturedColorIQPref();
    };

    handleSave = () => {
        const { isNonBIUser, isSignedIn, openRegisterBIModal, openSignInModal } = this.props;

        if (isNonBIUser) {
            return openRegisterBIModal();
        }

        if (isSignedIn) {
            return this.saveBeautyPreferences();
        }

        return openSignInModal();
    };

    handleShowSavedPrefsModal = () => {
        const { localization, redirectToBeautyPrefsPage, showModal } = this.props;
        const { savedPrefsModalTitle, savedPrefsModalMessage, savedPrefsModalCancelButton, infoModalButton } = localization;

        const modalTitleWithIcon = (
            <>
                <Icon
                    name='circleCheck'
                    size={20}
                    marginRight={2}
                    color='green'
                />
                {savedPrefsModalTitle}
            </>
        );

        const options = {
            title: modalTitleWithIcon,
            message: savedPrefsModalMessage,
            buttonText: infoModalButton,
            buttonWidth: 124,
            footerColumns: 'repeat(2, 203px 1fr)',
            cancelButtonCallback: redirectToBeautyPrefsPage,
            cancelText: savedPrefsModalCancelButton
        };

        showModal(options);
    };

    saveBeautyPreferences = () => {
        const {
            updateBeautyPreferences,
            showInterstice,
            beautyPreferences,
            userProfileId,
            localization,
            capturedColorIQPref,
            fireAnalytics,
            showSaveErrorModal
        } = this.props;

        const { errorSavingModalTitle, errorSavingModalMessage, errorSavingModalButton } = localization;

        showInterstice(true);

        const successCallback = () => {
            showInterstice(false);
            this.handleShowSavedPrefsModal();
            this.handleCloseBox();
            fireAnalytics();
        };

        const errorCallback = () => {
            showInterstice(false);
            showSaveErrorModal();
        };

        const colorIQCategory = { type: PREFERENCE_TYPES.COLOR_IQ };
        const colorIQPref = {
            labValue: capturedColorIQPref.labValue,
            shadeCode: capturedColorIQPref.shadeCode
        };

        updateBeautyPreferences(
            colorIQCategory,
            userProfileId,
            colorIQPref,
            beautyPreferences,
            successCallback,
            errorSavingModalTitle,
            errorSavingModalMessage,
            errorSavingModalButton,
            errorCallback
        );
    };

    render() {
        const {
            capturedColorIQPref, isCaFrench, isGuest, localization, showTooltipModal
        } = this.props;

        if (this.state.isHidden || !capturedColorIQPref) {
            return null;
        }

        return (
            <Flex
                flexDirection={['column', 'row']}
                alignItems={['start', isGuest ? 'start' : 'center']}
                backgroundColor='lightBlue'
                borderRadius={2}
                marginY={4}
                padding={3}
                paddingRight={[null, isCaFrench ? 6 : null]}
                gap={[2, 4]}
                position='relative'
            >
                <Flex
                    alignItems='center'
                    backgroundColor='white'
                    borderRadius={3}
                    padding='10px'
                >
                    <Box
                        display='inline-block'
                        backgroundColor={`#${capturedColorIQPref.hexCode}`}
                        marginRight={2}
                        borderRadius='full'
                        width={26}
                        height={26}
                    />
                    <Text children={capturedColorIQPref.shadeDesc} />
                </Flex>
                <Flex
                    flex={1}
                    flexDirection={['column', isGuest ? 'column' : 'row']}
                    alignItems={['start', isGuest ? 'start' : 'center']}
                    flexWrap='wrap'
                    gap={[2, isGuest ? 2 : 0]}
                >
                    <Text
                        is='p'
                        display='inline-block'
                        marginRight={[null, isGuest ? null : 4]}
                        fontSize={['sm', 'base']}
                        lineHeight='tight'
                    >
                        <Text children={localization.saveYourBeauryPrefs} />
                        <Box
                            is='span'
                            display='inline-block'
                            color='#757575'
                            marginLeft={1}
                            data-at={Sephora.debug.dataAt('info_btn')}
                            onClick={showTooltipModal}
                        >
                            <Icon
                                name='infoOutline'
                                size={13}
                            />
                        </Box>
                    </Text>
                    <Button
                        variant='secondary'
                        size='xs'
                        children={localization.saveButtonText}
                        onClick={this.handleSave}
                    />
                </Flex>
                <Box
                    position='absolute'
                    top={[3, 4]}
                    right={[3, 4]}
                    lineHeight={0}
                    data-at={Sephora.debug.dataAt('cross_btn')}
                    onClick={this.handleCloseBox}
                >
                    <Icon
                        name='x'
                        size={9}
                    />
                </Box>
            </Flex>
        );
    }
}

CapturedColorIQBox.defaultProps = {};

CapturedColorIQBox.propTypes = {
    fireAnalytics: PropTypes.func.isRequired,
    isCaFrench: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired,
    isNonBIUser: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    redirectToBeautyPrefsPage: PropTypes.func.isRequired,
    openRegisterBIModal: PropTypes.func.isRequired,
    openSignInModal: PropTypes.func.isRequired,
    showInterstice: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    showSaveErrorModal: PropTypes.func.isRequired,
    showTooltipModal: PropTypes.func.isRequired,
    updateBeautyPreferences: PropTypes.func.isRequired,
    unsetCapturedColorIQPref: PropTypes.func.isRequired
};

export default wrapComponent(CapturedColorIQBox, 'CapturedColorIQBox');
