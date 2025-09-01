import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Flex } from 'components/ui';

import { colors } from 'style/config';

class TopContentLayout extends BaseClass {
    bannerRef = React.createRef();

    componentDidMount() {
        const { updateIsDoubleLine } = this.props;
        const SINGLE_LINE_BANNER_HEIGHT = 48;

        if (updateIsDoubleLine && this.bannerRef?.current?.clientHeight > SINGLE_LINE_BANNER_HEIGHT) {
            updateIsDoubleLine();
        }
    }
    render() {
        const { children, backgroundColor, showBasketGreyBackground } = this.props;

        return (
            <Flex
                paddingX={3}
                paddingY={[2, 3]}
                borderRadius={2}
                lineHeight='tight'
                backgroundColor={backgroundColor || colors.nearWhite}
                width={'100%'}
                minHeight={['40px', '48px']}
                position={'relative'}
                ref={this.bannerRef}
                {...(showBasketGreyBackground && styles.boxShadow)}
            >
                {children}
            </Flex>
        );
    }
}

const styles = {
    boxShadow: {
        boxShadow: 'light'
    }
};

export default wrapComponent(TopContentLayout, 'TopContentLayout');
