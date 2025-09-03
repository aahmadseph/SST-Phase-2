import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, Flex } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import ChatEntry from 'components/Content/CustomerService/ChatWithUs/ChatEntry';
import content from 'constants/content';
import { CHAT_ENTRY } from 'constants/chat';

const getText = (text, vars) => localeUtils.getLocaleResourceFile('components/Content/CustomerService/ChatWithUs/locales', 'ChatWithUs')(text, vars);
const { COMPONENT_SPACING } = content;

const ChatWithUs = ({ sid, marginBottom }) => {
    return (
        <Box
            id={sid}
            backgroundColor='#F6F6F8'
            gridColumn={['span 6 !important', 'span 3 !important']}
            borderRadius={2}
            padding={[4, 5]}
            marginBottom={marginBottom}
        >
            <Text
                is='h2'
                fontWeight={'bold'}
                children={getText('chatWithUs')}
                fontSize='xl-bg'
                marginBottom={1}
            />
            <div>
                <div>
                    <Text fontSize='md'>{getText('representative')}</Text>{' '}
                </div>
                <Flex
                    marginBottom='4'
                    flexDirection='column'
                    gap={0}
                >
                    <div>
                        <Text
                            fontSize='md'
                            fontWeight={'bold'}
                        >
                            {getText('monFri')}:{' '}
                        </Text>
                        <Text fontSize='md'>{getText('monFriTime')}</Text>
                    </div>

                    <div>
                        <Text
                            fontSize='md'
                            fontWeight={'bold'}
                        >
                            {getText('satSun')}:{' '}
                        </Text>
                        <Text fontSize='md'>{getText('satSunTime')}</Text>
                    </div>
                </Flex>
                <ChatEntry type={CHAT_ENTRY.customerService} />
            </div>
        </Box>
    );
};

ChatWithUs.propTypes = {
    sid: PropTypes.string.isRequired,
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

ChatWithUs.defaultProps = {
    marginBottom: COMPONENT_SPACING.SM
};

export default wrapFunctionalComponent(ChatWithUs, 'ChatWithUs');
