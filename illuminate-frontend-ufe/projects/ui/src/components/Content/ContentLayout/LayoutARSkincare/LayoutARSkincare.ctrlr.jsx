/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Container, Flex, Text } from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import contentConstants from 'constants/content';
import Breadcrumb from 'components/Content/Breadcrumb';
import MediaUtils from 'utils/Media';
const { Media } = MediaUtils;
import QRCode from 'react-qr-code';
import { mountHeroBanner } from 'utils/Layout';

const { CONTEXTS } = contentConstants;

const SKINCARE_APP_LINK = 'sephoraapp://beauty/skin-analysis-tool';

const LayoutARSkincare = ({
    localization, breadcrumbs, seo, navigation, ...props
}) => {
    const { heroBanner, content } = props.content;
    const isChild = !navigation?.action?.isCurrent;
    const heroBannerProps = mountHeroBanner({
        heroBanner,
        seo,
        isChild,
        navigation
    });

    return (
        <Container paddingX={[0, 4]}>
            <Container paddingX={[4, 0]}>
                {breadcrumbs && (
                    <Breadcrumb
                        breadcrumbs={breadcrumbs}
                        localization={localization?.breadcrumb}
                        fontSize='sm-bg'
                    />
                )}
            </Container>

            {heroBannerProps && (
                <ComponentList
                    enablePageRenderTracking={true}
                    trackingCount={1}
                    context={CONTEXTS.CONTAINER}
                    page='buying-guide'
                    items={[heroBannerProps]}
                />
            )}

            <Media greaterThan='sm'>
                <Container
                    paddingX={[4, 0]}
                    mb={6}
                >
                    <Flex
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                        backgroundColor='nearWhite'
                        width='100%'
                        px={6}
                        py={5}
                    >
                        <Flex flexDirection='column'>
                            <Text
                                is='h2'
                                fontSize='lg'
                                fontWeight='bold'
                                children={props.qrComponentTitle}
                            />

                            <Text
                                is='p'
                                children={props.qrComponentText}
                            />
                        </Flex>

                        <Flex
                            backgroundColor='white'
                            p={2}
                        >
                            <QRCode
                                size={152}
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                value={SKINCARE_APP_LINK}
                                viewBox='0 0 256 256'
                            />
                        </Flex>
                    </Flex>
                </Container>
            </Media>

            <Container paddingX={[4, 0]}>
                {content?.length && (
                    <ComponentList
                        enablePageRenderTracking={true}
                        trackingCount={1}
                        context={CONTEXTS.CONTAINER}
                        page='buying-guide'
                        items={content}
                        removeLastItemMargin={true}
                        removeFirstItemMargin={true}
                    />
                )}
            </Container>
        </Container>
    );
};

export default wrapFunctionalComponent(LayoutARSkincare, 'LayoutARSkincare');
