import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import { mediaQueries, colors } from 'style/config';

import { Flex, Box, Text } from 'components/ui';
import EDPIcon from 'components/Content/Happening/HappeningEDP/EDPReservationPolicies/EDPIcon';

import LanguageLocale from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocale;

const removeSpacesAndLowerCase = (inputString = '') => inputString.replace(/\s/g, '').toLowerCase();

function EDPReservationPolicies({ policies }) {
    if (!policies) {
        return null;
    }

    const getText = getLocaleResourceFile('components/Content/Happening/HappeningEDP/EDPReservationPolicies/locales', 'EDPReservationPolicies');

    return (
        <>
            <Text
                is='h2'
                fontSize={['md', 'lg']}
                fontWeight='bold'
                lineHeight='tight'
                children={getText('sectionTitle')}
            />
            <Box
                marginTop={[4, 5]}
                css={{
                    [mediaQueries.sm]: {
                        columns: 2,
                        columnGap: 24
                    }
                }}
            >
                {policies.map(({ type, displayName, description }) => (
                    <Flex
                        key={`${type}`}
                        alignItems='flex-start'
                        gap={[2, 4]}
                        marginBottom={4}
                        css={{
                            breakInside: 'avoid',
                            ':last-child': {
                                marginBottom: 0
                            }
                        }}
                    >
                        <EDPIcon name={removeSpacesAndLowerCase(type)} />
                        <Box
                            width={['auto']}
                            flex={[1]}
                        >
                            <Text
                                is='h3'
                                fontSize={'md'}
                                fontWeight='bold'
                                lineHeight='tight'
                                marginBottom={1}
                                dangerouslySetInnerHTML={{ __html: displayName }}
                            />
                            <Text
                                is='p'
                                lineHeight='tight'
                                css={styles.policies}
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        </Box>
                    </Flex>
                ))}
            </Box>
        </>
    );
}

const styles = {
    policies: {
        '& a': {
            color: colors.blue,
            '&:hover': {
                opacity: 0.6,
                textDecoration: 'underline'
            }
        }
    }
};

export default wrapFunctionalComponent(EDPReservationPolicies, 'EDPReservationPolicies');
