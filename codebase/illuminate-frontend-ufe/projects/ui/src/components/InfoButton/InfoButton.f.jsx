import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors } from 'style/config';
import { Box, Icon } from 'components/ui';

const InfoButton = React.forwardRef(({
    size, dataAt, color, hoverColor, buttonType = 'infoOutline', ...props
}, ref) => (
    <Box
        ref={ref}
        is='span'
        display='inline-block'
        verticalAlign='baseline'
        padding={2}
        margin={-2}
        lineHeight={0}
        color={color ? color : colors.gray}
        baseCss={{
            ':hover': { color: hoverColor ? hoverColor : colors.black }
        }}
        data-at={Sephora.debug.dataAt(dataAt ? dataAt + '_info_btn' : null)}
        role='button'
        tabIndex={0}
        {...props}
    >
        <Icon
            name={buttonType}
            size={size}
        />
    </Box>
));

InfoButton.defaultProps = {
    size: 16
};

export default wrapFunctionalComponent(InfoButton, 'InfoButton');
