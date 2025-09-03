import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Text, Box } from 'components/ui';
import languageLocaleUtils from 'utils/LanguageLocale';
import ShareButton from 'components/CreatorStoreFront/ShareButton/ShareButton';
import UIUtils from 'utils/UI';
import { mediaQueries, space } from 'style/config';
import anaConsts from 'analytics/constants';

const { SKELETON_ANIMATION } = UIUtils;
const { getCurrentLanguageLocale } = languageLocaleUtils;

const SkeletonPiece = ({ width, height, borderRadius = 2 }) => (
    <Box
        css={{
            ...SKELETON_ANIMATION,
            width,
            height,
            backgroundColor: 'lightGray',
            borderRadius
        }}
    />
);

const PostHeaderSkeleton = () => (
    <Flex
        display='flex'
        flexDirection='column'
        width={[343, null, '100%']}
        alignSelf={['center', null, 'flex-start']}
        marginBottom={[3, null, 0]}
        paddingBottom={[2, null, 0]}
    >
        {/* Title/Date skeleton row */}
        <Flex
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            width='100%'
            marginBottom={[1, null, 2]}
        >
            {/* Title and Date skeleton */}
            <Flex
                flexDirection='row'
                alignItems='center'
                gap={2}
                flex='1'
            >
                <SkeletonPiece
                    width='120px'
                    height='20px'
                />
                <SkeletonPiece
                    width='80px'
                    height='14px'
                />
            </Flex>

            {/* Share Icon skeleton - Mobile only */}
            <Box display={['block', null, 'none']}>
                <SkeletonPiece
                    width='16px'
                    height='16px'
                    borderRadius='50%'
                />
            </Box>
        </Flex>

        {/* Caption skeleton */}
        <Flex
            flexDirection='row'
            justifyContent='space-between'
            alignItems='flex-start'
            width='100%'
        >
            <Flex
                flex='1'
                flexDirection='column'
                gap={1}
            >
                <SkeletonPiece
                    width='100%'
                    height='16px'
                />
                <SkeletonPiece
                    width='80%'
                    height='16px'
                />
            </Flex>

            {/* Share Icon skeleton - Desktop only */}
            <Box display={['none', null, 'block']}>
                <SkeletonPiece
                    width='24px'
                    height='24px'
                    borderRadius='50%'
                />
            </Box>
        </Flex>
    </Flex>
);

const PostHeaderFrame = ({ postContent, textResources, isSkeleton }) => {
    if (isSkeleton) {
        return <PostHeaderSkeleton />;
    }

    const { title = '', caption = '', creationDate = '' } = postContent || {};

    const nameMatch = caption?.match(/^([^:]+):\s*/);
    const name = nameMatch?.[1] || '';
    const message = caption?.replace(/^(\w+):\s*/, '') || caption;
    const locale = getCurrentLanguageLocale() || 'en-US';

    const formattedDate = new Date(creationDate).toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <Flex
            display='flex'
            flexDirection='column'
            width={'100%'}
            alignSelf={['center', 'flex-start', 'flex-start']}
            gap={2}
        >
            {/* Title/Date and Share icon row */}
            <Flex
                flexDirection='row'
                justifyContent='space-between'
                alignItems='flex-start'
                width={['98%', null, '100%']}
                gap={4}
            >
                {/* Title and Date section */}
                {title.length > 40 ? (
                    <Text
                        fontSize='md'
                        fontWeight='bold'
                        color='black'
                        lineHeight='20px'
                        flex='1'
                        minWidth={0}
                        css={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                        }}
                    >
                        {title}
                        <Text
                            is='span'
                            fontWeight='normal'
                            color='gray'
                            children={' | '}
                        />
                        <Text
                            is='span'
                            fontSize='sm'
                            fontWeight='normal'
                            color='gray'
                            children={formattedDate}
                        />
                    </Text>
                ) : (
                    <Flex
                        flexDirection='row'
                        alignItems='center'
                        gap={1}
                        flex='1'
                        minWidth={0}
                    >
                        <Text
                            fontSize='md'
                            fontWeight='bold'
                            color='black'
                            lineHeight='20px'
                            children={title}
                            css={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                minWidth: 0,
                                maxWidth: 'fit-content',
                                flex: 1
                            }}
                        />
                        <Text
                            fontSize='md'
                            fontWeight='normal'
                            color='gray'
                            lineHeight='20px'
                            children={'|'}
                            css={{ flexShrink: 0 }}
                        />
                        <Text
                            fontSize='sm'
                            fontWeight='normal'
                            color='gray'
                            lineHeight='14px'
                            children={formattedDate}
                            css={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                        />
                    </Flex>
                )}
                <div css={styles.shareButton}>
                    <ShareButton
                        pathName={anaConsts.PAGE_TYPES.POST_DETAIL}
                        display={['none', null, 'flex']}
                        textResources={textResources}
                        paddingLeft={[0, null, 4]}
                    />
                </div>
            </Flex>

            {/* Caption section */}
            {caption && (
                <Text
                    is='p'
                    flex={1}
                >
                    {name && (
                        <Text
                            fontWeight='bold'
                            children={`${name}: `}
                        />
                    )}
                    {message}
                </Text>
            )}
        </Flex>
    );
};

const styles = {
    shareButton: {
        flexShrink: 0,
        paddingLeft: 0,
        [mediaQueries.lg]: {
            paddingLeft: space[4]
        }
    }
};

PostHeaderFrame.propTypes = {
    postContent: PropTypes.object,
    textResources: PropTypes.object,
    isSkeleton: PropTypes.bool
};

PostHeaderFrame.defaultProps = {
    isSkeleton: false
};

export default wrapFunctionalComponent(PostHeaderFrame, 'PostHeaderFrame');
