import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { space } from 'style/config';
import { Box, Image } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import BccBase from 'components/Bcc/BccBase/BccBase';
import BCC from 'utils/BCC';

const BccGrid = props => {
    const isMobile = Sephora.isMobile();

    const {
        displayTitle,
        mobileWebTitleText,
        imagePath,
        targetUrl,
        subHead,
        mobileWebSubHead,
        cols,
        components,
        isContained,
        parentTitle,
        disableLazyLoad = false,
        enablePageRenderTracking = null,
        alignment = 'center',
        mobileWebAlignment = 'left',
        verticalAlignment,
        titleImageAltText
    } = props;

    let gutter = 0;

    if (props.styleList && props.styleList['HORIZONTAL_PADDING'] !== undefined) {
        gutter = 4;
    }

    const textTitle = isMobile ? mobileWebTitleText : displayTitle;
    const hasTitle = textTitle || imagePath;

    const getTitle = () => {
        let title = imagePath ? (
            <Image
                src={imagePath}
                alt={titleImageAltText}
                disableLazyLoad={disableLazyLoad}
            />
        ) : (
            textTitle
        );

        if (targetUrl) {
            title = <Box href={targetUrl}>{title}</Box>;
        }

        return title;
    };

    const getCellAlignment = align => {
        switch (align) {
            case BCC.GRID_VERTICAL_ALIGNMENT.BOTTOM:
                return 'flex-end';
            case BCC.GRID_VERTICAL_ALIGNMENT.MIDDLE:
                return 'center';
            // LegacyGrid component defaults to `Top` / `flex-start`
            default:
                return null;
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleTestTarget = data => {
        const innerComponents = data.components;

        const { mWebBannerMarkdownHeading, styleList } = data;

        return {
            styleList,
            mWebBannerMarkdownHeading,
            componentType: BCC.COMPONENT_NAMES.GRID,
            components: innerComponents
        };
    };

    const subtitle = isMobile ? mobileWebSubHead : subHead;

    return (
        <BccBase
            {...props}
            data-lload={props.lazyLoad}
        >
            {(hasTitle || subtitle) && (
                <Box
                    marginBottom={isMobile ? 5 : 6}
                    textAlign={(isMobile ? mobileWebAlignment : alignment).toLowerCase()}
                >
                    {hasTitle && (
                        <Box
                            lineHeight='none'
                            fontSize={isMobile ? 'xl' : '2xl'}
                            fontFamily='serif'
                            children={getTitle()}
                        />
                    )}
                    {subtitle && (
                        <Box
                            marginTop={hasTitle && 2}
                            fontSize={isMobile ? 'base' : 'md'}
                            children={subtitle}
                        />
                    )}
                </Box>
            )}

            <div
                css={
                    isMobile &&
                    isContained && {
                        marginLeft: -space.container,
                        marginRight: -space.container
                    }
                }
            >
                <LegacyGrid
                    alignItems={getCellAlignment(verticalAlignment)}
                    gutter={gutter}
                >
                    {components.map((child, index) => {
                        const compWidth = child.thumbnailWidth ? child.thumbnailWidth : child.width;

                        if (typeof props.propsCallback === 'function') {
                            Object.assign(child, props.propsCallback(child.componentType));
                        }

                        return (
                            <LegacyGrid.Cell
                                key={index.toString()}
                                display='flex'
                                flexDirection='column'
                                backgroundColor={child.backGroundColor}
                                width={cols ? 1 / cols : compWidth ? 'fit' : 'fill'}
                            >
                                <BccComponentList
                                    style={
                                        !cols && compWidth
                                            ? {
                                                maxWidth: '100%',
                                                width: parseInt(compWidth)
                                            }
                                            : null
                                    }
                                    items={[child]}
                                    isContained={false}
                                    parentTitle={parentTitle}
                                    propsCallback={props.propsCallback}
                                    enablePageRenderTracking={enablePageRenderTracking}
                                />
                            </LegacyGrid.Cell>
                        );
                    })}
                </LegacyGrid>
            </div>
        </BccBase>
    );
};

export default wrapFunctionalComponent(BccGrid, 'BccGrid');
