import {
    Box, Button, Divider, Flex, Grid, Link, Text
} from 'components/ui';
import { colors, lineHeights } from 'style/config';
import BaseClass from 'components/BaseClass';
import React from 'react';
import PropTypes from 'prop-types';
import StringUtils from 'utils/String';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { wrapComponent } from 'utils/framework';

class DeliveryInstructions extends BaseClass {
    constructor(props) {
        super(props);

        const { deliveryInstructions } = this.props;
        this.state = {
            deliveryInstructions,
            editMode: false,
            originalDeliveryInstructions: deliveryInstructions,
            error: null
        };
    }

    static getDerivedStateFromProps = ({ deliveryInstructions }, state) => {
        if (state.originalDeliveryInstructions !== deliveryInstructions) {
            const newState = {
                ...state,
                originalDeliveryInstructions: deliveryInstructions
            };

            return newState;
        }

        return null;
    };

    render() {
        const {
            addDeliveryInstructionsLinkText,
            cancelLinkText,
            deliveryInstructionsHint,
            deliveryInstructionsLabel,
            editLinkText,
            maxCharactersInfo,
            orderDeliveryNote,
            saveAndContinueText
        } = this.props;
        const { deliveryInstructions, editMode, error } = this.state;

        return (
            <>
                <Divider marginY={4} />
                {editMode ? (
                    <>
                        <TextInput
                            marginBottom={2}
                            customStyle={!error ? styles.textInput : styles.error}
                            isControlled
                            label={deliveryInstructionsHint}
                            maxLength={250}
                            message={StringUtils.format(maxCharactersInfo, deliveryInstructions.length)}
                            onChange={this.onDeliveryInstructionsChanged}
                            value={deliveryInstructions}
                            data-at={Sephora.debug.dataAt('deliveryInstructionsInput')}
                            invalid={error}
                            error={error}
                            hasError={error}
                        />
                        <Flex alignItems='center'>
                            <Button
                                variant='primary'
                                hasMinWidth={true}
                                onClick={this.onSaveAndContinue}
                                data-at={Sephora.debug.dataAt('saveAndContinue')}
                            >
                                {saveAndContinueText}
                            </Button>
                            <Link
                                onClick={this.onCancelClick}
                                color='blue'
                                marginLeft={4}
                                children={cancelLinkText}
                                data-at={Sephora.debug.dataAt('cancel')}
                            />
                        </Flex>
                    </>
                ) : deliveryInstructions ? (
                    <>
                        <Grid
                            columns='1fr auto'
                            marginBottom={1}
                        >
                            <Text
                                is='h3'
                                fontWeight='bold'
                                children={deliveryInstructionsLabel}
                            />
                            <Link
                                onClick={this.switchToEditMode}
                                color='blue'
                                padding={2}
                                margin={-2}
                                children={editLinkText}
                            />
                        </Grid>
                        <Text
                            is='p'
                            wordBreak='break-word'
                            children={deliveryInstructions}
                            data-at={Sephora.debug.dataAt('deliveryInstructionsMessage')}
                        />
                    </>
                ) : (
                    <Box
                        marginTop={4}
                        lineHeight='tight'
                    >
                        <Link
                            onClick={this.switchToEditMode}
                            color='blue'
                            children={addDeliveryInstructionsLinkText}
                        />
                    </Box>
                )}
                <Box
                    is='p'
                    backgroundColor='nearWhite'
                    borderRadius={2}
                    marginY={3}
                    paddingY={2}
                    paddingX={3}
                    children={orderDeliveryNote}
                    data-at={Sephora.debug.dataAt('orderDeliveryNote')}
                />
            </>
        );
    }

    onDeliveryInstructionsChanged = ({ target: { value = '' } = {} }) => {
        if (!StringUtils.hasSpecialCharacters(value)) {
            this.setState({ deliveryInstructions: value, error: null });
        }
    };

    switchToEditMode = () => this.setState({ editMode: true, error: null });

    onSaveAndContinue = () => {
        const { saveDeliveryInstructions } = this.props;
        const { deliveryInstructions } = this.state;
        saveDeliveryInstructions(deliveryInstructions.trim())
            .then(() => this.setState({ editMode: false, error: null }))
            .catch(e =>
                this.setState({
                    error: e.errorMessages && e.errorMessages[0]
                })
            );
    };

    onCancelClick = () => {
        const { deliveryInstructions } = this.props;
        this.setState({
            deliveryInstructions,
            editMode: false,
            error: null
        });
    };
}

const styles = {
    textInput: {
        message: {
            color: colors.gray,
            lineHeight: lineHeights.tight,
            textAlign: 'right'
        }
    },
    error: {
        message: {
            color: colors.red,
            textAlign: 'left'
        }
    }
};

DeliveryInstructions.propTypes = {
    addDeliveryInstructionsLinkText: PropTypes.string.isRequired,
    cancelLinkText: PropTypes.string.isRequired,
    deliveryInstructions: PropTypes.string.isRequired,
    deliveryInstructionsHint: PropTypes.string.isRequired,
    deliveryInstructionsLabel: PropTypes.string.isRequired,
    editLinkText: PropTypes.string.isRequired,
    maxCharactersInfo: PropTypes.string.isRequired,
    orderDeliveryNote: PropTypes.string.isRequired,
    saveAndContinueText: PropTypes.string.isRequired,
    saveDeliveryInstructions: PropTypes.func.isRequired
};

export default wrapComponent(DeliveryInstructions, 'DeliveryInstructions');
