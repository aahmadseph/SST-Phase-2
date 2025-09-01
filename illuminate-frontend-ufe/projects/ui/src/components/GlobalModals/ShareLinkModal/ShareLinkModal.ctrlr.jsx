import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'Store';
import Actions from 'Actions';

import Modal from 'components/Modal/Modal';
import { Grid, Text, Button } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import CopyToClipboard from 'react-copy-to-clipboard';
import localeUtils from 'utils/LanguageLocale';

import urlUtils from 'utils/Url';
import helpersUtils from 'utils/Helpers';
import processEvent from 'analytics/processEvent';
const { deferTaskExecution } = helpersUtils;
import anaConsts from 'analytics/constants';

class ShareLinkModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isCopied: false
        };
    }
    requestClose = () => {
        store.dispatch(Actions.showShareLinkModal(false));
    };

    handleOnCopy = () => {
        this.setState({
            isCopied: true
        });

        deferTaskExecution(() => {
            this.fireAnalytics();
        });
    };

    fireAnalytics = () => {
        const cleanedUrl = (this.props?.shareUrl || '').split('?')[0];
        const listId = urlUtils.getUrlLastFragment(cleanedUrl);

        // Dispatches the Share Event
        processEvent.process(anaConsts.SHARE_EVENT, {
            data: {
                method: 'Share',
                contentType: 'Loves List',
                itemId: listId
            }
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ShareLinkModal/locales', 'ShareLinkModal');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                isDrawer={this.props.isGallery}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>
                        {getText('share')} {this.props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.subTitle && (
                        <Text
                            is='p'
                            marginBottom={2}
                        >
                            {this.props.subTitle}
                        </Text>
                    )}
                    <Grid columns='1fr auto'>
                        <TextInput
                            marginBottom={null}
                            highlight={true}
                            value={this.props.shareUrl}
                            readOnly={true}
                            {...(this.props.isGallery && { label: 'URL' })}
                        />
                        <CopyToClipboard
                            text={this.props.shareUrl}
                            onCopy={this.handleOnCopy}
                        >
                            <Button variant='primary'>{this.state.isCopied ? getText('copied') : getText('copy')}</Button>
                        </CopyToClipboard>
                    </Grid>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ShareLinkModal, 'ShareLinkModal');
