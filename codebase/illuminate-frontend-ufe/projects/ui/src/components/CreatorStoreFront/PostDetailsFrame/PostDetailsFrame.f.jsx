import React, {
    useEffect, useState, memo, useRef
} from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Box, Image } from 'components/ui';
import { colors } from 'style/config';
import UIUtils from 'utils/UI';
import { initializeInstagramEmbeds } from 'components/CreatorStoreFront/helpers/socialMediaEmbed';

const { SKELETON_ANIMATION } = UIUtils;

const SCRIPT_MAP = {
    instagram: {
        url: 'https://www.instagram.com/embed.js',
        process: () => {
            // Use the shared utility for Instagram initialization
            initializeInstagramEmbeds();

            // Component-specific additional processing if needed
            const tryProcess = (attempts = 0) => {
                if (window.instgrm?.Embeds?.process) {
                    Sephora.logger.verbose('Instagram embed processed in PostDetailsFrame!');

                    return true;
                } else if (attempts < 7) {
                    setTimeout(() => tryProcess(attempts + 1), 300);

                    return false;
                }

                return false;
            };

            return tryProcess();
        }
    },
    tiktok: {
        url: 'https://www.tiktok.com/embed.js',
        process: () => {
            // First remove any previous instances of the script to force a reload
            const existingScripts = document.querySelectorAll('script[src*="tiktok.com/embed.js"]');
            existingScripts.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });

            // Create a new script element with the correct attributes
            const script = document.createElement('script');
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;

            // Add it at the end of the body to ensure it loads after the embed HTML
            document.body.appendChild(script);

            // Also try the widget loading method, but this may not be needed with the fresh script
            setTimeout(() => {
                if (window.tiktok && typeof window.tiktok.widgets === 'object') {
                    window.tiktok.widgets.load();
                }
            }, 500);
        }
    },
    youtube: {
        url: null,
        process: () => {}
    }
};

const useSocialMediaScript = (embedHtml, platform, onEmbedProcessed) => {
    // Track if scripts are loaded
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        if (!embedHtml) {
            return;
        }

        const { url, process } = SCRIPT_MAP[platform] || {};

        const handleProcess = () => {
            process?.();

            if (typeof onEmbedProcessed === 'function') {
                onEmbedProcessed();
            }
        };

        if (url) {
            const alreadyLoaded = document.querySelector(`script[src="${url}"]`);

            if (!alreadyLoaded) {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.onload = () => {
                    scriptLoadedRef.current = true;
                    handleProcess();
                };
                document.body.appendChild(script);
            } else {
                scriptLoadedRef.current = true;
                handleProcess();
            }
        } else {
            scriptLoadedRef.current = true;
            handleProcess();
        }
    }, [embedHtml, platform]);
};

const SkeletonPiece = memo(({ width, height, borderRadius = 2 }) => (
    <Box
        css={{
            ...SKELETON_ANIMATION,
            width,
            height,
            backgroundColor: colors.lightGray,
            borderRadius
        }}
    />
));

const TaggedProductBadge = memo(({ count }) => (
    <Box
        position='absolute'
        bottom={2}
        left={2}
        display='inline-flex'
        alignItems='center'
        gap={1}
        paddingY={1}
        paddingX={2}
        borderRadius={1}
        backgroundColor={colors.white}
        opacity={0.8}
        fontSize='sm'
        zIndex={15}
    >
        <Image
            src='/img/ufe/csf/product-count-icon.svg'
            alt='tag-product count icon'
            size={16}
        />
        <span>{count}</span>
    </Box>
));

const SocialSourceIcon = memo(({ platform }) => (
    <Flex
        position='absolute'
        top={2}
        right={2}
        alignItems='center'
        padding='2px'
        borderRadius={1}
        backgroundColor={colors.white}
        opacity={0.8}
        zIndex={15}
    >
        <Image
            src={`/img/ufe/csf/${platform}.svg`}
            alt={`${platform} icon`}
            size={20}
        />
    </Flex>
));

const PostDetailsSkeleton = memo(() => (
    <Flex
        position='relative'
        width={375}
        height={[375, null, 400]}
        overflow='hidden'
        borderRadius={2}
        backgroundColor={colors.white}
    >
        <SkeletonPiece
            width='100%'
            height='100%'
        />
    </Flex>
));

