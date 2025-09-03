/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid, Image } from 'components/ui';
import RichText from 'components/Content/RichText';

class CanadaPostStrikeCheckoutMessage extends BaseClass {
    render() {
        const { shouldRender, ...restProps } = this.props;

        if (!shouldRender) {
            return null;
        }

        const { banner, marginBottom, isFrictionlessCheckout } = restProps;
        const icon = banner?.media?.src;

        return (
            <Grid
                paddingY={2}
                paddingX={3}
                marginTop={4}
                marginBottom={marginBottom}
                mx={isFrictionlessCheckout ? [4, null, 5] : 0}
                borderRadius={2}
                backgroundColor={banner?.backgroundColor || 'nearWhite'}
                columns={icon ? 'auto 1fr' : 'auto'}
            >
                {icon && (
                    <Image
                        src={icon}
                        css={styles.icon}
                        disableLazyLoad={true}
                    />
                )}
                <RichText
                    content={banner?.text}
                    style={styles.text}
                />
            </Grid>
        );
    }
}

const styles = {
    icon: {
        width: '1em',
        height: '1em',
        fontSize: '20px'
    },
    text: {
        display: 'inline',
        p: {
            display: 'inline'
        }
    }
};

CanadaPostStrikeCheckoutMessage.propTypes = {
    marginBottom: PropTypes.number
};

CanadaPostStrikeCheckoutMessage.defaultProps = {
    marginBottom: 4
};

export default wrapComponent(CanadaPostStrikeCheckoutMessage, 'CanadaPostStrikeCheckoutMessage', true);
