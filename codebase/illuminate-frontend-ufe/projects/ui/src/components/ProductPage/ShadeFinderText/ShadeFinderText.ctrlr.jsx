import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import { Box, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import ColorIQBadge from 'components/ProductPage/ColorIQBadge/ColorIQBadge';
import Location from 'utils/Location';

const FOUNDATION_CATEGORY_URL = '/shop/foundation-makeup';

class ShadeFinderText extends BaseClass {
    state = {
        wizardMatchText: null,
        wizardSkuId: null,
        currentSkuId: null,
        isMatch: false,
        profileColorIQ: undefined
    };

    isMatch = () => {
        const { wizardSkuId, currentSkuId } = this.state;

        return wizardSkuId && currentSkuId && wizardSkuId === currentSkuId;
    };

    componentDidMount() {
        store.setAndWatch('wizard', this, value => {
            const wizardMatchText = value.wizard && value.wizard.matchText;
            const wizardSkuId = value.wizard && value.wizard.result && value.wizard.result.skuId;
            this.setState(
                {
                    wizardMatchText,
                    wizardSkuId
                },
                () => {
                    this.setState({ isMatch: this.isMatch() });
                }
            );
        });

        store.setAndWatch('page.product', this, value => {
            const currentSkuId = value.product && value.product.currentSku && value.product.currentSku.skuId;
            this.setState({ currentSkuId }, () => {
                this.setState({ isMatch: this.isMatch() });
            });
        });
    }

    render() {
        const getText = resourceWrapper(localeUtils.getLocaleResourceFile('components/ProductPage/ShadeFinderText/locales', 'ShadeFinderText'));
        const noMatch = 'no match';
        const { product, colorIQMatch } = this.props;
        const noColorIQNoMatch = 'No Match';

        const { wizardMatchText, isMatch } = this.state;

        const matchText = wizardMatchText && wizardMatchText.toLowerCase();
        const shadeFinderResultText = matchText === noMatch ? getText('noMatches') : getText('matchFound');

        if (colorIQMatch && colorIQMatch.skuId && colorIQMatch.skuId !== noColorIQNoMatch && matchText !== noMatch && !this.state.wizardSkuId) {
            return (
                <ColorIQBadge
                    product={product}
                    isColorIQ={false}
                />
            );
        } else {
            if (!matchText || (!isMatch && matchText !== noMatch)) {
                return null;
            } else {
                return (
                    <Box
                        marginRight='auto'
                        paddingX='.5em'
                        paddingY='.125em'
                        fontSize='sm'
                        lineHeight='tight'
                        backgroundColor='nearWhite'
                        borderRadius={2}
                    >
                        {shadeFinderResultText}
                        {matchText === noMatch && (colorIQMatch.skuId === noColorIQNoMatch || !colorIQMatch.skuId) && (
                            <React.Fragment>
                                {' '}
                                <Link
                                    display='inline'
                                    padding={1}
                                    margin={-1}
                                    href={FOUNDATION_CATEGORY_URL}
                                    onClick={e => {
                                        Location.navigateTo(e, FOUNDATION_CATEGORY_URL);
                                    }}
                                    color='blue'
                                    children={getText('seeAllFoundations')}
                                />
                            </React.Fragment>
                        )}
                        {colorIQMatch?.skuId && colorIQMatch?.skuId !== noColorIQNoMatch && (
                            <React.Fragment>
                                {' '}
                                <ColorIQBadge
                                    colorIQMatch={colorIQMatch}
                                    product={product}
                                    isColorIQ={true}
                                />
                            </React.Fragment>
                        )}
                    </Box>
                );
            }
        }
    }
}

export default wrapComponent(ShadeFinderText, 'ShadeFinderText', true);
