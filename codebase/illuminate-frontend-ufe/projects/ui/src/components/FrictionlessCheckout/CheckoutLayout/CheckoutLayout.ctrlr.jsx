/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Grid } from 'components/ui';

class CheckoutLayout extends BaseClass {
    render() {
        const { mainContent, sidebarContent } = this.props;

        return (
            <Box paddingTop={[4, 4, 5]}>
                <Grid
                    columns={[1, 1, 1, '2fr 400px']}
                    gap={[4, 4, 5]}
                >
                    <div>{mainContent}</div>
                    <div>{sidebarContent}</div>
                </Grid>
            </Box>
        );
    }
}

export default wrapComponent(CheckoutLayout, 'CheckoutLayout');
