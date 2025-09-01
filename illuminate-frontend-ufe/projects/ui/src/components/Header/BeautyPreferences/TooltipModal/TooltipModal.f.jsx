import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import {
    Text, Box, Flex, Button
} from 'components/ui';

function TooltipModal(props) {
    return (
        <Modal
            isOpen={props.isOpen}
            onDismiss={props.close}
            isDrawer={true}
            width={0}
        >
            <Modal.Header>
                <Modal.Title>{props.tooltipColorIQTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body
                paddingX={4}
                paddingBottom={2}
            >
                <Box>
                    <Text
                        is='p'
                        children={props.tooltipColorIQSubtitle1}
                    />
                    <br />
                    <Text
                        is='p'
                        children={props.tooltipColorIQSubtitle2}
                    />
                </Box>
            </Modal.Body>
            <Modal.Footer
                paddingX={4}
                paddingY={4}
                hasBorder={false}
            >
                <Flex
                    justifyContent='flex-end'
                    width='100%'
                >
                    <Button
                        width={props.buttonWidth || [164, 126]}
                        variant='primary'
                        onClick={props.close}
                        children={props.buttonGotIt}
                    />
                </Flex>
            </Modal.Footer>
        </Modal>
    );
}

TooltipModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    tooltipColorIQTitle: PropTypes.string.isRequired,
    tooltipColorIQSubtitle1: PropTypes.string.isRequired,
    tooltipColorIQSubtitle2: PropTypes.string.isRequired,
    buttonGotIt: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(TooltipModal, 'TooltipModal');
