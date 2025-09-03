import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Chevron from 'components/Chevron/Chevron';
import { Flex, Link, Text } from 'components/ui';
import { colors } from 'style/config';

const { wrapComponent } = FrameworkUtils;

class SimpleBreadCrumbs extends BaseClass {
    render() {
        const { items, lastItemTagName = 'h1', invertColor = false, ...props } = this.props;

        const breadcrumbs =
            items &&
            items.map((item, index) => {
                const isLastItem = items.length > 1 && index === items.length - 1;

                return (
                    <Flex
                        key={item.href || index.toString()}
                        alignItems='center'
                        {...props}
                    >
                        {item.href ? (
                            <Link
                                padding={2}
                                margin={-2}
                                key={index.toString()}
                                href={item.href}
                                onClick={e => item.onClick?.(e)}
                            >
                                <Text
                                    {...(isLastItem ? { is: lastItemTagName } : {})}
                                    key={index.toString()}
                                    color={invertColor ? colors.gray : ''}
                                    children={item.displayName}
                                />
                            </Link>
                        ) : (
                            <Text
                                key={index.toString()}
                                is={lastItemTagName}
                                color={invertColor ? '' : colors.gray}
                                children={item.displayName}
                            />
                        )}
                        {!isLastItem && (
                            <Chevron
                                direction='right'
                                size='.5em'
                                marginX={2}
                            />
                        )}
                    </Flex>
                );
            });

        return (
            <Flex
                fontSize='sm'
                alignItems='center'
                children={breadcrumbs}
            />
        );
    }
}

export default wrapComponent(SimpleBreadCrumbs, 'SimpleBreadCrumbs');
