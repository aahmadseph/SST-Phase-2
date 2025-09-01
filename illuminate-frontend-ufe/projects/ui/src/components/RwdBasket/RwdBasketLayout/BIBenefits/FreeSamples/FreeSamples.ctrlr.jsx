/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    Text, Box, Image, Flex
} from 'components/ui';
import Chevron from 'components/Chevron';
import { fontSizes } from 'style/config';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/FreeSamples/locales', 'FreeSamples');
const { openFreeSamplesModal } = RwdBasketActions;
class FreeSamples extends BaseClass {
    constructor(props) {
        super(props);
    }

    handleClick = e => {
        e.stopPropagation();
        openFreeSamplesModal(true);
    };

    render() {
        return (
            <Flex
                alignItems='center'
                justifyContent='space-between'
                width='100%'
                padding={3}
                fontSize={'sm'}
                onClick={this.handleClick}
            >
                <Flex
                    width={32}
                    height={32}
                    alignItems='center'
                    justifyContent='space-around'
                >
                    <Image
                        disableLazyLoad={true}
                        src='/img/ufe/rwd-basket/add_samples.svg'
                    />
                </Flex>

                <Flex
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Box
                        marginRight={'auto'}
                        marginLeft={3}
                    >
                        <Text
                            is={'p'}
                            fontWeight='bold'
                            fontSize={fontSizes.base}
                        >
                            {getText('samplesText')}
                        </Text>
                        <Text
                            is='p'
                            dangerouslySetInnerHTML={{
                                __html: getText('samplesSubText', [this.props.samplesAdded])
                            }}
                        />
                    </Box>
                    <Chevron
                        direction='right'
                        size={fontSizes.base}
                        color={'#888'}
                    />
                </Flex>
            </Flex>
        );
    }
}

export default wrapComponent(FreeSamples, 'FreeSamples', true);
