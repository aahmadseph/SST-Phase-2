import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import propTypes from 'prop-types';
import store from 'store/Store';
import Modal from 'components/Modal/Modal';
import {
    Grid, Button, Box, Text
} from 'components/ui';
import Actions from 'actions/Actions';
import Empty from 'constants/empty';
import Location from 'utils/Location';
import { LOVES_URL } from 'constants/sharableList';
import myListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
import ViewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import anaConsts from 'analytics/constants';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { showDeleteListModal, showManageListModal } = Actions;

class DeleteListModal extends BaseClass {
    constructor(props) {
        super(props);
    }

    requestClose = () => {
        store.dispatch(showDeleteListModal({ isOpen: false }));
    };

    handleDeleteList = e => {
        const { removeSharableList, customListId, getFlatLoveListSkusOverview, loveListName } = this.props;

        //STAG Analytics
        if (loveListName && customListId) {
            ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_DELETED_SUCCESS,
                shoppingListName: loveListName,
                shoppingListId: customListId
            });
        }

        return removeSharableList({
            listId: customListId,
            cbSuccess: async () => {
                myListsBindings.deleteList();
                store.dispatch(showManageListModal({ isOpen: false }));
                store.dispatch(showDeleteListModal({ isOpen: false }));
                getFlatLoveListSkusOverview(false, null, true);
                await Storage.db.removeItem(LOCAL_STORAGE.LIMITED_LOVED_ITEMS);
                await Storage.db.removeItem(LOCAL_STORAGE.ALL_LOVE_LIST_SKU_ONLY);
                Location.navigateTo(e, LOVES_URL);
            },
            cbCleanup: error => {
                Sephora.logger.error('Error deleting list', error);
            }
        });
    };

    render() {
        const { isOpen, localization } = this.props;
        const { deleteList, deleteText, yesDeleteList, noKeepList } = localization;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
                width={0}
                isDrawer={true}
                hasBodyScroll
            >
                <Modal.Header>
                    <Modal.Title>{deleteList}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    lineHeight='tight'
                    paddingBottom={2}
                >
                    <Grid columns='1fr'>
                        <Box>
                            <Text>{deleteText}</Text>
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
                            onClick={this.handleDeleteList}
                            variant='primary'
                        >
                            {yesDeleteList}
                        </Button>
                        <Button
                            onClick={this.requestClose}
                            variant='secondary'
                        >
                            {noKeepList}
                        </Button>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

DeleteListModal.propTypes = {
    isOpen: propTypes.bool,
    removeSharableList: propTypes.func,
    customListId: propTypes.string,
    localization: propTypes.object.isRequired
};

DeleteListModal.defaultProps = {
    isOpen: false,
    removeSharableList: Empty.Function,
    customListId: null,
    localization: Empty.Object
};

export default wrapComponent(DeleteListModal, 'DeleteListModal', true);
