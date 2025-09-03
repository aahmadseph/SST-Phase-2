/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import HeadTitle from 'components/Reward/LoyaltyPromo/HeadTitle';
import Chevron from 'components/Chevron';
import { Flex } from 'components/ui';
import { colors, space } from 'style/config';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';

class RewardSection extends BaseClass {
    constructor(props) {
        super(props);
        // Generate a unique class-wide id for aria-controls
        this.counter = RewardSection.counter++;
    }

    /* eslint-disable-next-line complexity */
    render() {
        const {
            isCollapsible,
            isExpanded,
            isHeaderOnly,
            isBodyOnly,
            isCarousel,
            isCheckout,
            isBopis,
            headContent,
            headImage,
            onHeadClick,
            children,
            getText,
            availableBiPoints,
            ...props
        } = this.props;

        const isMobile = Sephora.isMobile();
        const ariaId = `reward_section_${this.counter}`;
        const headImagePadding = isMobile || isCarousel ? 4 : 2;

        return (
            <Flex
                flexDirection='column'
                flex={1}
                lineHeight='tight'
                borderRadius={2}
                borderColor='midGray'
                borderWidth={isHeaderOnly ? [null, null, 1] : 1}
                {...(isCollapsible && {
                    position: 'relative',
                    baseCss: {
                        ':hover': hoverActiveStyle,
                        '&:not(:last-child)': {
                            marginBottom: space[4]
                        }
                    }
                })}
                {...(isExpanded && hoverActiveStyle)}
                {...props}
            >
                {isBodyOnly || (
                    <HeadTitle
                        isBopis={isBopis}
                        isCheckout={isCheckout}
                        getText={getText}
                        availableBiPoints={availableBiPoints}
                    />
                )}
                <LegacyGrid
                    data-at={Sephora.debug.dataAt('apply_points_section')}
                    alignItems='center'
                    paddingX={isHeaderOnly ? [null, null, 4] : 4}
                    paddingY={3}
                    {...(onHeadClick
                        ? {
                            onClick: () => onHeadClick(!isExpanded),
                            width: '100%',
                            css: {
                                outline: 0,
                                cursor: 'pointer',
                                '&:focus .Collapse-target': {
                                    textDecoration: 'underline'
                                }
                            }
                        }
                        : {
                            textAlign: 'center'
                        })}
                    {...(isCollapsible && {
                        ['aria-controls']: ariaId,
                        ['aria-expanded']: isExpanded
                    })}
                >
                    {headImage && (
                        <LegacyGrid.Cell
                            paddingRight={onHeadClick && headImagePadding}
                            width={onHeadClick && 'fit'}
                            children={headImage}
                        />
                    )}
                    <LegacyGrid.Cell
                        is='h2'
                        fontSize={isCarousel || 'sm'}
                        width={onHeadClick && 'fill'}
                        children={headContent}
                    />
                    {onHeadClick && (
                        <LegacyGrid.Cell
                            data-at={Sephora.debug.dataAt('apply_points_section_button')}
                            width='fit'
                        >
                            <Chevron direction={isHeaderOnly ? 'right' : isExpanded ? 'up' : 'down'} />
                        </LegacyGrid.Cell>
                    )}
                </LegacyGrid>
                {isHeaderOnly || (
                    <Flex
                        flexDirection='column'
                        flex={1}
                        id={isCollapsible ? ariaId : null}
                        paddingX={isCarousel ? 5 : 4}
                        paddingBottom={3}
                        style={isCollapsible && !isExpanded ? { display: 'none' } : null}
                    >
                        {children}
                    </Flex>
                )}
            </Flex>
        );
    }
}

RewardSection.counter = 0;

const hoverActiveStyle = {
    borderColor: colors.black,
    zIndex: 1
};

export default wrapComponent(RewardSection, 'RewardSection');
