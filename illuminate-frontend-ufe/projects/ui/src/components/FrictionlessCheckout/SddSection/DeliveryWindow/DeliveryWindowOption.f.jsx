import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Grid, Image, Text, Box
} from 'components/ui';
import { colors } from 'style/config';

const ACTIVE_BORDER_COLOR = colors.black;

const DeliveryWindowOption = ({
    label,
    labelColor,
    message,
    messageColor,
    price,
    isDisabled,
    isActive,
    isFreeRougeSDD,
    isUserSDUMember,
    localization: { free, freeForSDU },
    ...props
}) => (
    <Box
        borderRadius={2}
        minHeight={48}
        lineHeight='tight'
        paddingX={3}
        paddingY={2}
        borderWidth={1}
        borderColor='midGray'
        baseCss={{
            '&:hover': { borderColor: ACTIVE_BORDER_COLOR }
        }}
        {...(isActive && {
            borderColor: ACTIVE_BORDER_COLOR,
            css: { boxShadow: `0 0 0 1px ${ACTIVE_BORDER_COLOR}` }
        })}
        {...(isDisabled && {
            color: 'gray',
            backgroundColor: 'lightGray',
            borderColor: 'transparent'
        })}
        {...props}
    >
        <Grid
            alignItems='center'
            columns='1fr auto'
            lineHeight='tight'
        >
            <div>
                <Text
                    is='h3'
                    color={labelColor}
                    fontWeight='bold'
                    children={label}
                />
                {message && (
                    <Text
                        is='p'
                        fontSize='sm'
                        color={messageColor}
                        children={message}
                    />
                )}
            </div>
            <div>
                {isFreeRougeSDD && (
                    <div>
                        <Text
                            is='p'
                            textAlign='right'
                            fontWeight='bold'
                            children={free}
                        />
                        <Image
                            disableLazyLoad={true}
                            data-at={Sephora.debug.dataAt('rouge_logo')}
                            src='/img/ufe/bi/logo-rouge.svg'
                            alt='ROUGE'
                            marginTop={'0.25em'}
                            height={10}
                        />
                    </div>
                )}
                {!isFreeRougeSDD && price && (
                    <Text
                        is='p'
                        fontWeight='bold'
                        children={isUserSDUMember ? free : price}
                    />
                )}
            </div>
        </Grid>
        {isUserSDUMember && (
            <Text
                is='p'
                color={'green'}
                fontSize={'sm'}
                children={freeForSDU}
            />
        )}
    </Box>
);

DeliveryWindowOption.propTypes = {
    label: PropTypes.string.isRequired,
    labelColor: PropTypes.string,
    message: PropTypes.string,
    messageColor: PropTypes.string,
    price: PropTypes.string,
    isDisabled: PropTypes.bool,
    isActive: PropTypes.bool,
    isFreeRougeSDD: PropTypes.bool
};

DeliveryWindowOption.defaultProps = {
    labelColor: ''
};

export default wrapFunctionalComponent(DeliveryWindowOption, 'DeliveryWindowOption');
