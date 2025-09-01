import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import Modal from 'components/Modal/Modal';
import { Box, Text } from 'components/ui';
import {
    space, fontSizes, fontWeights, lineHeights
} from 'style/config';

class SDUScriptModal extends BaseClass {
    closeSDUScriptModal = () => {
        const { onClose } = this.props;
        onClose();
    };

    render() {
        const { sduScriptTitle, sduScriptHeader, sduScript, isOpen } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.closeSDUScriptModal}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{sduScriptTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body padding={space[5]}>
                    <Text
                        is='p'
                        fontSize={fontSizes.base}
                        fontWeight={fontWeights.medium}
                        paddingBottom={space[5]}
                    >
                        {sduScriptHeader}
                    </Text>
                    <Box>
                        <Text
                            is='p'
                            fontSize={fontSizes.base}
                            css={styles.scriptText}
                        >
                            {sduScript}
                        </Text>
                    </Box>
                </Modal.Body>
            </Modal>
        );
    }
}

const styles = {
    scriptText: {
        lineHeight: lineHeights.base,
        whiteSpace: 'pre-line'
    }
};

export default wrapComponent(SDUScriptModal, 'SDUScriptModal', true);
