import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Image } from 'components/ui';

const ChanelBottomBanner = props => {
    return (
        <Flex
            alignItems='center'
            marginX={['-container', 0]}
            paddingX={['container', 5]}
            borderTop={'6px solid black'}
            justifyContent='center'
            {...props}
        >
            <Image
                display='block'
                disableLazyLoad={true}
                src='/img/ufe/logo-chanel-bottom.svg'
                width={[140, 160]}
                height={[140, 160]}
                marginTop={4}
                alt='Sephora is an authorized retailer of Chanel'
            />
        </Flex>
    );
};

ChanelBottomBanner.propTypes = {};

export default wrapFunctionalComponent(ChanelBottomBanner, 'ChanelBottomBanner');
