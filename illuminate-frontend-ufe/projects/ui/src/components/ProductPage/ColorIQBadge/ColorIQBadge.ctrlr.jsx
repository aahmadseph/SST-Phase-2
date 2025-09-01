import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Link, Box } from 'components/ui';
import skuUtils from 'utils/Sku';
import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import Actions from 'actions/Actions';
import ProductActions from 'actions/ProductActions';
import UrlUtils from 'utils/Url';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import WizardActions from 'actions/WizardActions';
import skuHelpers from 'utils/skuHelpers';

const getText = text => localeUtils.getLocaleResourceFile('components/ProductPage/ColorIQBadge/locales', 'ColorIQBadge')(text);
const { SKU_ID_PARAM } = skuUtils;
const { showColorIQModal } = Actions;

class ColorIQBadge extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            hasShadeCodeParam: UrlUtils.getParamsByName('shade_code'),
            isColorIQ: this.props.isColorIQ
        };
    }

    render() {
        const { hasShadeCodeParam } = this.state;

        return this.state.isColorIQ ? (
            <Link
                is='span'
                display='inline'
                padding={2}
                margin={-2}
                onClick={this.colorIQMessage}
                color='blue'
            >
                {getText('colorIQ')}
            </Link>
        ) : (
            <Box
                marginRight='auto'
                paddingX='.5em'
                paddingY='.125em'
                fontSize='sm'
                lineHeight='tight'
                backgroundColor='nearWhite'
                borderRadius={2}
            >
                {getText('your')}
                {hasShadeCodeParam || (
                    <React.Fragment>
                        {' '}
                        <Link
                            is='span'
                            display='inline'
                            padding={2}
                            margin={-2}
                            onClick={this.editColorIQ}
                            color='blue'
                        >
                            {getText('colorIQMatch', false)}
                        </Link>
                    </React.Fragment>
                )}
            </Box>
        );
    }
    colorIQMessage = e => {
        this.setState({
            isColorIQ: false
        });
        this.goToColorIQMatch(e);
    };

    editColorIQ = e => {
        e.preventDefault();
        store.dispatch(
            showColorIQModal(true, () => {
                this.goToColorIQMatch(e);
            })
        );
    };

    goToColorIQMatch = e => {
        e.preventDefault();
        const colorIQMatchSku = skuHelpers.getColorIQMatchSku(this.props.product.regularChildSkus, this.props.colorIQMatch?.skuId);

        if (colorIQMatchSku) {
            store.dispatch(WizardActions.clearResult());
            store.dispatch(ProductActions.updateSkuInCurrentProduct(colorIQMatchSku));

            const queryParams = Object.assign({}, store.getState().historyLocation.queryParams);
            queryParams[SKU_ID_PARAM] = colorIQMatchSku.skuId;
            store.dispatch(historyLocationActions.goTo({ queryParams }));

            return true;
        }

        return false;
    };
}

export default wrapComponent(ColorIQBadge, 'ColorIQBadge', true);
