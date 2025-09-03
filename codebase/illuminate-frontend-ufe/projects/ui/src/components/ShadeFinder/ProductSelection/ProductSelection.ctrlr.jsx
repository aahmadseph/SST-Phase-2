import React from 'react';
import BCC from 'utils/BCC';
import store from 'store/Store';
import urlUtils from 'utils/Url';
import Helpers from 'utils/Helpers';
import { Grid } from 'components/ui';
import FrameworkUtils from 'utils/framework';
import reverseLookUpApi from 'services/api/sdn';
import LanguageLocale from 'utils/LanguageLocale';
import wizardActions from 'actions/WizardActions';
import WizardBody from 'components/Wizard/WizardBody';
import BaseClass from 'components/BaseClass/BaseClass';
import ProductItem from 'components/Product/ProductItem';
import WizardSubhead from 'components/Wizard/WizardSubhead';

const { IMAGE_SIZES } = BCC;
const { getProp } = Helpers;
const { wrapComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocale;

class ProductSelection extends BaseClass {
    state = { productList: {} };

    componentDidMount() {
        const { wizard = {} } = store.getState();
        const { dataArray, componentIndex } = wizard;
        const brandId = dataArray[componentIndex].brandId;

        if (brandId) {
            reverseLookUpApi.getProductList(brandId).then(data => {
                this.setState({ productList: data.products });
            });
        }
    }

    selectProduct = productId => {
        store.dispatch(wizardActions.goToNextPage({ productId }));
    };

    render() {
        const { productList } = this.state;
        const getText = getLocaleResourceFile('components/ShadeFinder/ProductSelection/locales', 'ProductSelection');

        return productList && productList.length > 0 ? (
            <React.Fragment>
                <WizardSubhead>
                    {getText('selectProduct')}
                    <br />
                    <strong children={productList[0].brandName} />
                </WizardSubhead>
                <WizardBody>
                    <Grid
                        gap={5}
                        columns={[2, 4]}
                    >
                        {productList.map(product => (
                            <ProductItem
                                key={product.productId}
                                skuId={product.skuId || getProp(product, 'defaultSku.skuId')}
                                productName={product.displayName}
                                brandName={product.brandName}
                                imageSrc={product.isCompetitive ? urlUtils.convertUrlToHTTPS(product.defaultSku.heroImage) : null}
                                skuImages={{ image135: product.image135 }}
                                productId={product.productId}
                                imageSize={IMAGE_SIZES[135]}
                                showQuickLook={false}
                                showMoreColors={false}
                                onClick={() => this.selectProduct(product.productId)}
                            />
                        ))}
                    </Grid>
                </WizardBody>
            </React.Fragment>
        ) : null;
    }
}

export default wrapComponent(ProductSelection, 'ProductSelection');
