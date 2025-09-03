import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { colors, space } from 'style/config';
import { Flex } from 'components/ui';

const TAB_BORDER_WIDTH = 2;

class BankActivityTabs extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const tabStyle = {
            paddingRight: space[4],
            paddingBottom: space[2],
            paddingLeft: space[4],
            marginBottom: -TAB_BORDER_WIDTH,
            color: colors.gray,
            borderBottomWidth: TAB_BORDER_WIDTH,
            borderColor: 'transparent',
            ':hover': !Sephora.isTouch
                ? {
                    color: colors.gray
                }
                : {},
            ':disabled': {
                color: colors.black,
                borderColor: colors.black
            }
        };

        return (
            <Flex
                fontWeight='medium'
                marginBottom={-TAB_BORDER_WIDTH + 'px'}
                borderBottom={TAB_BORDER_WIDTH}
                borderColor='nearWhite'
            >
                {React.Children.map(
                    this.props.children,
                    child =>
                        child &&
                        React.cloneElement(child, {
                            css: tabStyle
                        })
                )}
            </Flex>
        );
    }
}

export default wrapComponent(BankActivityTabs, 'BankActivityTabs');
