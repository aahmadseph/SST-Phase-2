import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Button, Flex, Icon } from 'components/ui';
import Modal from 'components/Modal/Modal';
import PreferencesFilterList from 'components/PreferencesFilterList';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import analyticsConstants from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
const { mergeCustomerPreference, getNewCustomerPreference } = bpRedesignedUtils;

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { GUIDED_SELLING_SPOKE, MY_SEPHORA } = analyticsConstants.GUIDED_SELLING;

const getText = getLocaleResourceFile('components/GlobalModals/EditBeautyPreferencesModal/locales', 'EditBeautyPreferencesModal');
const SAVED_TEXT_TIMEOUT = 1000;

class EditBeautyPreferencesModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            updatedPreferences: {},
            isSaved: false,
            areTraitsSelected: true
        };
    }

    componentDidMount() {
        this.setState({
            updatedPreferences: this.props.beautyPreferencesToSave
        });
    }

    updateBeautyPreferencesToSave = preferences => {
        this.setState({ updatedPreferences: preferences }, () => {
            const flattenedArray = Object.values(preferences).flatMap(arr => arr);
            this.setState({ areTraitsSelected: flattenedArray.length });
        });
    };

    onUpdateBeautyPreferencesSuccess = () => {
        this.setState({ isSaved: true }, () => {
            setTimeout(() => {
                this.setState({ isSaved: false });
                this.close();
                this.props.hideSpoke();
            }, SAVED_TEXT_TIMEOUT);

            processEvent.process(analyticsConstants.LINK_TRACKING_EVENT, {
                data: {
                    pageName: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE} modal:n/a:*`,
                    actionInfo: `${MY_SEPHORA}:${GUIDED_SELLING_SPOKE}:save`
                }
            });
        });
    };

    onUpdateBeautyPreferences = () => {
        const { updateCustomerPreference, categorySpecificMasterList, customerPreference } = this.props;
        const { updatedPreferences } = this.state;
        const newCustomerPreference = getNewCustomerPreference(updatedPreferences, categorySpecificMasterList);
        const updatedCustomerPreference = mergeCustomerPreference(customerPreference, newCustomerPreference);

        updateCustomerPreference(null, updatedCustomerPreference, this.onUpdateBeautyPreferencesSuccess);
    };

    close = () => {
        this.props.showEditBeautyPreferencesModal({ isOpen: false });
    };

    render() {
        const { isSaved, areTraitsSelected } = this.state;

        return (
            <Modal
                isDrawer={true}
                width={0}
                showDismiss={true}
                hasBodyScroll={true}
                isOpen={this.props.isOpen}
                onDismiss={this.close}
            >
                <Modal.Header>
                    <Modal.Title children={getText('title')} />
                </Modal.Header>
                <Modal.Body paddingBottom={0}>
                    <PreferencesFilterList
                        filterPreferences={this.props.beautyPreferencesToSave}
                        columns={2}
                        selectAll={true}
                        onUpdatePreferences={this.updateBeautyPreferencesToSave}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Flex justifyContent='space-between'>
                        <Button
                            variant='secondary'
                            onClick={this.close}
                            block
                            marginRight={1}
                        >
                            {getText('cancel')}
                        </Button>
                        <Button
                            onClick={!isSaved && this.onUpdateBeautyPreferences}
                            variant='primary'
                            block
                            disabled={!areTraitsSelected}
                            marginLeft={1}
                        >
                            {isSaved ? (
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
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(EditBeautyPreferencesModal, 'EditBeautyPreferencesModal', true);
