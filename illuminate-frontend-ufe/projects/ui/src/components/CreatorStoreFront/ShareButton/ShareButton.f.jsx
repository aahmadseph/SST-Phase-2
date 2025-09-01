import React, { useState } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Button, Image, Text } from 'components/ui';
import Flex from 'components/Flex';
import CsfShareLinkModal from './CsfShareLinkModal.f';
import LanguageLocale from 'utils/LanguageLocale';

const { isFrench } = LanguageLocale;
const getShareUrl = () => {
    if (typeof window === 'undefined') {
        return '';
    }

    return `${window.location.origin}${window.location.pathname}`;
};

const ShareButton = ({ iconSize = 24, textResources, pathName, ...rest }) => {
    const shareText = textResources?.share;
    const [modalOpen, setModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    const handleShare = () => {
        const url = getShareUrl();
        setShareUrl(url);
        setModalOpen(true);
    };

    return (
        <>
            <Button
                as='button'
                type='button'
                onClick={handleShare}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                {...rest}
            >
                <Flex
                    display='flex'
                    width={isFrench() ? '85px' : '67px'}
                    height='24px'
                    justifyContent='center'
                    alignItems='flex-end'
                    gap='4px'
                >
                    <Image
                        size={iconSize}
                        flexShrink={0}
                        src='/img/ufe/csf/share-up-icon.svg'
                        alt='Share Icon'
                    />
                    <Text
                        fontSize='base'
                        fontWeight='400'
                        color='black'
                        whiteSpace='nowrap'
                    >
                        {shareText}
                    </Text>
                </Flex>
            </Button>
            <CsfShareLinkModal
                isOpen={modalOpen}
                shareUrl={shareUrl}
                pathName={pathName}
                onDismiss={() => setModalOpen(false)}
            />
        </>
    );
};

export default wrapFunctionalComponent(ShareButton, 'ShareButton');
