import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors } from 'style/config';
import {
    Box, Flex, Text, Link, Divider, Icon
} from 'components/ui';
import ScrollAnchor from 'components/ScrollAnchor/ScrollAnchor';

const SectionInfo = ({
    sectionInfo, icon, isCollapsed, isNewUserFlow, localization, sectionIcon
}) => {
    const {
        sectionNumber,
        title,
        subTitle,
        isChangePermitted,
        onChangeClick,
        hasDivider,
        renderErrorView,
        sectionLevelError,
        coustomChangeLabel = null,
        sectionName
    } = sectionInfo;

    const renderTitle = () => {
        if (sectionNumber && title) {
            return `${sectionNumber}. ${title}`;
        } else {
            return title;
        }
    };

    return (
        <>
            <ScrollAnchor
                id={sectionName}
                hasOffset={false}
            />
            <Flex
                justifyContent='space-between'
                alignItems='flex-start'
                paddingX={[4, 4, 5]}
                paddingTop={4}
            >
                <Box>
                    {title?.length > 0 && (
                        <Flex
                            alignItems='center'
                            gap={2}
                        >
                            {(sectionLevelError?.length > 0 || renderErrorView) && (
                                <Icon
                                    name='alert'
                                    size={[16, 24]}
                                    color='error'
                                />
                            )}
                            <Text
                                is='h2'
                                fontSize={['md', 'md', 'lg']}
                                fontWeight='bold'
                                children={renderTitle()}
                                lineHeight={'tight'}
                            />
                            {icon && icon}
                        </Flex>
                    )}
                    {subTitle?.length > 0 && (
                        <Text
                            is='p'
                            color={colors.gray}
                            marginTop={1}
                            fontSize={['sm', 'sm', 'base']}
                            lineHeight={['tight', 'tight', 'base']}
                            children={subTitle}
                        />
                    )}
                </Box>
                {isChangePermitted && !isCollapsed && !isNewUserFlow && (
                    <Link
                        color='blue'
                        lineHeight={'tight'}
                        children={coustomChangeLabel || localization.change}
                        onClick={() => onChangeClick(true)}
                        aria-label={`${localization.change} ${title}`}
                    />
                )}
                {!isChangePermitted && sectionIcon && sectionIcon}
            </Flex>
            {hasDivider && !isCollapsed && (
                <Divider
                    marginTop={[3, 3, 4]}
                    color={colors.lightGray}
                />
            )}
        </>
    );
};

export default wrapFunctionalComponent(SectionInfo, 'SectionInfo');
