/* eslint-disable class-methods-use-this */
/* eslint-disable complexity */
import React from 'react';
import actions from 'Actions';
import store from 'store/Store';
import urlUtils from 'utils/Url';
import MediaUtils from 'utils/Media';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import reverseLookUpApi from 'services/api/sdn';
import LanguageLocale from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import wizardActions from 'actions/WizardActions';
import { breakpoints, buttons, space } from 'style/config';
import safelyReadProp from 'analytics/utils/safelyReadProperty';
import StickyFooter from 'components/StickyFooter/StickyFooter';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import { COLORIQ_BP_PAGE_COMPONENT_NAME, COLORIQ_SPOKE_COMPONENT_NAME } from 'constants/beautyPreferences';
import {
    Box, Flex, Text, Image, Button
} from 'components/ui';

const NO_MATCH_FOUND = 'no match';
const CLOSEST_MATCH = 'closest match';
const multiProductShadeFinderResultUrl = '/beauty/makeup-color-match';

const { Media } = MediaUtils;
const { wrapComponent } = FrameworkUtils;
const { isFrench, getLocaleResourceFile } = LanguageLocale;

class ResultsScreen extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            sku: {},
            variationValue: '',
            matchFound: null,
            shadeCode: '',
            shadeHeading: '',
            matchText: '',
            brandName: null,
            displayName: null,
            desc: '',
            hexShadeCode: ''
        };
    }

    render() {
        const {
            sku = {}, matchFound, matchText, brandName, displayName, shadeHeading, desc, hexShadeCode
        } = this.state;

        const getText = getLocaleResourceFile('components/ShadeFinder/ResultsScreen/locales', 'ResultScreen');
        const { isMultiShadeFinder, componentName } = this.props;
        const isColorIQFromBPPageOrSpoke = componentName === COLORIQ_BP_PAGE_COMPONENT_NAME || componentName === COLORIQ_SPOKE_COMPONENT_NAME;

        const action = !isColorIQFromBPPageOrSpoke && (
            <Button
                key='viewProducts'
                variant='secondary'
                width={['100%', 'auto']}
                minWidth={[null, '20em']}
                onClick={() => this.onClick(sku)}
            >
                {isMultiShadeFinder ? getText('seeAllProducts') : matchFound ? getText('selectShade') : getText('done')}
            </Button>
        );

        return (
            <Flex
                position='absolute'
                top={0}
                right={0}
                left={0}
                bottom={!isColorIQFromBPPageOrSpoke ? [space[2] * 2 + buttons.HEIGHT, 0] : 0}
                flexDirection='column'
                justifyContent={!isColorIQFromBPPageOrSpoke ? 'center' : ['flex-start', 'center']}
                alignItems='center'
                textAlign='center'
                padding={!isColorIQFromBPPageOrSpoke ? 6 : 0}
            >
                <picture
                    css={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <source
                        media={breakpoints.xsMax}
                        srcSet='/img/ufe/shade-finder/modal-bg-m.jpg'
                    />
                    <Image
                        src='/img/ufe/shade-finder/modal-bg-d.jpg'
                        size='100%'
                        css={{ objectFit: 'cover' }}
                    />
                </picture>
                <Box
                    position='absolute'
                    backgroundColor='rgba(0, 0, 0, .2)'
                    inset={0}
                />
                {matchFound !== null && (
                    <Flex
                        position='relative'
                        flexDirection='column'
                        flex={!isColorIQFromBPPageOrSpoke ? 1 : '0 0 140px'}
                        alignItems='center'
                        justifyContent='center'
                        backgroundColor='white'
                        width={!isColorIQFromBPPageOrSpoke ? '100%' : '328px'}
                        marginTop={!isColorIQFromBPPageOrSpoke ? null : ['25vh', 0]}
                        padding={!isColorIQFromBPPageOrSpoke ? 5 : `${space[4]}px ${space[4]}px ${space[6]}px`}
                        lineHeight='tight'
                        borderRadius={2}
                        boxShadow='0 2px 4px 0 rgba(0, 0, 0, 0.4)'
                    >
                        {matchFound ? (
                            <React.Fragment>
                                <Text
                                    is='p'
                                    fontSize='md'
                                    fontWeight='700'
                                    marginBottom={!isColorIQFromBPPageOrSpoke ? 5 : 4}
                                >
                                    {isMultiShadeFinder
                                        ? getText('foundMultiShade')
                                        : getText('found') + ' ' + getText(this.getFirstWordAsLabel(matchText))}
                                    !
                                </Text>
                                {brandName && displayName && !isMultiShadeFinder && (
                                    <ProductDisplayName
                                        fontSize='base'
                                        brandName={brandName}
                                        productName={displayName}
                                    />
                                )}
                                <Flex width={!isColorIQFromBPPageOrSpoke ? null : '100%'}>
                                    {!isMultiShadeFinder ? (
                                        <>
                                            <Image
                                                src={sku.smallImage}
                                                marginX='auto'
                                                marginY={5}
                                                size={!isColorIQFromBPPageOrSpoke ? 90 : 56}
                                                borderRadius='full'
                                            />
                                            <p>
                                                <strong
                                                    css={{ textTransform: 'uppercase' }}
                                                    children={getText('color')}
                                                />
                                                <br />
                                                {this.state.shadeCode}
                                            </p>
                                        </>
                                    ) : (
                                        <Box
                                            flexShrink={!isColorIQFromBPPageOrSpoke ? null : 0}
                                            size={!isColorIQFromBPPageOrSpoke ? 90 : 56}
                                            borderRadius='full'
                                            backgroundColor={`#${hexShadeCode}`}
                                        />
                                    )}
                                    {shadeHeading.length > 0 ? (
                                        <p
                                            style={
                                                !isColorIQFromBPPageOrSpoke
                                                    ? null
                                                    : {
                                                        marginLeft: space[3],
                                                        alignSelf: 'center',
                                                        textAlign: 'left'
                                                    }
                                            }
                                        >
                                            <strong children={shadeHeading} />
                                            <br />
                                            <span children={`${desc ? `${desc}` : ''}`} />
                                        </p>
                                    ) : null}
                                </Flex>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Text
                                    is='p'
                                    fontSize='md'
                                    fontWeight='bold'
                                >
                                    {getText('sorry')}
                                </Text>
                                <Image
                                    marginX='auto'
                                    marginY={5}
                                    display='block'
                                    src='/img/ufe/no-result.svg'
                                    size={90}
                                />
                                <Text
                                    is='p'
                                    marginBottom={4}
                                >
                                    {getText('reviewShades')}
                                </Text>
                                {brandName && displayName && (
                                    <ProductDisplayName
                                        fontSize='base'
                                        brandName={brandName}
                                        productName={displayName}
                                    />
                                )}
                            </React.Fragment>
                        )}
                        {!isColorIQFromBPPageOrSpoke && (
                            <Media greaterThan='xs'>
                                <Box marginTop={6}>{action}</Box>
                            </Media>
                        )}
                        {!isColorIQFromBPPageOrSpoke && (
                            <Media at='xs'>
                                <StickyFooter accountForBottomNav={false}>{action}</StickyFooter>
                            </Media>
                        )}
                    </Flex>
                )}
            </Flex>
        );
    }

    processAnalytics = (matchType, brandName, skuId, shopWorld) => {
        if (matchType === CLOSEST_MATCH) {
            // eslint-disable-next-line no-param-reassign
            matchType = 'close match';
        }

        const pageNamePrefix = `${anaConsts.PAGE_TYPES.PRODUCT}:${anaConsts.PAGE_DETAIL.SHADE_FINDER}-`;
        const world = (safelyReadProp('digitalData.product.0.attributes.world') || 'n/a').toLowerCase();
        const internalCampaign = `${anaConsts.PAGE_DETAIL.SHADE_FINDER}:${anaConsts.PAGE_DETAIL.BEAUTY_PREFERENCES}`;
        const pageName = `${pageNamePrefix}${matchType}:${shopWorld || world}:*`.toLowerCase();

        const recentEvent = anaUtils.getLastAsyncPageLoadData();

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                internalCampaign,
                pageName,
                world,
                pageType: 'product',
                previousPageName: recentEvent.pageName,
                pageDetail: `${anaConsts.PAGE_DETAIL.SHADE_FINDER}-${matchType}`,
                brandName: brandName.toLowerCase(),
                skuId,
                linkData: `${pageNamePrefix}${matchType}:banner`
            }
        });
    };

    // Return first word of match text from API in order to use it as a label
    getFirstWordAsLabel = matchText => {
        return matchText.toLowerCase().split(' ')[0];
    };

    componentDidMount() {
        const { currentProduct = {}, isMultiShadeFinder, setResultsCallback } = this.props;
        const productDetails = currentProduct.productDetails;
        const { wizard = {} } = store.getState();

        const languageOpt = isFrench() ? 'fr' : 'en';

        const { dataArray = [], componentIndex } = wizard;

        const { shadeCodeModel: shadeCode, hexShadeCode, description } = wizard && dataArray && dataArray[componentIndex];

        this.setState({
            desc: description ? description.charAt(0).toUpperCase() + description.slice(1) : ''
        });

        setResultsCallback(this.setResrultsCb);

        if (productDetails?.productId && shadeCode) {
            reverseLookUpApi.getProductIdLab(productDetails.productId, shadeCode).then(data => {
                const matchType = data.match.toLowerCase();
                let skuId = 'n/a';
                let brandName;

                if (matchType !== NO_MATCH_FOUND) {
                    reverseLookUpApi
                        .getReverseLookUpSkuDetails(data.skuId)
                        .then(skuData => {
                            const { primaryProduct, labCode } = skuData;
                            const displayName = primaryProduct ? primaryProduct.displayName : productDetails.displayName;
                            brandName = primaryProduct?.brand ? primaryProduct.brand.displayName : productDetails.brand.displayName;

                            skuId = data.skuId || 'n/a';
                            this.setState({
                                shadeCode: `${skuData.skuName} ${skuData.variationDesc ? `- ${skuData.variationDesc}` : ''}`,
                                matchText: data.match,
                                sku: skuData,
                                matchFound: matchType !== NO_MATCH_FOUND,
                                brandName,
                                displayName
                            });
                            this.processAnalytics(matchType, brandName, skuId);
                            store.dispatch(wizardActions.setResult({ labCode }));
                        })
                        .catch(() => {
                            brandName = productDetails.brand.displayName;

                            this.setState({
                                matchText: NO_MATCH_FOUND,
                                sku: {},
                                matchFound: false,
                                brandName,
                                displayName: productDetails.displayName
                            });
                            this.processAnalytics(matchType, brandName, skuId);
                        });
                } else {
                    brandName = productDetails.brand.displayName;

                    this.setState({
                        matchText: data.match,
                        sku: {},
                        matchFound: matchType !== NO_MATCH_FOUND,
                        brandName,
                        displayName: productDetails.displayName
                    });

                    this.processAnalytics(matchType, brandName, skuId);
                }
            });
        } else if (isMultiShadeFinder && shadeCode) {
            const { brandName, skuId } = store.getState().wizard;
            const labTone = `${shadeCode['l']}:${shadeCode['a']}:${shadeCode['b']}`;

            reverseLookUpApi
                .getLABCodeDescription(labTone)
                .then(({ depth, intensity, undertone }) => {
                    this.setState({
                        shadeCode,
                        hexShadeCode: hexShadeCode,
                        matchFound: true,
                        shadeHeading: `${depth[languageOpt]} • ${undertone[languageOpt]} • ${intensity[languageOpt]}`
                    });
                    const shopWorld = digitalData.page.attributes.world || 'n/a';
                    this.processAnalytics('match found', brandName, skuId, shopWorld);
                    store.dispatch(wizardActions.saveColorIQ(this.state.hexShadeCode, this.state.shadeHeading, this.state.desc));

                    if (skuId) {
                        reverseLookUpApi
                            .getReverseLookUpSkuDetails(skuId)
                            .then(({ labCode }) => {
                                store.dispatch(wizardActions.setResult({ labCode }));
                            })
                            .catch(() => {});
                    }
                })
                .catch(() => []);
        }
    }

    setResrultsCb = () => this.onClick(this.state.sku);

    onClick = data => {
        const { isMultiShadeFinder } = this.props;

        store.dispatch(
            wizardActions.setResult({
                result: data,
                matchText: this.state.matchText
            })
        );

        // We need this in order to not send an empty object as sku.
        if (Object.keys(data).length > 0) {
            this.props.handleSkuOnClick(data);
        }

        store.dispatch(actions.showWizard(false));
        store.dispatch(wizardActions.changeCurrentPage(0));
        store.dispatch(wizardActions.clearDataItem());

        if (isMultiShadeFinder) {
            const { l, a, b } = this.state.shadeCode;
            const world = digitalData.page.attributes.world.toLowerCase() || 'n/a';

            anaUtils.setNextPageData({
                world: 'n/a',
                linkData: 'shade finder:view products',
                pageName: `${anaConsts.PAGE_TYPES.PRODUCT}:${anaConsts.PAGE_NAMES.SHADE_FINDER_MATCH_FOUND}:${world}:*`, // this is going to be c6
                previousPageName: `${anaConsts.PAGE_NAMES.SHADE_FINDER_RESULTS}`
            });

            urlUtils.redirectTo(`${multiProductShadeFinderResultUrl}?l=${l}&a=${a}&b=${b}`);
        }
    };
}

export default wrapComponent(ResultsScreen, 'ResultsScreen', true);
