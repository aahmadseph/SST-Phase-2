/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { colors } from 'style/config';
import { Box, Text, Link } from 'components/ui';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import content from 'constants/content';

const { COMPONENT_SPACING } = content;
const getText = (text, vars) => localeUtils.getLocaleResourceFile('components/Content/CustomerService/CallUs/locales', 'CallUs')(text, vars);

class CallUs extends BaseClass {
    constructor(props) {
        super(props);
    }

    render() {
        const { sid, vibSegment, marginBottom } = this.props;
        const { ROUGE } = userUtils.types;

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
                    children={getText('callUs')}
                    fontSize='xl-bg'
                    marginBottom={1}
                />
                <div>
                    <Box marginBottom={3}>
                        <div>
                            <Link
                                href={'tel:1-877-737-4672'}
                                color={colors.blue}
                            >
                                <Text fontSize='md'>{getText('phone')}</Text>
                            </Link>{' '}
                            <Text fontSize='md'>{getText('phoneLocation')}</Text>{' '}
                        </div>
                        <div>
                            <Text fontSize='md'>{getText('hearingImpaired')}</Text>{' '}
                            <Link
                                href='https://www.sephora.com/beauty/accessibility'
                                color={colors.blue}
                            >
                                <Text fontSize='md'>{getText('seeAccessibility')}</Text>
                            </Link>{' '}
                        </div>
                        {vibSegment === ROUGE && (
                            <div>
                                <Text fontSize='md'>{getText('rougePrivate')}</Text>{' '}
                                <Link
                                    href={'tel:1-855-557-6843'}
                                    color={colors.blue}
                                >
                                    <Text fontSize='md'>{getText('rougePhone')}</Text>
                                </Link>{' '}
                                <Text fontSize='md'>{getText('rougePhoneFull')}</Text>{' '}
                            </div>
                        )}
                    </Box>
                    <Text fontSize='md'>{getText('representative')}</Text>
                    <br />
                    <Text
                        fontSize='md'
                        fontWeight={'bold'}
                    >
                        {getText('monFri')}:{' '}
                    </Text>
                    <Text fontSize='md'>{getText('monFriTime')}</Text> <br />
                    <Text
                        fontSize='md'
                        fontWeight={'bold'}
                    >
                        {getText('satSun')}:{' '}
                    </Text>
                    <Text fontSize='md'>{getText('satSunTime')}</Text>{' '}
                </div>
            </Box>
        );
    }
}

CallUs.propTypes = {
    sid: PropTypes.string.isRequired,
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

CallUs.defaultProps = {
    marginBottom: COMPONENT_SPACING.SM
};

export default wrapComponent(CallUs, 'CallUs', true);
