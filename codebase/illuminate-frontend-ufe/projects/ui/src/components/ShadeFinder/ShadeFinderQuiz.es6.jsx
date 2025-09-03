/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import SwatchUtils from 'utils/Swatch';
import Wizard from 'components/Wizard';
import anaConsts from 'analytics/constants';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import processEvent from 'analytics/processEvent';
import BrandsList from 'components/ShadeFinder/BrandsList/BrandsList';
import StartScreen from 'components/ShadeFinder/StartScreen/StartScreen';
import SkuSelection from 'components/ShadeFinder/SkuSelection/SkuSelection';
import ResultsScreen from 'components/ShadeFinder/ResultsScreen/ResultsScreen';
import ProductSelection from 'components/ShadeFinder/ProductSelection/ProductSelection';

const { wrapComponent } = FrameworkUtils;
const { handleSkuOnClick } = SwatchUtils;

class ShadeFinderQuiz extends BaseClass {
    state = {
        resultsCallback: () => null
    };

    setResultsCallback = resultsCallback => {
        if (resultsCallback) {
            this.setState({ resultsCallback });
        }
    };

    render() {
        const { currentProduct, isOpen, componentName, shadeFinderTitle } = this.props;

        const world = digitalData.page.attributes.world.toLowerCase() || 'n/a';

        if (componentName) {
            const { SHADE_FINDER, SHADE_FINDER_LANDING } = anaConsts.PAGE_DETAIL;
            const { PRODUCT } = anaConsts.PAGE_TYPES;

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: `${PRODUCT}:${SHADE_FINDER_LANDING}:${world}:*`,
                    linkData: `${PRODUCT}:${SHADE_FINDER}:banner`,
                    internalCampaign: `${SHADE_FINDER}:${componentName}`,
                    pageType: PRODUCT, // eVar 93
                    pageDetail: SHADE_FINDER_LANDING // eVar 94
                }
            });
        }

        const isMultiShadeFinder = !currentProduct;

        const wizardContent = [
            <StartScreen />,
            <BrandsList />,
            <ProductSelection />,
            <SkuSelection />,
            <ResultsScreen
                currentProduct={currentProduct}
                componentName={componentName}
                handleSkuOnClick={handleSkuOnClick}
                setResultsCallback={this.setResultsCallback}
            />
        ];

        return (
            <Wizard
                isOpen={isOpen}
                componentName={componentName}
                content={wizardContent}
                resetOnClose={true}
                modalTitle={shadeFinderTitle}
                isMultiShadeFinder={isMultiShadeFinder}
                resultsCallback={this.state.resultsCallback}
            />
        );
    }
}

ShadeFinderQuiz.propTypes = {
    currentProduct: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    componentName: PropTypes.string.isRequired,
    shadeFinderTitle: PropTypes.string.isRequired
};

export default wrapComponent(ShadeFinderQuiz, 'ShadeFinderQuiz');
