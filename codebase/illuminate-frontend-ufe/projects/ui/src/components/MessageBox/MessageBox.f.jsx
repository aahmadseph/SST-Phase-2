import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Icon } from 'components/ui';

function MessageBox({
    children, iconName, iconSize, iconColor, ...props
}) {
    return (
        <Grid {...props}>
            <Icon
                name={iconName}
                color={iconColor}
                size={iconSize}
            />
            <div>{children}</div>
        </Grid>
    );
}

MessageBox.defaultProps = {
    gap: 2,
    borderRadius: 2,
    columns: 'auto 1fr',
    backgroundColor: 'nearWhite',
    padding: 3,
    lineHeight: 'tight',
    iconName: 'infoOutline',
    iconColor: 'gray',
    iconSize: 16
};

export default wrapFunctionalComponent(MessageBox, 'MessageBox');
