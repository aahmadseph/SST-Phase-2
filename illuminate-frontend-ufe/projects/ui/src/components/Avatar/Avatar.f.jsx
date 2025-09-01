import React from 'react';
import { colors } from 'style/config';
import { Image } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

const styles = {
    base: {
        borderRadius: 99999,
        overflow: 'hidden',
        objectFit: 'cover',
        flexShrink: 0
    },
    outline: { boxShadow: `0 0 0 1px ${colors.white}, 0 0 0 2px ${colors.black}, 0 0 0 3px ${colors.white}` },
    altOutline: { boxShadow: `0 0 0 1px ${colors.white}` }
};

// eslint-disable-next-line object-curly-newline
const Avatar = ({ src, size = 24, isOutlined, avatar, ...restProps }) => (
    <Image
        src={src || avatar}
        size={size}
        disableLazyLoad
        baseCss={[styles.base, styles.altOutline, isOutlined && styles.outline]}
        {...restProps}
    />
);

export default wrapFunctionalComponent(Avatar, 'Avatar');
