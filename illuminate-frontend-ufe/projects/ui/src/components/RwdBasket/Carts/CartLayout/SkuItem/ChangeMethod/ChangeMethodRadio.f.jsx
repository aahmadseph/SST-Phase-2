import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { Box, Flex, Icon } from 'components/ui';
import Radio from 'components/Inputs/Radio/Radio';
import { colors, lineHeights } from 'style/config';
import uiUtils from 'utils/UI';

const { SKELETON_ANIMATION } = uiUtils;

function RadioSkeleton({
    skeletonTitleWidth,
    hasSkeletonFirstRow,
    skeletonFirstRowMatchTitleHeight,
    skeletonFirstRowWidth,
    hasSkeletonSecondRow,
    skeletonSecondRowWidth,
    hasSkeletonBox
}) {
    const skeletonTitleHeight = 11;
    const skeletonRowHeight = 8;

    return (
        <Flex gap={1}>
            <Icon
                name='radioCircle'
                css={SKELETON_ANIMATION}
            />
            <Flex
                gap={2}
                flexDirection='column'
                paddingTop='0.14em'
            >
                <Box
                    backgroundColor='#D9D9D9'
                    borderRadius='full'
                    height={skeletonTitleHeight}
                    width={skeletonTitleWidth}
                    css={SKELETON_ANIMATION}
                />
                {hasSkeletonFirstRow && (
                    <Box
                        backgroundColor='#D9D9D9'
                        borderRadius='full'
                        height={skeletonFirstRowMatchTitleHeight ? skeletonTitleHeight : skeletonRowHeight}
                        width={skeletonFirstRowWidth}
                        css={SKELETON_ANIMATION}
                    />
                )}
                {hasSkeletonSecondRow && (
                    <Box
                        backgroundColor='#D9D9D9'
                        borderRadius='full'
                        height={skeletonRowHeight}
                        width={skeletonSecondRowWidth}
                        css={SKELETON_ANIMATION}
                    />
                )}
                {hasSkeletonBox && (
                    <Box
                        backgroundColor='#D9D9D9'
                        borderRadius={2}
                        height={32}
                        width={289}
                        css={SKELETON_ANIMATION}
                    />
                )}
            </Flex>
        </Flex>
    );
}

function ChangeMethodRadio({
    withIcon,
    isSkeleton,
    checked,
    iconName,
    skeletonTitleWidth,
    hasSkeletonFirstRow,
    skeletonFirstRowMatchTitleHeight,
    skeletonFirstRowWidth,
    hasSkeletonSecondRow,
    skeletonSecondRowWidth,
    hasSkeletonBox,
    testId,
    onChange,
    ...props
}) {
    const renderRadioSkeleton = (
        <RadioSkeleton
            skeletonTitleWidth={skeletonTitleWidth}
            hasSkeletonFirstRow={hasSkeletonFirstRow}
            skeletonFirstRowMatchTitleHeight={skeletonFirstRowMatchTitleHeight}
            skeletonFirstRowWidth={skeletonFirstRowWidth}
            hasSkeletonSecondRow={hasSkeletonSecondRow}
            skeletonSecondRowWidth={skeletonSecondRowWidth}
            hasSkeletonBox={hasSkeletonBox}
        />
    );

    const renderRadio = (
        <Radio
            alignItems='flex-start'
            dotOffset='0.14em'
            paddingY={0}
            lineHeight={lineHeights.none}
            checked={checked}
            data-at={Sephora.debug.dataAt(testId)}
            onChange={onChange}
            {...props}
        />
    );

    const renderRadioVariation = isSkeleton ? renderRadioSkeleton : renderRadio;

    const renderRadioWithIcon = (
        <Flex
            alignItems='flex-start'
            justifyContent='space-between'
            gap={1}
        >
            {renderRadioVariation}
            <Icon
                name={iconName}
                color={checked ? colors.black : '#888'}
            />
        </Flex>
    );

    return withIcon ? renderRadioWithIcon : renderRadioVariation;
}

ChangeMethodRadio.defaultProps = {
    withIcon: false,
    isSkeleton: false,
    skeletonTitleWidth: 168,
    hasSkeletonFirstRow: true,
    skeletonFirstRowMatchTitleHeight: false,
    skeletonFirstRowWidth: 116,
    hasSkeletonSecondRow: true,
    skeletonSecondRowWidth: 141,
    hasSkeletonBox: false
};

export default wrapFunctionalComponent(ChangeMethodRadio, 'ChangeMethodRadio');
