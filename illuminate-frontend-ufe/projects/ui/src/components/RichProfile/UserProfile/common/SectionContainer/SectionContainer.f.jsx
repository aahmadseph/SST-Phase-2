import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { measure, space } from 'style/config';
import {
    Box, Grid, Text, Divider, Link, Container
} from 'components/ui';
import IconLock from 'components/LegacyIcon/IconLock';
import localeUtils from 'utils/LanguageLocale';

function SectionContainer({
    title, link, intro, isMyProfile, hasDivider, children
}) {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/common/SectionContainer/locales', 'SectionContainer');

    return (
        <Box marginY={[5, 6]}>
            {hasDivider && (
                <Box
                    marginBottom={[5, 6]}
                    backgroundColor='nearWhite'
                    minHeight={[space[2], space[4]]}
                >
                    {isMyProfile && (
                        <Box
                            textAlign='center'
                            fontSize={['sm', 'base']}
                            paddingY={4}
                            lineHeight='none'
                            color='gray'
                        >
                            <IconLock
                                marginRight='1em'
                                fontSize='1.25em'
                            />
                            {getText('privateContent')}
                        </Box>
                    )}
                </Box>
            )}
            <Container hasLegacyWidth={true}>
                {title && (
                    <Box
                        textAlign={[null, 'center']}
                        marginBottom={[4, 5]}
                    >
                        <Grid
                            columns={['1fr auto', '1fr auto 1fr']}
                            alignItems='baseline'
                            lineHeight='tight'
                        >
                            <Box display={['none', 'block']} />
                            <Text
                                is='h2'
                                fontSize={['xl', '2xl']}
                                fontFamily='serif'
                            >
                                {title}
                            </Text>
                            <Box textAlign='right'>
                                {link && (
                                    <Link
                                        arrowDirection='right'
                                        href={link}
                                        padding={2}
                                        margin={-2}
                                    >
                                        {getText(intro ? 'exploreAll' : 'viewAll')}
                                    </Link>
                                )}
                            </Box>
                        </Grid>
                        {intro && (
                            <Text
                                is='p'
                                fontSize={['base', 'md']}
                                lineHeight='tight'
                                marginTop={4}
                                marginX={[null, 'auto']}
                                maxWidth={[null, measure[1]]}
                            >
                                {intro}
                            </Text>
                        )}
                        <Divider
                            display={[null, 'none']}
                            marginTop={4}
                        />
                    </Box>
                )}
                {children}
            </Container>
        </Box>
    );
}

export default wrapFunctionalComponent(SectionContainer, 'SectionContainer');
