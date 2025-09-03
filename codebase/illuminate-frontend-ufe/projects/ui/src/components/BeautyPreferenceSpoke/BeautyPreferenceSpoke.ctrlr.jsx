/* eslint-disable class-methods-use-this */
import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import {
    Box, Button, Flex, Icon, Text, Link
} from 'components/ui';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

import analyticsConstants from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
const { mergeCustomerPreference, getNewCustomerPreference } = bpRedesignedUtils;

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { wrapComponent } = FrameworkUtils;

const getText = getLocaleResourceFile('components/BeautyPreferenceSpoke/locales', 'BeautyPreferenceSpoke');
const SAVED_TEXT_TIMEOUT = 1500;
const { GUIDED_SELLING_SPOKE, MY_SEPHORA } = analyticsConstants.GUIDED_SELLING;

class BeautyPreferenceSpoke extends BaseClass {
    state = {
        isHidden: false,
        isSaved: false
    };

    componentDidMount() {
        processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: analyticsConstants.EVENT_NAMES.BEAUTY_PREFERENCES.SPOKE
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.beautyPreferencesToSave !== this.props.beautyPreferencesToSave) {
            this.setState({ isHidden: false });
        }
    }
    onHideSpoke = (shouldDismissBlueSpoke = false) => {
        this.setState({ isHidden: true });

        if (shouldDismissBlueSpoke) {
            this.props.onHideSpoke();
        }

        processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE}:cancel`
            }
        });
    };

    openEditBeautyPreferencesModal = () => {
        const { beautyPreferencesToSave, categorySpecificMasterList } = this.props;
        this.props.showEditBeautyPreferencesModal({ isOpen: true, beautyPreferencesToSave, categorySpecificMasterList, hideSpoke: this.onHideSpoke });

        processEvent.process(analyticsConstants.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE} modal:n/a:*`,
                linkData: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE}:edit`
            }
        });
    };

    onUpdateBeautyPreferencesSuccess = () => {
        processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE}:save`
            }
        });

        this.setState({ isSaved: true }, () => {
            setTimeout(() => {
                this.setState({ isSaved: false });
            }, SAVED_TEXT_TIMEOUT);
        });
    };

    onUpdateBeautyPreferences = () => {
        const { beautyPreferencesToSave, categorySpecificMasterList, updateCustomerPreference, customerPreference } = this.props;
        const newCustomerPreference = getNewCustomerPreference(beautyPreferencesToSave, categorySpecificMasterList);
        const updatedCustomerPreference = mergeCustomerPreference(customerPreference, newCustomerPreference);

        updateCustomerPreference(null, updatedCustomerPreference, this.onUpdateBeautyPreferencesSuccess);
    };

    getBeautyPreferenceString = preferences => {
        const prefToShow = preferences.length > 3 ? [...preferences.slice(0, 3), `+${preferences.length - 3}`] : preferences;
        const lastIndex = prefToShow.length - 1;
        const buildBeautyPreferenceString = prefToShow.map((beautyPref, index) => {
            return (
                <>
                    {index === 0 ? '' : index === lastIndex ? `${preferences.length >= 3 ? ',' : ''} ${getText('and')} ` : ', '}
                    <strong>{beautyPref}</strong>
                </>
            );
        });

        return buildBeautyPreferenceString;
    };

    getDescriptionText = preferences => {
        return (
            <Text>
                {`${getText('save')} `}
                {this.getBeautyPreferenceString(preferences)}
                {` ${getText('endDescription')}?`}
            </Text>
        );
    };

    disableBeautyPreferenceSpoke = () => {
        this.onHideSpoke(true);
        Storage.session.setItem(LOCAL_STORAGE.DISABLE_BEAUTY_PREFERENCES_SPOKE, true);

        processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE}:not now`
            }
        });
    };

    render() {
        if (this.state.isHidden) {
            return null;
        }

        const { beautyPreferencesToSave } = this.props;
        const preferences = Object.values(beautyPreferencesToSave).flatMap(preferencesToSave => preferencesToSave.map(pref => pref.value));

        return (
            <Flex
                flexDirection={['column', 'row']}
                alignItems={['start', 'center']}
                backgroundColor='lightBlue'
                borderRadius={2}
                marginBottom={[null, 4]}
                padding={3}
                gap={[2, 4]}
                position='relative'
            >
                <Flex
                    flex={1}
                    flexDirection={['column', 'row']}
                    alignItems={['start', 'center']}
                    flexWrap='wrap'
                    gap={[2, 0]}
                    minWidth='100%'
                >
                    <Text
                        is='p'
                        display='inline-block'
                        marginRight={[null, 3]}
                        fontSize={['sm', 'base']}
                        lineHeight='tight'
                    >
                        {this.getDescriptionText(preferences)}
                    </Text>
                    <Flex
                        gap={2}
                        alignItems='center'
                        justifyContent={['space-between', 'flex-start']}
                        minWidth={['100%', 'auto']}
                        justifyItems='end'
                    >
                        <Link
                            fontWeight='normal'
                            underline={true}
                            children={getText('notNow')}
                            onClick={this.disableBeautyPreferenceSpoke}
                        />
                        <Flex gap={2}>
                            {preferences.length > 1 && (
                                <Button
                                    variant='secondary'
                                    size='xs'
                                    onClick={this.openEditBeautyPreferencesModal}
                                    children={getText('edit')}
                                />
                            )}
                            <Button
                                variant='primary'
                                size='xs'
                                onClick={this.onUpdateBeautyPreferences}
                            >
                                {this.state.isSaved ? (
                                    <>
                                        {getText('saved')}
                                        <Icon
                                            name='checkmark'
                                            size='1em'
                                            marginLeft={1}
                                        />
                                    </>
                                ) : (
                                    <>{getText('save')}</>
                                )}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
                <Box
                    position='absolute'
                    top={[3, 4]}
                    right={[3, 4]}
                    bottom={[null, 4]}
                    lineHeight={0}
                    data-at={Sephora.debug.dataAt('cross_btn')}
                    onClick={() => this.onHideSpoke(true)}
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

BeautyPreferenceSpoke.propTypes = {
    beautyPreferencesToSave: PropTypes.array.isRequired
};

export default wrapComponent(BeautyPreferenceSpoke, 'BeautyPreferenceSpoke', true);
