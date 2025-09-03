/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import propTypes from 'prop-types';
import store from 'store/Store';
import Modal from 'components/Modal/Modal';
import {
    Grid, Button, Box, Link
} from 'components/ui';
import { colors, space } from 'style/config';
import Actions from 'actions/Actions';
import Textarea from 'components/Inputs/Textarea/Textarea';
import Empty from 'constants/empty';
import myListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
import ViewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import anaConsts from 'analytics/constants';
const { USER_PROFILE } = anaConsts.PAGE_TYPES;
const { LOVES } = anaConsts.EVENT_NAMES;

const { showManageListModal, showDeleteListModal } = Actions;

class ManageListModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            listNameTextMessage: '',
            listNameTextError: false,
            listNameText: props.listName || ''
        };
    }

    componentDidMount() {
        myListsBindings.pageLoad({ pageType: USER_PROFILE, eventName: LOVES.MANAGE_LIST });
    }

    requestClose = () => {
        store.dispatch(showManageListModal({ isOpen: false }));
    };

    handleRenameList = () => {
        const { renameSharableList, loveListId, setLoveListName } = this.props;
        const { listNameText } = this.state;
        const payload = {
            shoppingListId: loveListId,
            shoppingListName: listNameText
        };

        if (payload && typeof payload === 'object') {
            //STAG Analytics
            ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_UPDATE_SUCCESS,
                ...(payload || {})
            });
        }

        return renameSharableList(
            payload,
            () => {
                this.requestClose();
                setLoveListName(listNameText);
            },
            error => {
                this.setState({
                    listNameTextMessage: Array.isArray(error?.errorMessages) && error.errorMessages[0],
                    listNameTextError: true
                });
            }
        );
    };

    setNewListNameTextRef(comp) {
        if (comp !== null) {
            this.listNameText = comp;
        }
    }

    handleListNameOnChange = listNameText => {
        this.setState({
            listNameTextMessage: '',
            listNameTextError: false
        });
        const listNameTextTrimmed = listNameText.trim();

        this.setState({
            listNameText: listNameTextTrimmed
        });
    };

    launchDeleteListModal = () => {
        const { loveListId, listName } = this.props;
        store.dispatch(showDeleteListModal({ isOpen: true, customListId: loveListId }));

        if (listName && loveListId) {
            // STAG Analytics
            ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_DELETED_CLICK,
                shoppingListName: listName,
                shoppingListId: loveListId
            });
        }
    };

    isSaveDisabled() {
        const { listName } = this.props;
        const { listNameText } = this.state;
        const trimmedText = (listNameText || '').trim();
        const original = (listName || '').trim();

        return !trimmedText || trimmedText === original;
    }

    render() {
        const { isOpen, localization } = this.props;
        const {
            manageList, deleteList, listName, save, cancel
        } = localization;
        const { listNameTextMessage, listNameTextError } = this.state;
        const isSaveDisabled = this.isSaveDisabled();

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
                width={0}
                isDrawer={true}
                hasBodyScroll
            >
                <Modal.Header>
                    <Modal.Title>{manageList}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    lineHeight='tight'
                    paddingBottom={2}
                >
                    <Grid columns='1fr'>
                        <Textarea
                            marginBottom={0}
                            labelDataAt={'new_list_name_text'}
                            label={listName}
                            rows={1}
                            name='newListName'
                            maxLength={60}
                            charCountDataAt={'char_counter_text'}
                            handleChange={this.handleListNameOnChange}
                            invalid={listNameTextError}
                            errorDataAt={'error_msg_text'}
                            warning={listNameTextMessage}
                            ref={comp => {
                                this.setNewListNameTextRef(comp);
                            }}
                            value={this.state.listNameText}
                            data-at={'question_field'}
                        />

                        <Box>
                            <Link
                                css={styles.deleteLink}
                                onClick={this.launchDeleteListModal}
                                children={deleteList}
                            />
                        </Box>
                    </Grid>
                </Modal.Body>
                <Modal.Footer
                    marginTop={2}
                    hasBorder={false}
                    paddingX={[3, 3]}
                >
                    <Grid gap={4}>
                        <Button
                            onClick={this.handleRenameList}
                            variant='primary'
                            disabled={isSaveDisabled}
                        >
                            {save}
                        </Button>
                        <Button
                            onClick={this.requestClose}
                            variant='secondary'
                        >
                            {cancel}
                        </Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    deleteLink: {
        color: colors['blue'],
        padding: space[0],
        marginBottom: space[1]
    }
};

ManageListModal.propTypes = {
    isOpen: propTypes.bool,
    renameSharableList: propTypes.func,
    fetchData: propTypes.func,
    loveListId: propTypes.string,
    listName: propTypes.string,
    localization: propTypes.object.isRequired
};

ManageListModal.defaultProps = {
    isOpen: false,
    renameSharableList: Empty.Function,
    fetchData: Empty.Function,
    loveListId: null,
    listName: null,
    localization: Empty.Object
};

export default wrapComponent(ManageListModal, 'ManageListModal');
