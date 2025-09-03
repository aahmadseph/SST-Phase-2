/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Box, Divider, Button, Grid, Flex, Link
} from 'components/ui';
import Textarea from 'components/Inputs/Textarea/Textarea';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';

class SDDInstructions extends BaseClass {
    state = {
        showButtons: false,
        instructions: this.props.deliveryInstructions,
        showEditState: !this.props.deliveryInstructions?.length
    };

    textAreaRef = React.createRef();

    handleFocusChange = isFocussed => {
        const textAreaValue = this.textAreaRef?.current?.getCharacterCount();

        if (!isFocussed && textAreaValue > 0) {
            return;
        }

        if (!isFocussed) {
            setTimeout(() => {
                this.setState({
                    showButtons: false
                });
            }, 500);
        } else {
            this.setState({
                showButtons: true
            });
        }
    };

    onInstructionsChange = event => {
        this.setState({
            instructions: event.target.value
        });
    };

    onSave = () => {
        this.props.saveDeliveryInstructions(this.state.instructions).then(() => {
            refreshCheckout()();
            this.setState({
                showEditState: !this.state.instructions?.length,
                showButtons: false
            });
        });
    };

    handleCancel = () => {
        !this.props.deliveryInstructions && this.textAreaRef?.current?.clearTextArea();
        this.setState({
            showButtons: false,
            instructions: this.props.deliveryInstructions,
            showEditState: false
        });
    };

    renderButtons = () => {
        const { cancel, saveInstructions } = this.props.locales;

        return (
            <Grid
                marginTop={3}
                gap={[2, 4]}
                columns={2}
                maxWidth={['100%', '380px']}
            >
                <Button
                    variant='secondary'
                    children={cancel}
                    onClick={this.handleCancel}
                    block={true}
                />
                <Button
                    variant='primary'
                    block={true}
                    onClick={this.onSave}
                    children={saveInstructions}
                />
            </Grid>
        );
    };

    handleEditClick = () => {
        this.setState({
            showButtons: true,
            showEditState: true
        });
    };

    render() {
        const {
            locales: {
                title, textInputLabel, deliveryNote, optional, edit
            }
        } = this.props;

        return (
            <>
                <Divider
                    thick={true}
                    marginY={4}
                />
                <Box paddingX={[4, 5]}>
                    <Flex
                        justifyContent='space-between'
                        alignItems='baseline'
                        marginBottom={[2, 3]}
                    >
                        <Text
                            is='h3'
                            fontWeight='bold'
                            fontSize={['base', 'md']}
                            children={`${title}${this.props.deliveryInstructions.length > 0 && !this.state.showEditState ? '' : ' ' + optional}`}
                        />
                        {this.props.deliveryInstructions.length > 0 && !this.state.showEditState && (
                            <Link
                                color='blue'
                                children={edit}
                                onClick={this.handleEditClick}
                            />
                        )}
                    </Flex>
                    {(!this.props.deliveryInstructions || this.state.showEditState) && (
                        <Textarea
                            placeholder={textInputLabel}
                            data-at={Sephora.debug.dataAt('deliveryInstructionsInput')}
                            isSMPadding={true}
                            maxLength={250}
                            hideCharacterCount
                            rows={2}
                            onFocus={isFocussed => this.handleFocusChange(isFocussed)}
                            onBlur={isFocussed => this.handleFocusChange(isFocussed)}
                            onChange={this.onInstructionsChange}
                            value={this.state.instructions}
                            ref={this.textAreaRef}
                            marginBottom={3}
                        />
                    )}
                    {this.props.deliveryInstructions.length > 0 && !this.state.showEditState && (
                        <Text
                            is='p'
                            fontSize={'md'}
                            children={this.props.deliveryInstructions}
                            marginBottom={3}
                        />
                    )}
                    {this.state.showButtons && this.renderButtons()}
                    <Box
                        is='p'
                        backgroundColor='nearWhite'
                        borderRadius={2}
                        paddingY={2}
                        paddingX={3}
                        children={deliveryNote}
                        data-at={Sephora.debug.dataAt('orderDeliveryNote')}
                        {...(this.state.showButtons && { marginTop: 3 })}
                    />
                </Box>
            </>
        );
    }
}

export default wrapComponent(SDDInstructions, 'SDDInstructions', true);
