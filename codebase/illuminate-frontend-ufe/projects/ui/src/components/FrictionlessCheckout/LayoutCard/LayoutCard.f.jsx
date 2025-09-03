/* eslint-disable no-unused-vars */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, borders } from 'style/config';
import { Box } from 'components/ui';
import SectionInfo from 'components/FrictionlessCheckout/LayoutCard/SectionInfo';
import ErrorMessage from 'components/FrictionlessCheckout/ErrorMessage/ErrorMessage';

function LayoutCard({
    children,
    sectionInfo,
    marginTop,
    marginBottom,
    icon,
    hasPaddingForChildren,
    isEditMode,
    isCollapsed,
    isNewUserFlow,
    sectionIcon,
    paddingBottom = 4,
    ariaLabel,
    role,
    CustomErrorComponent = null
}) {
    return (
        <Box
            borderRadius={3}
            boxShadow={[(!isEditMode || isCollapsed) && 'light']}
            paddingBottom={paddingBottom}
            marginTop={marginTop}
            marginBottom={marginBottom}
            {...(((isEditMode && !isCollapsed) || (!isEditMode && sectionInfo?.sectionLevelError)) && {
                style: { border: `${borders[2]} ${colors.black}` }
            })}
            aria-label={ariaLabel}
            role={role}
        >
            <SectionInfo
                sectionInfo={sectionInfo}
                icon={icon}
                isCollapsed={isCollapsed}
                isNewUserFlow={isNewUserFlow}
                sectionIcon={sectionIcon}
            />
            <Box
                paddingX={hasPaddingForChildren && [4, 4, 5]}
                marginTop={!sectionInfo?.removeMarginTop && 4}
                display={isCollapsed && 'none'}
                data-at={Sephora.debug.dataAt('ship_addr_line_1')}
            >
                {sectionInfo?.sectionLevelError?.length > 0 && (
                    <>
                        {Array.isArray(sectionInfo.sectionLevelError) ? (
                            <Box marginBottom={!sectionInfo?.removeMarginTop && 4}>
                                {sectionInfo.sectionLevelError.map(error => (
                                    <ErrorMessage
                                        key={error}
                                        message={error}
                                        hasPadding={!hasPaddingForChildren}
                                        {...(isEditMode && { addMarginTop: sectionInfo?.removeMarginTop })}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <>
                                {CustomErrorComponent ? (
                                    <CustomErrorComponent
                                        addMarginTop={sectionInfo?.removeMarginTop}
                                        addMarginBottom={!sectionInfo?.removeMarginTop}
                                        hasPadding={!hasPaddingForChildren}
                                    />
                                ) : (
                                    <ErrorMessage
                                        message={sectionInfo?.sectionLevelError}
                                        addMarginTop={sectionInfo?.removeMarginTop}
                                        addMarginBottom={!sectionInfo?.removeMarginTop}
                                        hasPadding={!hasPaddingForChildren}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
                {children}
            </Box>
        </Box>
    );
}

LayoutCard.defaultProps = {
    sectionInfo: {
        sectionNumber: '',
        title: '',
        subTitle: '',
        isChangePermitted: false,
        onChangeClick: () => {},
        hasDivider: true
    },
    hasPaddingForChildren: true,
    isEditMode: false
};

export default wrapFunctionalComponent(LayoutCard, 'LayoutCard');
