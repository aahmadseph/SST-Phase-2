/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Link } from 'components/ui';

class CategoryItem extends BaseClass {
    render() {
        const { path, title, ...props } = this.props;

        return (
            <Box
                is='li'
                {...props}
            >
                <Link
                    href={path}
                    children={title}
                    paddingY={1}
                />
            </Box>
        );
    }
}

export default wrapComponent(CategoryItem, 'CategoryItem');
