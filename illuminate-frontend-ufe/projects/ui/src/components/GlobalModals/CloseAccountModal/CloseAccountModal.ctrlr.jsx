/* eslint-disable class-methods-use-this */
import BaseClass from 'components/BaseClass';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import {
    Box, Button, Grid, Text
} from 'components/ui';
import PropTypes from 'prop-types';
import React from 'react';
import { wrapComponent } from 'utils/framework';

class CloseAccountModal extends BaseClass {
    state = {
        isChecked: false
    };

    handleCheckboxClick = () => {
        this.setState({ isChecked: !this.state.isChecked });
    };

    render() {
        const {
            localization, isOpen, onCancel, onClose, onSubmit
        } = this.props;
        const { isChecked } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onClose}
                width={0}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title>{localization.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body maxHeight={340}>
                    <Text
                        is='p'
                        fontWeight='bold'
                        marginBottom={4}
                    >
                        {localization.title}
                    </Text>
                    <Text
                        is='p'
                        marginTop={4}
                        marginBottom={4}
                    >
                        {localization.listTitleText}
                    </Text>
                    <Text is='p'>{localization.item1}</Text>
                    <Text is='p'>{localization.item2}</Text>
                    <Text is='p'>{localization.item3}</Text>
                    <Text is='p'>{localization.item4}</Text>
                    <Text is='p'>{localization.item5}</Text>
                    <Text is='p'>{localization.item6}</Text>
                    <Text is='p'>{localization.item7}</Text>
                    <Text is='p'>{localization.item8}</Text>
                    <Text
                        is='p'
                        marginTop={4}
                    >
                        {localization.postListText}
                    </Text>
                </Modal.Body>
                <Modal.Footer
                    hasBorder={true}
                    marginTop={4}
                >
                    <Box marginBottom='.5em'>
                        <Checkbox
                            checked={isChecked}
                            onClick={this.handleCheckboxClick}
                        >
                            {localization.checkboxText}
                        </Checkbox>
                    </Box>
                    <Grid columns={2}>
                        <Button
                            block={true}
                            onClick={onCancel}
                            variant='secondary'
                            children={localization.cancelButton}
                        />
                        <Button
                            block={true}
                            variant='primary'
                            onClick={onSubmit}
                            children={localization.title}
                            disabled={!isChecked}
                        />
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}
CloseAccountModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    localization: PropTypes.object.isRequired,
    cancelCloseAccountModal: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

CloseAccountModal.defaultProps = {
    isOpen: false,
    onCancel: () => {},
    onClose: () => {},
    onSubmit: () => {}
};

export default wrapComponent(CloseAccountModal, 'CloseAccountModal', true);
