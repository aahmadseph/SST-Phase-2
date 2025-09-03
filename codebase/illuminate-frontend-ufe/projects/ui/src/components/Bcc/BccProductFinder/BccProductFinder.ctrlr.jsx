import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Location from 'utils/Location';
import BCC from 'utils/BCC';
import { site } from 'style/config';
import { Box, Flex, Image } from 'components/ui';
import ProductFinderGrid from 'components/ProductFinderGrid/ProductFinderGrid';
import BccBase from 'components/Bcc/BccBase/BccBase';
import ErrorMsg from 'components/ErrorMsg';
import Actions from 'Actions';
import store from 'Store';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import BccModalOpenEvents from 'analytics/bindings/pages/all/bccModalOpenEvent';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';

// I18n
import localeUtils from 'utils/LanguageLocale';

const { showProductFinderModal } = Actions;
const isMobile = Sephora.isMobile();
const MAX_PRODUCTS = 20;

const getTotalQuizResults = (quizResults, skuGroups, maxProducts) => (skuGroups.length ? skuGroups : quizResults.slice(0, maxProducts));

class BccProductFinder extends BaseClass {
    setInitialState = () => {
        const persistedQuizResults = BCC.retrieveQuizResults();
        const quizName = BCC.getQuizName(Location.getLocation().pathname);

        if (persistedQuizResults && persistedQuizResults.quizName === quizName) {
            return { ...persistedQuizResults };
        }

        BCC.removeQuizResults();

        return {
            isQuizSubmitted: false,
            quizResults: [],
            skuGroups: [],
            quizName,
            externalRecommendations: null
        };
    };

    state = { ...this.setInitialState() };

    openProductFinderModal = () => {
        store.dispatch(showProductFinderModal(true, this.props));

        /*Product Finder Quiz Start analytics */
        const anaProdFinderValue = `productfinder:start-quiz:${this.props.name}`;
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                bindingMethods: [BccModalOpenEvents],
                pageDetail: 'start-quiz',
                actionInfo: anaProdFinderValue,
                bccComponentName: anaProdFinderValue,
                pageName: anaProdFinderValue,
                previousPage: digitalData.page.attributes.sephoraPageInfo.pageName
            }
        });
    };

    getResultsContent = quizResults => {
        let comp;

        if (this.props.componentList && this.props.componentList.length) {
            comp = <BccComponentList items={this.props.componentList} />;
        } else {
            comp = <ProductFinderGrid products={quizResults} />;
        }

        return comp;
    };

    componentDidMount() {
        //overwrite digitalData values when BccProductFinder is on page
        //so that page load call has correct data
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.PRODUCT_FINDER;
        digitalData.page.pageInfo.pageName = this.props.name;
        digitalData.page.attributes.world = '';
        digitalData.page.attributes.additionalPageInfo = 'quiz';
    }

    componentDidUpdate(_, prevState) {
        const { quizResults, skuGroups } = this.state;
        const totalQuizResults = getTotalQuizResults(quizResults, skuGroups, MAX_PRODUCTS);

        if (totalQuizResults.length) {
            const quizState = {
                ...this.state,
                externalRecommendations: prevState.externalRecommendations || window.digitalData.page.attributes.externalRecommendations
            };
            BCC.persistQuizResults(quizState);
        }
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccProductFinder/locales', 'BccProductFinder');

        const { quizResults, skuGroups } = this.state;
        const totalQuizResults = getTotalQuizResults(quizResults, skuGroups, MAX_PRODUCTS);

        const flushMargin = isMobile && this.props.isContained && '-container';

        return (
            <BccBase {...this.props}>
                {this.state.isQuizSubmitted && (
                    <React.Fragment>
                        <Flex
                            key='resultsImageWrapper'
                            justifyContent='center'
                            marginX={flushMargin}
                            marginBottom={isMobile ? 4 : 6}
                        >
                            <Box onClick={this.openProductFinderModal}>
                                <Image
                                    display='block'
                                    src={this.props.resultsImagePath}
                                    alt={this.props.resultImageAltText}
                                />
                            </Box>
                        </Flex>
                        <div
                            css={
                                isMobile || {
                                    marginLeft: site.MAIN_INDENT
                                }
                            }
                        >
                            {totalQuizResults.length ? (
                                this.getResultsContent(totalQuizResults)
                            ) : (
                                <ErrorMsg textAlign={isMobile && 'center'}>{getText('sorrySomethingWrong')}</ErrorMsg>
                            )}
                        </div>
                        <Box
                            marginTop={isMobile ? 4 : 6}
                            key='bottomImageWrapper'
                            marginX={flushMargin}
                        >
                            <Image
                                display='block'
                                marginX='auto'
                                alt={this.props.resultBottomImageAltText}
                                src={this.props.bottomImagePath}
                            />
                        </Box>
                    </React.Fragment>
                )}
                {this.state.isQuizSubmitted || (
                    <Flex
                        justifyContent='center'
                        key='launchImageWrapper'
                        marginX={flushMargin}
                    >
                        <Box onClick={this.openProductFinderModal}>
                            <Image
                                display='block'
                                src={this.props.launchImagePath}
                                alt={this.props.launchImageAltText}
                            />
                        </Box>
                    </Flex>
                )}
            </BccBase>
        );
    }
}

export default wrapComponent(BccProductFinder, 'BccProductFinder', true);
