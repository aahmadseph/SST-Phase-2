/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text, Link } from 'components/ui';
import CategoryItem from 'components/CategoryTree/CategoryItem/CategoryItem';

class CategoryGroup extends BaseClass {
    render() {
        return (
            <li>
                <Text
                    is='h3'
                    fontWeight='bold'
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
                    {this.props.children.map((child, i) => {
                        return child.children && child.children.length ? (
                            <CategoryGroup
                                title={child.title}
                                path={child.path}
                                children={child.children}
                                key={'catGroupGroup' + i}
                            />
                        ) : (
                            <CategoryItem
                                title={child.title}
                                path={child.path}
                                key={'catGroupItem' + i}
                            />
                        );
                    })}
                </Box>
            </li>
        );
    }
}

export default wrapComponent(CategoryGroup, 'CategoryGroup');
