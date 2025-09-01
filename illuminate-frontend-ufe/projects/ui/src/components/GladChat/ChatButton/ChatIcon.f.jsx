import React from 'react';
import { Flex, Icon } from 'components/ui';
import FrameworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FrameworkUtils;

const ChatIcon = React.forwardRef(({ ...props }, ref) => {
    return (
        <Flex
            ref={ref}
            position='relative'
            alignItems='center'
            {...props}
        >
            <span css={styles.iconWrap}>
                <Icon
                    name='gladChat'
                    size={24}
                    css={styles.icon}
                />
            </span>
        </Flex>
    );
});

const styles = {
    iconWrap: {
        position: 'relative'
    },
    icon: {
        display: 'block'
    }
};

export default wrapFunctionalComponent(ChatIcon, 'ChatIcon');
