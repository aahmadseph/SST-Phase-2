import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Image, Text } from 'components/ui';
import { colors } from 'style/config';
import LanguageLocale from 'utils/LanguageLocale';
const getText = LanguageLocale.getLocaleResourceFile(
    'components/Checkout/Sections/SddSections/SddSection/DeliveryWindow/locales',
    'DeliveryWindowOption'
);

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
    ...props
}) => (
    <Grid
        columns='1fr auto'
        alignItems='center'
        borderRadius={2}
        lineHeight='tight'
        minHeight={44}
        paddingX={3}
        paddingY={1}
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
        {isFreeRougeSDD && (
            <div>
                <Text
                    is='p'
                    textAlign='right'
                    fontWeight='bold'
                    children={getText('free')}
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
                children={isUserSDUMember ? getText('free') : price}
            />
        )}
    </Grid>
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
