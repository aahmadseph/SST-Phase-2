import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import propTypes from 'prop-types';
import store from 'Store';
import Actions from 'Actions';

import Modal from 'components/Modal/Modal';
import {
    Grid, Text, Button, Icon
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import CopyToClipboard from 'react-copy-to-clipboard';
import localeUtils from 'utils/LanguageLocale';
import { colors, space } from 'style/config';
import { COPY_LINK_TIMEOUT } from 'constants/sharableList';
import ViewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import myListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
import anaConsts from 'analytics/constants';

class ShareLoveListLinkModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isCopied: false
        };
    }

    copyTimeout = null;

    requestClose = () => {
        store.dispatch(Actions.showShareLoveListLinkModal({ isOpen: false }));
    };

    handleOnCopy = () => {
        const { skuIds } = this.props;
        myListsBindings.trackCopyLink({ skuIds });
        this.setState({
            isCopied: true
        });
        //STAG Analytics
        ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
            eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_SHARE_LINK_COPIED,
            shoppingListName: this.props?.loveListName,
            shoppingListId: this.props?.loveListId,
            shareLoveListUrl: this.props?.shareLoveListUrl
        });

        clearTimeout(this.copyTimeout);
        this.copyTimeout = setTimeout(() => {
            this.setState({ isCopied: false });
        }, COPY_LINK_TIMEOUT);
    };

    componentWillUnmount() {
        clearTimeout(this.copyTimeout);
    }

    render() {
        const { isOpen, shareLoveListUrl } = this.props;
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ShareLoveListLinkModal/locales', 'ShareLoveListLinkModal');

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
                width={0}
                isDrawer={true}
                hasBodyScroll
            >
                <Modal.Header>
                    <Modal.Title>{getText('shareYourList')}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    lineHeight='tight'
                    paddingBottom={2}
                >
                    <Text
                        is='p'
                        marginBottom={2}
                    >
                        {getText('copyLinkText')}
                    </Text>
                    <Grid columns='1fr'>
                        <TextInput
                            customStyle={styles.inputCustomStyle}
                            borderColor={colors.midgray}
                            borderRadius={2}
                            marginBottom={null}
                            highlight={true}
                            css={{ 'text-overflow': 'ellipsis' }}
                            value={shareLoveListUrl}
                            readOnly={true}
                        />
                    </Grid>
                </Modal.Body>
                <Modal.Footer
                    marginTop={2}
                    hasBorder={false}
                    paddingX={[3, 3]}
                >
                    <Grid gap={4}>
                        <CopyToClipboard
                            text={shareLoveListUrl}
                            onCopy={this.handleOnCopy}
                        >
                            <Button variant='primary'>
                                {this.state.isCopied ? (
                                    <>
                                        <Icon
                                            name='checkmark'
                                            size='.875em'
                                            marginRight={`${space[2]}px`}
                                        />
                                        {getText('copied')}
                                    </>
                                ) : (
                                    getText('copy')
                                )}
                            </Button>
                        </CopyToClipboard>

                        <Button
                            onClick={this.requestClose}
                            variant='secondary'
                        >
                            {getText('cancel')}
                        </Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    inputCustomStyle: {
        innerWrap: {
            borderColor: colors.midGray,
            backgroundColor: colors.white
        },
        root: {
            pointerEvents: 'none'
        },
        input: {
            color: colors.gray
        }
    }
};

ShareLoveListLinkModal.propTypes = {
    isOpen: propTypes.bool,
    shareLoveListUrl: propTypes.string
};

ShareLoveListLinkModal.defaultProps = {
    isOpen: false,
    shareLoveListUrl: '',
    loveListId: null
};

export default wrapComponent(ShareLoveListLinkModal, 'ShareLoveListLinkModal');
