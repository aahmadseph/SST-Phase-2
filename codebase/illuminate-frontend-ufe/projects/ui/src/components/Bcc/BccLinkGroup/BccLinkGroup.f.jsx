import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Image } from 'components/ui';
import BccLinkWrapper from 'components/Bcc/BccLinkGroup/BccLinkWrapper';
import BccLink from 'components/Bcc/BccLink/BccLink';
import TestTarget from 'components/TestTarget/TestTarget';
import BccBase from 'components/Bcc/BccBase/BccBase';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';

const BccLinkGroup = props => {
    const isMobile = Sephora.isMobile();

    const {
        isContained,
        title,
        headerImage,
        mwebHeaderImage,
        altText,
        links,
        isSimple,
        headerImageAltText,
        enablePageRenderTracking = false
    } = props;

    // outdent to hit browser chrome when within a LegacyContainer component
    // and not within another component
    const outdent = isMobile && isContained;

    const hasImgTitle = headerImage || mwebHeaderImage;

    return isSimple ? (
        <BccBase {...props}>
            <nav aria-label={title || altText}>
                {title && (
                    <Box
                        fontSize='md'
                        paddingY={1}
                        fontWeight='bold'
                        children={title}
                    />
                )}
                {links &&
                    links.map((link, index) => {
                        return (
                            <BccLink
                                paddingY={1}
                                key={index.toString()}
                                url={link.targetScreen.targetUrl}
                                target={link.targetScreen.targetWindow}
                                title={link.altText}
                                text={link.displayTitle}
                                origin={props.origin}
                                modalTemplate={link.modalComponentTemplate}
                                anaNavPath={['top nav', title, link.displayTitle]}
                            />
                        );
                    })}
            </nav>
            {enablePageRenderTracking && <PageRenderReport />}
        </BccBase>
    ) : (
        <BccBase {...props}>
            <nav aria-label={title || altText}>
                {(title || hasImgTitle) && (
                    <Box
                        fontSize='xl'
                        lineHeight='none'
                        fontFamily='serif'
                        marginX={outdent && mwebHeaderImage && '-container'}
                        marginBottom={hasImgTitle ? '-1px' : 3}
                    >
                        {hasImgTitle ? (
                            <Image
                                src={isMobile ? mwebHeaderImage : headerImage}
                                alt={headerImageAltText}
                                marginX='auto'
                                display='block'
                            />
                        ) : (
                            title
                        )}
                    </Box>
                )}
                <Box
                    borderTop={1}
                    borderBottom={1}
                    borderColor='divider'
                    marginX={outdent && '-container'}
                >
                    {links &&
                        links.map((link, linkIndex) => {
                            const linkProps = Object.assign({}, link, {
                                linkIndex: linkIndex,
                                url: link.targetScreen.targetUrl,
                                target: link.targetScreen.targetWindow,
                                title: link.altText,
                                text: link.displayTitle,
                                anaNavPath: [title, link.displayTitle],
                                modalTemplate: link.modalComponentTemplate,
                                origin: props.origin
                            });

                            if (link.enableTesting) {
                                return (
                                    <TestTarget
                                        key={linkIndex.toString()}
                                        testComponent={BccLinkWrapper}
                                        testEnabled
                                        testName={link.testName}
                                        isBcc
                                        {...linkProps}
                                    />
                                );
                            } else {
                                return (
                                    <BccLinkWrapper
                                        key={linkIndex.toString()}
                                        {...linkProps}
                                    />
                                );
                            }
                        })}
                </Box>
            </nav>
            {enablePageRenderTracking && <PageRenderReport />}
        </BccBase>
    );
};

export default wrapFunctionalComponent(BccLinkGroup, 'BccLinkGroup');
