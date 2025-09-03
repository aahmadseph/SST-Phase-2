import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RecapItem from 'components/Content/Recap/RecapItem';
import {
    Grid, Text, Button, Link
} from 'components/ui';
import RecapImage from 'components/Content/Recap/RecapImage';
import Markdown from 'components/Markdown/Markdown';
import languageLocale from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import {
    radii, colors, fontSizes, space
} from 'style/config';

const getText = resourceWrapper(languageLocale.getLocaleResourceFile('components/Content/Recap/RecapBasket/locales', 'RecapBasket'));

const IMAGE_SIZE = [59, 48];

function RecapBasket({ uniqueSkus, totalItemCount, shouldRenderCarouselBasket, ...props }) {
    let checkoutMessage = null;

    if (props.hasStandardItems) {
        if (props.hasSufficientPoints) {
            checkoutMessage = getText('applyPoints');
        } else if (!props.isBopisOnly) {
            checkoutMessage = getText('freeShipping');
        }
    }

    return (
        <RecapItem {...props}>
            {shouldRenderCarouselBasket && (
                <>
                    {props.showApplyPointsInReadyToCheckoutSection && checkoutMessage && (
                        <Markdown
                            css={styles.pill}
                            content={checkoutMessage}
                        />
                    )}
                    <Grid
                        width={IMAGE_SIZE}
                        repeat='fill'
                        gap={[1, 2]}
                    >
                        {uniqueSkus.slice(0, 3).map((sku, index) => (
                            <RecapImage
                                key={`recap_basket_${sku.skuId}`}
                                sku={sku}
                                size={IMAGE_SIZE}
                                {...(index > 1 && {
                                    display: ['none', 'block']
                                })}
                            />
                        ))}
                    </Grid>
                    <Text
                        is='p'
                        marginTop={2}
                        marginBottom='auto'
                        paddingBottom={2}
                    >
                        {getText(
                            'total',
                            false,
                            <strong children={`${totalItemCount} ${getText('item')}${totalItemCount !== 1 ? 's' : ''}`} />,
                            <Link
                                is='span'
                                color='blue'
                                underline={true}
                                children={getText('basket')}
                            />
                        )}
                    </Text>
                    <Button
                        is='span'
                        variant='special'
                        size='sm'
                        children={getText('checkout')}
                    />
                </>
            )}
        </RecapItem>
    );
}

const styles = {
    pill: {
        display: 'inline-block',
        padding: space[1],
        marginRight: 'auto',
        marginBottom: space[3],
        borderRadius: radii[2],
        backgroundColor: colors.lightBlue,
        fontSize: fontSizes.sm
    }
};

RecapBasket.propTypes = {
    uniqueSkus: PropTypes.array.isRequired,
    totalItemCount: PropTypes.number.isRequired,
    shouldRenderCarouselBasket: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(RecapBasket, 'RecapBasket');