const PostDetailsFrame = memo(({ postContent, isSkeleton }) => {
    if (isSkeleton) {
        return <PostDetailsSkeleton />;
    }

    const {
        embedHtml, media, taggedProductCount, title, socialMedia
    } = postContent || {};

    const thumbnailUrl = media?.thumbnailUrl;
    const thumbnailDimensions = media?.thumbnailDimensions;

    const [embedState, setEmbedState] = useState({
        isMounted: false,
        embedFailed: false,
        embedLoaded: false
    });
    const embedRef = useRef(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        setEmbedState(prev => ({ ...prev, isMounted: true }));
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // 1. Only load the script in the hook
    useSocialMediaScript(embedHtml, socialMedia, () => {
        if (socialMedia === 'instagram' && isMountedRef.current) {
            setEmbedState(prev => ({ ...prev, embedLoaded: true }));
        }
    });

    // 2. In the component, after HTML is rendered, process the embed
    useEffect(() => {
        if (socialMedia !== 'instagram' || !embedHtml || !embedRef.current) {
            return;
        }

        let cancelled = false;

        // Use our shared utility for more consistent processing
        const processEmbed = () => {
            if (cancelled) {
                return;
            }

            if (window.instgrm?.Embeds?.process) {
                window.instgrm.Embeds.process();

                if (isMountedRef.current) {
                    setEmbedState(prev => ({ ...prev, embedLoaded: true }));
                }
            } else {
                // If Instagram isn't loaded yet, run the utility which handles loading
                initializeInstagramEmbeds();

                // Check back in a little while
                setTimeout(processEmbed, 500);
            }
        };

        // Defer to next tick to ensure DOM is updated
        setTimeout(processEmbed, 0);

        // eslint-disable-next-line consistent-return
        return () => {
            cancelled = true;
        };
    }, [embedHtml, socialMedia]);

    useEffect(() => {
        setEmbedState(prev => ({
            ...prev,
            embedLoaded: false,
            embedFailed: false
        }));
    }, [embedHtml]);

    useEffect(() => {
        const instagramEmbed = document.getElementById('instagram-embed-0');

        const listener = event => {
            // Important: Verify the origin to prevent security vulnerabilities
            if (event.origin !== 'https://www.instagram.com') {
                return;
            }

            const data = JSON.parse(event.data);

            // Example: If the iframe sends a specific message, respond
            if (data && data.type === 'MEASURE') {
                const contentHeight = data.details.height;

                if (instagramEmbed) {
                    instagramEmbed.style.height = `${contentHeight}px`;
                    instagramEmbed.height = contentHeight;
                }
            }
        };
        // Listen for messages from the iframe
        embedState.embedLoaded && window.addEventListener('message', listener);

        return () => {
            embedState.embedLoaded && window.removeEventListener('message', listener);
        };
    }, [embedState.embedLoaded]);

    return (
        <Flex
            position='relative'
            width={['100%', null, 400]}
            overflow='hidden'
            borderRadius={[0, null, 2]}
            backgroundColor={colors.white}
            alignSelf={['center', 'flex-start']}
        >
            {embedState.embedFailed && !embedState.embedLoaded && (
                <Box
                    position='absolute'
                    top={0}
                    left={0}
                    width='100%'
                    height='100%'
                    zIndex={1}
                >
                    <Image
                        src={thumbnailUrl}
                        alt={title || 'Post thumbnail'}
                        width='100%'
                        height='100%'
                        objectFit='cover'
                        originalWidth={thumbnailDimensions?.width}
                        originalHeight={thumbnailDimensions?.height}
                    />
                </Box>
            )}

            {taggedProductCount > 0 && <TaggedProductBadge count={taggedProductCount} />}
            {embedState.isMounted && socialMedia && <SocialSourceIcon platform={socialMedia} />}

            {embedHtml && (
                <Flex
                    ref={embedRef}
                    position='relative'
                    height='100%'
                    width='100%'
                    overflow='hidden'
                    justifyContent='center'
                    alignItems='center'
                    aspectRatio={[null, null, '1/1']}
                    zIndex={2}
                    dangerouslySetInnerHTML={{ __html: embedHtml }}
                />
            )}
        </Flex>
    );
});

PostDetailsFrame.propTypes = {
    postContent: PropTypes.shape({
        embedHtml: PropTypes.string,
        media: PropTypes.shape({
            thumbnailUrl: PropTypes.string,
            thumbnailDimensions: PropTypes.shape({
                height: PropTypes.number,
                width: PropTypes.number
            })
        }),
        taggedProductCount: PropTypes.number,
        title: PropTypes.string,
        socialMedia: PropTypes.string
    }),
    isSkeleton: PropTypes.bool
};

PostDetailsFrame.defaultProps = {
    isSkeleton: false
};

export default wrapFunctionalComponent(PostDetailsFrame, 'PostDetailsFrame');
