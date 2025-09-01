import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Grid, Text, Button } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import CopyToClipboard from 'react-copy-to-clipboard';
import { textResourcesSelector } from 'selectors/creatorStoreFront/textResourcesSelector';
import helpersUtils from 'utils/Helpers';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const { deferTaskExecution } = helpersUtils;

const CsfShareLinkModal = ({ isOpen, shareUrl, pathName, onDismiss }) => {
    const [isCopied, setIsCopied] = useState(false);
    const textResources = useSelector(textResourcesSelector);

    useEffect(() => {
        if (isOpen && pathName?.length) {
            deferTaskExecution(() => {
                processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                    data: {
                        pageName: `${anaConsts.PAGE_TYPES.CREATOR_STORE_FRONT}:${anaConsts.EVENT_NAMES.SHARE}:${pathName}:*`
                    }
                });
            });
        }
    }, [isOpen, pathName]);

    const getModalTitle = () => {
        if (typeof window === 'undefined') {
            return textResources.shareProfile;
        }

        const pathname = window.location.pathname;

        const pathTitleMap = {
            '/posts/': textResources.sharePost,
            '/collections/': textResources.shareCollection
        };

        const matchedPath = Object.keys(pathTitleMap).find(path => pathname.includes(path));

        return matchedPath ? pathTitleMap[matchedPath] : textResources.shareProfile;
    };

    const handleOnCopy = () => {
        setIsCopied(true);

        deferTaskExecution(() => {
            fireAnalytics(shareUrl);
        });
    };

    const fireAnalytics = url => {
        const cleanedUrl = (url || '').split('?')[0];
        const pathSegments = cleanedUrl.split('/').filter(Boolean);
        const creatorHandle = pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2];

        // Dispatch the Share Event for Creator Storefront
        processEvent.process(anaConsts.SHARE_EVENT, {
            data: {
                method: 'Share',
                contentType: 'Creator Storefront',
                itemId: creatorHandle
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            isDrawer={true}
            width={560}
        >
            <Modal.Header>
                <Modal.Title>{getModalTitle()}</Modal.Title>
            </Modal.Header>
            <Modal.Body
                paddingX={4}
                paddingTop={5}
                paddingBottom={5}
            >
                <Text
                    is='p'
                    marginBottom={2}
                >
                    {textResources.copyLinkText}
                </Text>
                <Grid columns='1fr auto'>
                    <TextInput
                        marginBottom={null}
                        highlight={true}
                        value={shareUrl}
                        readOnly={true}
                        label='URL'
                        width={420}
                    />
                    <CopyToClipboard
                        text={shareUrl}
                        onCopy={handleOnCopy}
                    >
                        <Button variant='primary'>{isCopied ? textResources.copied : textResources.copy}</Button>
                    </CopyToClipboard>
                </Grid>
            </Modal.Body>
        </Modal>
    );
};

export default wrapFunctionalComponent(CsfShareLinkModal, 'CsfShareLinkModal');
