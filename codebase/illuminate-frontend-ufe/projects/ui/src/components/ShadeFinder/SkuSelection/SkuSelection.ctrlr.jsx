/* eslint-disable class-methods-use-this */
import React from 'react';
import store from 'store/Store';
import { colors } from 'style/config';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import reverseLookUpApi from 'services/api/sdn';
import LanguageLocale from 'utils/LanguageLocale';
import wizardActions from 'actions/WizardActions';
import WizardBody from 'components/Wizard/WizardBody';
import WizardSubhead from 'components/Wizard/WizardSubhead';
import {
    Grid, Box, Link, Image, Text
} from 'components/ui';

const { wrapComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocale;

class SkuSelection extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { regularChildSkus: null };
    }

    render() {
        const { regularChildSkus, brandName, displayName } = this.state;

        const getText = getLocaleResourceFile('components/ShadeFinder/SkuSelection/locales', 'SkuSelection');

        return regularChildSkus ? (
            <React.Fragment>
                <WizardSubhead>
                    {getText('selectCurrent')}
                    <br />
                    <Text
                        fontWeight='bold'
                        numberOfLines={1}
                    >
                        {brandName + ' ' + displayName}
                    </Text>
                </WizardSubhead>
                <WizardBody data-at={Sephora.debug.dataAt('swatch_selection')}>
                    {regularChildSkus.map(sku => (
                        <Link
                            key={sku.skuId}
                            width='100%'
                            hoverSelector='.Link-target'
                            onClick={() => this.selectSku(sku, brandName)}
                        >
                            <Grid
                                is='span'
                                columns='auto 1fr'
                                gap={2}
                                borderRadius={2}
                                alignItems='center'
                                paddingY={2}
                                paddingX={4}
                                lineHeight='tight'
                                css={{
                                    transition: 'background .2s',
                                    ':hover': {
                                        background: colors.nearWhite
                                    }
                                }}
                            >
                                {sku.swatchImage ? (
                                    <Image
                                        size={32}
                                        borderRadius='full'
                                        alt={sku.variationValue}
                                        src={sku.swatchImage}
                                    />
                                ) : (
                                    <Box
                                        size={32}
                                        borderRadius='full'
                                        backgroundColor={`#${sku.hexShadeCode}`}
                                    />
                                )}
                                <span
                                    className='Link-target'
                                    children={`${sku.colorName} ${sku.description ? `- ${sku.description}` : ''}`}
                                />
                            </Grid>
                        </Link>
                    ))}
                </WizardBody>
            </React.Fragment>
        ) : null;
    }

    componentDidMount() {
        const { wizard = {} } = store.getState();
        const { dataArray, componentIndex } = wizard;

        const productId = wizard && dataArray && dataArray[componentIndex] && dataArray[componentIndex].productId;

        if (productId) {
            reverseLookUpApi.getProductSkuList(productId).then(data => {
                this.setState({
                    regularChildSkus: data.regularChildSkus,
                    brandName: data.brandName,
                    displayName: data.displayName
                });
            });
        }
    }

    selectSku = ({ shadeCode, hexShadeCode, skuId, description }, brandName) => {
        const labValue = `${shadeCode?.l},${shadeCode?.a},${shadeCode?.b}`;

        store.dispatch(
            wizardActions.goToNextPage(
                {
                    shadeCodeModel: shadeCode,
                    hexShadeCode,
                    description
                },
                brandName,
                skuId,
                labValue
            )
        );
    };
}

export default wrapComponent(SkuSelection, 'SkuSelection', true);
