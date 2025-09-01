import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Image, Flex, Text, Button
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import { colors } from 'style/config';

function CreditCardProgram({ ccTargeters }) {
    if (!ccTargeters) {
        return null;
    }

    const {
        buttonText, buttonUrl, title, text, tcText
    } = ccTargeters;

    return (
        <Box
            borderRadius={2}
            width='100%'
            display='block'
            padding={3}
            lineHeight='tight'
            backgroundColor={colors.white}
        >
            <Flex
                alignItems='center'
                justifyContent='space-between'
                width='100%'
                fontSize={'sm'}
            >
                <Image
                    disableLazyLoad={true}
                    height={32}
                    width={32}
                    src='/img/ufe/credit-card/credit-card.svg'
                    css={{ alignSelf: 'baseline' }}
                />
                <Flex
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Box
                        marginRight={'auto'}
                        marginLeft={3}
                    >
                        {title && (
                            <Text
                                is={'p'}
                                fontWeight='bold'
                                fontSize={'base'}
                            >
                                {title}
                            </Text>
                        )}
                        {text && (
                            <Markdown
                                marginTop={2}
                                content={text}
                            />
                        )}
                        {tcText && (
                            <Markdown
                                marginTop={2}
                                color={colors.gray}
                                content={tcText}
                            />
                        )}
                        {buttonUrl && buttonText ? (
                            <Button
                                css={{ textTransform: 'capitalize' }}
                                marginTop={2}
                                variant='secondary'
                                size='sm'
                                href={buttonUrl}
                                children={buttonText.toLowerCase()}
                            />
                        ) : null}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
}

export default wrapFunctionalComponent(CreditCardProgram, 'CreditCardProgram');
