import React from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button, Divider, Flex, Icon, Text, Link
} from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import mediaUtils from 'utils/Media';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';

const { Media } = mediaUtils;
const { getLocaleResourceFile } = localeUtils;

const SubmitComponent = ({
    hasUserVerified, onClick, totalItems, priceInfo, openMediaModal, onSubmit
}) => {
    const getText = getLocaleResourceFile('components/RichProfile/MyAccount/ReplacementOrder/locales', 'ReplacementOrder');

    const getTotalItemsCountText = () =>
        `${getText('orderTotal')}: (${totalItems} ${totalItems > 1 ? getText('itemPlural') : getText('itemSingular')})`;

    return (
        <Box
            position={['fixed', null, 'initial']}
            backgroundColor={['white', null, 'transparent']}
            bottom={['-20px', '-20px', 0]}
            marginLeft={[-3, -4, 0]}
            paddingX={[4, null, 5]}
            paddingTop={[2, null, 5]}
            paddingBottom={['14px', null, 5]}
            zIndex={['1', null, '0']}
            borderRadius={[null, null, 2]}
            borderWidth={[null, null, 1]}
            borderColor={[null, null, 'midGray']}
            height={[null, null, 'fit-content']}
        >
            <Box>
                <Media greaterThan='sm'>
                    <Flex
                        alignItems='center'
                        justifyContent='space-between'
                        marginY={1}
                    >
                        <Text
                            fontSize={14}
                            fontWeight={400}
                            is={'p'}
                        >
                            {getText('orderSubtotalPlusTax')}
                        </Text>
                        <Text
                            fontSize={14}
                            fontWeight={700}
                            is={'p'}
                        >
                            {priceInfo?.orderSubTotalWithTax}
                        </Text>
                    </Flex>
                    <Flex
                        alignItems='center'
                        justifyContent='space-between'
                        marginY={1}
                    >
                        <Link
                            onClick={() => openMediaModal()}
                            padding={1}
                            margin={-1}
                        >
                            {getText('shippingAndHandling')}
                            <Icon
                                name='infoOutline'
                                size={'1em'}
                                marginLeft={2}
                            />
                        </Link>
                        <Text
                            fontSize={14}
                            fontWeight={700}
                            is={'p'}
                        >
                            {priceInfo?.shippingHandlingFee}
                        </Text>
                    </Flex>
                    <Flex
                        alignItems='center'
                        justifyContent='space-between'
                        marginY={1}
                    >
                        <Text
                            fontSize={14}
                            fontWeight={400}
                            is={'p'}
                        >
                            {getText('oneTimeReplacement')}
                        </Text>
                        <Text
                            fontSize={14}
                            fontWeight={700}
                            is={'p'}
                        >
                            {`-${priceInfo?.oneTimeReplacementFee}`}
                        </Text>
                    </Flex>
                    <Divider marginY={4} />
                    <Flex
                        alignItems='center'
                        justifyContent='space-between'
                        marginY={1}
                    >
                        <Text
                            fontSize={16}
                            fontWeight={700}
                            is={'p'}
                        >
                            {getTotalItemsCountText()}
                        </Text>
                        <Text
                            fontSize={16}
                            fontWeight={700}
                            is={'p'}
                        >
                            {priceInfo?.orderTotal}
                        </Text>
                    </Flex>
                    <Divider marginY={4} />
                </Media>
                <Media lessThan='md'>
                    <Flex
                        alignItems='center'
                        justifyContent='space-between'
                        marginBottom={1}
                    >
                        <Text
                            fontSize={14}
                            fontWeight={700}
                            is={'p'}
                        >
                            {getTotalItemsCountText()}
                        </Text>
                        <Text
                            fontSize={14}
                            fontWeight={700}
                            is={'p'}
                        >
                            {priceInfo?.orderTotal}
                        </Text>
                    </Flex>
                </Media>
                <Checkbox
                    checked={hasUserVerified}
                    onClick={onClick}
                    name='agreedTerms'
                >
                    {getText('terms')}
                </Checkbox>
                <Flex
                    alignItems='center'
                    justifyContent='space-around'
                    marginY={4}
                >
                    <Button
                        onClick={onSubmit}
                        variant='special'
                        type='submit'
                        width={['100%']}
                        children={getText('submitForReview')}
                        disabled={!hasUserVerified}
                    />
                </Flex>
            </Box>
        </Box>
    );
};

SubmitComponent.defaultProps = {
    hasUserVerified: false,
    onClick: () => {},
    totalItems: 1
};

SubmitComponent.propTypes = {
    hasUserVerified: PropTypes.bool,
    onClick: PropTypes.func,
    totalItems: PropTypes.number
};

export default wrapFunctionalComponent(SubmitComponent, 'SubmitComponent');
