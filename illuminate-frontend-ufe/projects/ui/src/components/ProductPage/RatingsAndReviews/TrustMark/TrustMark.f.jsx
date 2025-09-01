import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Text, Image, Flex, Icon, Link
} from 'components/ui';
import { colors } from 'style/config';

const TrustMark = props => {
    const { localization, showInfoModal, triggerSOTAnalytics, triggerAPLAnalytics } = props;

    const handleInfoIconClick = () => {
        showInfoModal({
            isOpen: true,
            title: localization.modalTitle,
            message: (
                <p>
                    {localization.modalBody}{' '}
                    <Link
                        color='blue'
                        target='_blank'
                        href='https://www.bazaarvoice.com/legal/trustmark/'
                        children={localization.modalLink}
                        onClick={triggerSOTAnalytics}
                    />
                </p>
            ),
            showFooter: false,
            width: 560
        });

        triggerAPLAnalytics();
    };

    return (
        <Flex flexDirection='column'>
            <Text
                is='p'
                marginTop={2}
                lineHeight='tight'
                fontSize='sm'
                maxWidth={'28em'}
                color={colors.gray}
            >
                {localization.legalMessage}
            </Text>

            <Flex
                marginTop={3}
                alignItems='center'
            >
                <Image
                    src='/img/ufe/trust-mark.svg'
                    alt='Authentic Reviews bazaar voice'
                />
                <button
                    onClick={handleInfoIconClick}
                    aria-controls='modal'
                    aria-label={localization.openModalLabel}
                    aria-expanded='false'
                    style={{ marginLeft: '10px' }}
                    type='button'
                >
                    <Icon
                        name='infoOutline'
                        size='16px'
                        color={colors.gray}
                        css={{
                            cursor: 'pointer',
                            ':hover': { color: colors.black }
                        }}
                    />
                </button>
            </Flex>
        </Flex>
    );
};

export default wrapFunctionalComponent(TrustMark, 'TrustMark');
