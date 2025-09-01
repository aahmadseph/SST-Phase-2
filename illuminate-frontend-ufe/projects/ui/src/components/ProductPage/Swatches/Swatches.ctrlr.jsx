import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'Store';
import { Grid, Flex } from 'components/ui';
import SwatchesDisplay from 'components/ProductPage/Swatches/SwatchesDisplay';
import SwatchDescription from 'components/ProductPage/Swatches/SwatchDescription';
import skuUtils from 'utils/Sku';
import Wizard from 'components/ProductPage/Wizard/Wizard';
import StartScreen from 'components/ShadeFinder/StartScreen/StartScreen';
import BrandsList from 'components/ShadeFinder/BrandsList/BrandsList';
import ProductSelection from 'components/ShadeFinder/ProductSelection/ProductSelection';
import SkuSelection from 'components/ShadeFinder/SkuSelection/SkuSelection';
import ResultsScreen from 'components/ShadeFinder/ResultsScreen/ResultsScreen';
import localeUtils from 'utils/LanguageLocale';
import swatchUtils from 'utils/Swatch';
import memoizeOne from 'utils/memoizeOne';

const {
    createRefinementGroups, buildSwatchGroupsAndFilters, handleSkuOnClick, CLOSEST, CLOSE
} = swatchUtils;
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/Swatches/locales', 'Swatches');

// Empty obj outside of the component is used to prevent re-rendering on defaulting
// e.g. some component prop={this.props.data || {}} will cause re-rendering because {} is always new
const EMPTY_OBJ = {};

// Use memoization to avoid setting state and cycling a render function
const memoizedBuildSwatchGroupsAndFilters = memoizeOne(buildSwatchGroupsAndFilters);
const memoizedCreateRefinementGroups = memoizeOne(createRefinementGroups);

class Swatches extends BaseClass {
    constructor(props) {
        super(props);
        this.state = { showWizard: false };

        store.setAndWatch('user.beautyInsiderAccount', this, null, store.STATE_STRATEGIES.CLIENT_SIDE_DATA);

        store.setAndWatch(
            'wizard',
            this,
            value => {
                let wizardMatchText = value.wizard.matchText || false;
                const wizardResult = value.wizard.result || false;
                const wizardCurrentPage = value.wizard.currentPage || 0;
                const isWizardOpen = value.wizard.showShadeFinderQuizModal || false;

                if (Object.entries(wizardResult).length) {
                    wizardMatchText = wizardMatchText.split(' ')[0].toLowerCase();

                    if (wizardMatchText === CLOSEST) {
                        wizardMatchText = CLOSE;
                    }
                }

                this.setState({
                    wizardResult,
                    wizardMatchText,
                    wizardCurrentPage,
                    isWizardOpen
                });
            },
            store.STATE_STRATEGIES.CLIENT_SIDE_DATA
        );
    }
    render() {
        const {
            loveIcon, isCustomSet, isSkuReady, currentProduct, colorIQMatch, isSmallView
        } = this.props;
        const { skuSelectorType } = currentProduct;

        if (!skuSelectorType) {
            return null;
        }

        const isNoneType = skuSelectorType === skuUtils.skuSwatchType.NONE;

        // Here's where react-connect would perform perfectly managing currentProduct changes
        // and firing selector + memoization
        const swatchGroupsAndFilters = memoizedBuildSwatchGroupsAndFilters(
            currentProduct ? memoizedCreateRefinementGroups(currentProduct) : EMPTY_OBJ
        );

        return (
            <>
                {isNoneType || (
                    <>
                        <p
                            id={skuUtils.ARIA_DESCRIBED_BY_IDS.COLOR_SWATCH}
                            style={{ display: 'none' }}
                        >
                            {`${getText('instructionPrefix')} ${getText('color')}`}
                        </p>
                        <p
                            id={skuUtils.ARIA_DESCRIBED_BY_IDS.SIZE_SWATCH}
                            style={{ display: 'none' }}
                        >
                            {`${getText('instructionPrefix')} ${getText('size')}`}
                        </p>
                    </>
                )}

                {isCustomSet ? null : isNoneType ? (
                    <Grid
                        columns={loveIcon && ['1fr auto', null, 1]}
                        gap={loveIcon ? [3, null, 0] : null}
                        css={{ '&:empty': { display: 'none' } }}
                    >
                        <SwatchDescription />
                        {loveIcon && isSmallView && <Flex justifyContent={'end'}>{loveIcon}</Flex>}
                    </Grid>
                ) : (
                    <Grid gap={2}>
                        <SwatchesDisplay
                            isSkuReady={isSkuReady}
                            loveIcon={loveIcon}
                            showColorMatch={false}
                            wizardResult={this.state.wizardResult}
                            wizardMatchText={this.state.wizardMatchText}
                            product={currentProduct}
                            {...swatchGroupsAndFilters}
                            colorIQMatch={colorIQMatch}
                            {...this.props}
                        />
                    </Grid>
                )}

                {currentProduct.isReverseLookupEnabled && (
                    <Wizard
                        isActive={this.state.showWizard}
                        isOpen={this.state.isWizardOpen}
                        currentPage={this.state.wizardCurrentPage}
                        content={[
                            <StartScreen />,
                            <BrandsList />,
                            <ProductSelection />,
                            <SkuSelection />,
                            <ResultsScreen
                                currentProduct={currentProduct}
                                handleSkuOnClick={handleSkuOnClick}
                            />
                        ]}
                        resetOnClose={true}
                        modalTitle={getText('shadeFinder')}
                    />
                )}
            </>
        );
    }

    shouldUpdateStateOn = ['user.beautyInsiderAccount'];
}

export default wrapComponent(Swatches, 'Swatches', true);
