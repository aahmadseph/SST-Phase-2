import React from 'react';
import InfoButton from 'components/InfoButton/InfoButton';
import Tooltip from 'components/Tooltip/Tooltip';
import { wrapFunctionalComponent } from 'utils/framework';
import { space, colors } from 'style/config';
import { Text } from 'components/ui';

const BeautyMatchTooltip = ({ beautyMatchesPopupTextValue, beautyMatchesPopupLink, clicked }) => {
    return (
        <Tooltip
            isFixed={true}
            sideOffset={-space[1]}
            content={
                <Text
                    fontWeight='normal'
                    is='p'
                    textAlign='left'
                >
                    {beautyMatchesPopupTextValue}
                    <a
                        href='/profile/BeautyPreferences'
                        children={beautyMatchesPopupLink}
                    />
                    .
                </Text>
            }
        >
            <InfoButton
                marginLeft={-1}
                css={
                    clicked && {
                        color: colors.white,
                        '.no-touch &:hover': {
                            color: colors.white
                        }
                    }
                }
            />
        </Tooltip>
    );
};

export default wrapFunctionalComponent(BeautyMatchTooltip, 'BeautyMatchTooltip');
