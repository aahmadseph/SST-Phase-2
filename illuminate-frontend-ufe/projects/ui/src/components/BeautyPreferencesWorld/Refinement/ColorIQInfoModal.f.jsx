import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import {
    Box, Text, Button, Icon
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

function ColorIQInfoModal({ isOpen, onClose }) {
    const getText = localeUtils.getLocaleResourceFile('components/BeautyPreferencesWorld/Refinement/locales', 'Refinement');

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <Box
                padding={4}
                maxWidth='500px'
            >
                <Box
                    display='flex'
                    justifyContent='flex-end'
                    marginBottom={3}
                >
                    <Icon
                        name='close'
                        size={24}
                        onClick={onClose}
                        css={{ cursor: 'pointer' }}
                        aria-label='Close modal'
                    />
                </Box>
                <Text
                    as='h2'
                    fontSize='xl'
                    fontWeight='bold'
                    marginBottom={3}
                >
                    {getText('colorIQModalTitle')}
                </Text>
                <Text
                    marginBottom={4}
                    color='gray'
                >
                    {getText('colorIQModalDescription')}
                </Text>
                <Button
                    variant='primary'
                    onClick={onClose}
                    width='100%'
                >
                    {getText('gotIt')}
                </Button>
            </Box>
        </Modal>
    );
}

export default wrapFunctionalComponent(ColorIQInfoModal, 'ColorIQInfoModal');
