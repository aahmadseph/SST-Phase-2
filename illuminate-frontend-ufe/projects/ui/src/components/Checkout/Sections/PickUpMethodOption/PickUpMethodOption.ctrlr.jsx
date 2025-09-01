import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import InfoButton from 'components/InfoButton/InfoButton';
import {
    Button, Grid, Text, Box, Image, Flex
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import BaseClass from 'components/BaseClass';
import { colors } from 'style/config';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';

const ACTIVE_BORDER_COLOR = colors.black;

class PickUpMethodOption extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }

    componentDidMount() {
        this.props.getCurbsideConciergeInfoModal();
    }

    openModal = () => this.setState({ isOpen: true });

    closeModal = () => this.setState({ isOpen: false });

    render() {
        const {
            label,
            isActive = false,
            isCurbsideConcierge = false,
            onClick,
            content = [],
            curbsideConciergeInfoModal,
            title,
            whatItIs,
            whatToDo,
            footer,
            curbsideConciergeAltText,
            inStorePickupAltText,
            curbsideInstructionTab,
            ...restProps
        } = this.props;

        return (
            <>
                <Grid
                    columns='1fr auto'
                    alignItems='center'
                    borderRadius={2}
                    lineHeight='tight'
                    minHeight={44}
                    paddingX={3}
                    paddingY={1}
                    borderWidth={1}
                    borderColor='midGray'
                    baseCss={{
                        '&:hover': { borderColor: ACTIVE_BORDER_COLOR }
                    }}
                    {...(isActive && {
                        borderColor: ACTIVE_BORDER_COLOR,
                        css: { boxShadow: `0 0 0 1px ${ACTIVE_BORDER_COLOR}` }
                    })}
                    {...restProps}
                >
                    <Flex
                        onClick={onClick}
                        fontWeight='bold'
                        alignItems='center'
                    >
                        <Image
                            css={{ flexShrink: 0 }}
                            marginRight={2}
                            src={`/img/ufe/${isCurbsideConcierge ? 'curbside-concierge-icon' : 'in-store-pickup-icon'}.svg`}
                            alt={isCurbsideConcierge ? curbsideConciergeAltText : inStorePickupAltText}
                        />
                        {label}
                    </Flex>
                    {isCurbsideConcierge && <InfoButton onClick={this.openModal} />}
                </Grid>
                <Modal
                    isOpen={this.state.isOpen}
                    onDismiss={this.closeModal}
                >
                    <Modal.Header>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Box>
                            {curbsideConciergeInfoModal && (
                                <>
                                    <Text
                                        is='h3'
                                        fontWeight='bold'
                                        children={whatItIs}
                                        marginBottom='4'
                                    />
                                    <BccComponentList items={curbsideConciergeInfoModal?.regions?.content} />
                                </>
                            )}
                            {content && (
                                <>
                                    <Text
                                        is='h3'
                                        fontWeight='bold'
                                        children={whatToDo}
                                        marginY='4'
                                    />
                                    <BccComponentList items={curbsideInstructionTab} />
                                </>
                            )}
                        </Box>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant='primary'
                            hasMinWidth={true}
                            children={footer}
                            onClick={this.closeModal}
                        />
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

PickUpMethodOption.defaultProps = {
    isActive: false,
    content: [],
    isCurbsideConcierge: false
};

PickUpMethodOption.propTypes = {
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    isCurbsideConcierge: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    content: PropTypes.array,
    curbsideConciergeInfoModal: PropTypes.object,
    title: PropTypes.string.isRequired,
    whatItIs: PropTypes.string.isRequired,
    whatToDo: PropTypes.string.isRequired,
    footer: PropTypes.string.isRequired,
    getCurbsideConciergeInfoModal: PropTypes.func.isRequired,
    curbsideConciergeAltText: PropTypes.string.isRequired,
    inStorePickupAltText: PropTypes.string.isRequired
};

export default wrapComponent(PickUpMethodOption, 'PickUpMethodOption', true);
