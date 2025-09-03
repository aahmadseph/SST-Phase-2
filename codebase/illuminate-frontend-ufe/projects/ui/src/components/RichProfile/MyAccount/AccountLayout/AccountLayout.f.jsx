import React from 'react';
import PropTypes from 'prop-types';
import {
    Container, Flex, Grid, Text, Divider
} from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import AccountNav from 'components/RichProfile/MyAccount/AccountLayout/AccountNav';

function AccountLayout({ page, title, children, beforeTitle }) {
    return (
        <Container
            paddingY={[5, 7]}
            hasLegacyWidth={true}
        >
            <Grid
                columns={[null, '20% 1fr']}
                gap={[5, null, 7]}
            >
                <main>
                    {beforeTitle}
                    {title && (
                        <>
                            <Text
                                is='h1'
                                fontSize={['xl', null, '2xl']}
                                fontFamily='serif'
                                lineHeight='tight'
                                children={title}
                            />
                            <Divider
                                marginTop={3}
                                height={2}
                                color='black'
                            />
                        </>
                    )}
                    {children}
                </main>
                <Divider
                    display={[null, 'none']}
                    marginX='-container'
                    thick={true}
                />
                <Flex
                    flexDirection='column'
                    borderRightWidth={[null, 1]}
                    borderColor='midGray'
                    paddingRight={[null, 4]}
                    order={[null, -1]}
                >
                    <AccountNav page={page} />
                </Flex>
            </Grid>
        </Container>
    );
}

AccountLayout.propTypes = {
    page: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    beforeTitle: PropTypes.string
};

export default wrapFunctionalComponent(AccountLayout, 'AccountLayout');
