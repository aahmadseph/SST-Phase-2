/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text, Link } from 'components/ui';
import CategoryItem from 'components/CategoryTree/CategoryItem/CategoryItem';
import CategoryGroup from 'components/CategoryTree/CategoryGroup/CategoryGroup';

class CategoryRoot extends BaseClass {
    render() {
        return (
            <Box
                is='li'
                paddingY={4}
            >
                <Text
                    is='h2'
                    fontWeight='bold'
                    fontSize='md'
                    marginBottom={2}
                    css={{ textTransform: 'uppercase' }}
                >
                    <Link
                        href={this.props.path}
                        paddingY={1}
                        children={this.props.title}
                    />
                </Text>
                <Box
                    is='ul'
                    marginBottom={2}
                >
                    {this.props.children?.map((child, i) => {
                        return child.children && child.children.length ? (
                            <CategoryGroup
                                title={child.title}
                                path={child.path}
                                children={child.children}
                                key={'catRootGroup' + i}
                            />
                        ) : (
                            <CategoryItem
                                fontWeight='bold'
                                marginBottom={2}
                                title={child.title}
                                path={child.path}
                                key={'catRootItem' + i}
                            />
                        );
                    })}
                </Box>
            </Box>
        );
    }
}

export default wrapComponent(CategoryRoot, 'CategoryRoot');
