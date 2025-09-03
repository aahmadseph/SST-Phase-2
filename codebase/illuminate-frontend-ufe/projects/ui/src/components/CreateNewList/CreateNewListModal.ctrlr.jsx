/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import FormValidator from 'utils/FormValidator';
import Modal from 'components/Modal/Modal';
import {
    Button, Flex, Box, Text, Link
} from 'components/ui';
import Empty from 'constants/empty';
import Textarea from 'components/Inputs/Textarea/Textarea';
import ViewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import anaConsts from 'analytics/constants.js';
import MyListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';

const LISTS_URL = '/profile/Lists';
class CreateNewListModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isCreateNewListModal: false,
            listNameTextMessage: '',
            listNameTextError: false
        };
    }

    componentDidMount() {
        if (this.props.isListLimitReached) {
            MyListsBindings.limitReached();
        } else {
            MyListsBindings.createNewListModalPageLoad();
        }
    }

    setNewListNameTextRef(comp) {
        if (comp !== null) {
            this.listNameText = comp;
        }
    }

    handleListNameTextChange = listNameText => {
        this.setState({
            listNameTextMessage: '',
            listNameTextError: false
        });
        const listNameTextTrimmed = listNameText.trim();

        this.setState({
            listNameText: listNameTextTrimmed
        });
    };

    handleOnDismiss = () => {
        const { onDismiss, showCreateListModal, showMyListsModal, handleNewListCreated } = this.props;

        handleNewListCreated();

        if (!showCreateListModal) {
            onDismiss();
        } else {
            showMyListsModal(false);
        }
    };

    validateListNameText = () => {
        const { listNameText } = this.state;

        if (FormValidator.isEmpty(listNameText)) {
            this.setState({ listNameTextError: true });

            return 'enterQuestion';
        } else if (listNameText.length < 1) {
            this.setState({ listNameTextError: true });

            return 'errorMessageText';
        } else {
            this.setState({ listNameTextError: false });
        }

        return null;
    };

    handleCreateNewList = () => {
        const { newSkuToAdd } = this.props;
        this.props
            .createNewList(this.state.listNameText, newSkuToAdd)
            .then(response => {
                if (response && typeof response === 'object') {
                    //STAG Analytics
                    ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                        eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_CREATED,
                        ...(response || {})
                    });
                }

                MyListsBindings.createListSuccess();

                this.handleOnDismiss();
            })
            .catch(e => {
                const errorMessage = (Array.isArray(e?.errorMessages) && e.errorMessages[0]) || Empty.String;
                MyListsBindings.createListError(errorMessage);
                this.setState({
                    listNameTextMessage: errorMessage,
                    listNameTextError: true
                });
            });
    };

    render() {
        const { localization, isListLimitReached } = this.props;
        const {
            createNewList, createList, enterListName, listLimitReachedTitle, listLimitReachedMessage, gotIt, myLists
        } = localization;
        const { listNameTextMessage, listNameTextError } = this.state;

        return (
            <Modal
                width={0}
                onDismiss={this.handleOnDismiss}
                isOpen={true}
                isDrawer={true}
                hasBodyScroll
            >
                <Modal.Header>
                    <Modal.Title children={isListLimitReached ? listLimitReachedTitle : createNewList} />
                </Modal.Header>
                <Modal.Body
                    lineHeight='tight'
                    paddingBottom={2}
                >
                    <Box marginBottom={0}>
                        {isListLimitReached ? (
                            <Text>
                                {listLimitReachedMessage}
                                <Link
                                    display='inline'
                                    padding={2}
                                    margin={-2}
                                    color='blue'
                                    underline={true}
                                    href={LISTS_URL}
                                    children={myLists}
                                />
                                .
                            </Text>
                        ) : (
                            <Textarea
                                marginBottom={0}
                                labelDataAt={'new_list_name_text'}
                                label={enterListName}
                                rows={1}
                                name='newListName'
                                maxLength={60}
                                charCountDataAt={'char_counter_text'}
                                handleChange={this.handleListNameTextChange}
                                invalid={listNameTextError}
                                errorDataAt={'error_msg_text'}
                                warning={listNameTextMessage}
                                validate={this.validateListNameText}
                                ref={comp => {
                                    this.setNewListNameTextRef(comp);
                                }}
                            />
                        )}
                    </Box>
                </Modal.Body>
                <Modal.Footer
                    marginTop={2}
                    hasBorder={false}
                    paddingX={[3, 3]}
                >
                    <Flex css={styles.ctaContainer}>
                        {isListLimitReached ? (
                            <Button
                                variant={'primary'}
                                css={styles.primaryBtn}
                                onClick={this.handleOnDismiss}
                                children={gotIt}
                            />
                        ) : (
                            <Button
                                variant={'primary'}
                                css={styles.primaryBtn}
                                disabled={!this.state.listNameText}
                                onClick={this.handleCreateNewList}
                                children={createList}
                            />
                        )}
                    </Flex>
                </Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    ctaContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 2
    },
    primaryBtn: {
        width: '100%'
    }
};

CreateNewListModal.propTypes = {
    localization: PropTypes.object.isRequired,
    showCreateListModal: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    showMyListsModal: PropTypes.func.isRequired
};

CreateNewListModal.defaultProps = {
    localization: {},
    showCreateListModal: false,
    onDismiss: Empty.Function,
    showMyListsModal: Empty.Function
};

export default wrapComponent(CreateNewListModal, 'CreateNewListModal', true);
