/* eslint-disable complexity */
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import Empty from 'constants/empty';
import { constructorVsMLSelector } from 'viewModel/selectors/testTarget/constructorVsMLSelector';
import { bestSellersMLSelector } from 'selectors/sephoraML/bestSellersMLSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import ConstructorRecsSelector from 'selectors/constructorRecs/constructorRecsSelector';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import SephoraMLActions from 'actions/SephoraMLActions';
import ConstructorRecsActions from 'actions/ConstructorRecsActions';
import { ML_VS_CONSTRUCTOR } from 'constants/TestTarget';
import { NEW_CONTENT_PAGE_ID } from 'constants/constructorConstants';

const { wrapHOC } = FrameworkUtils;
const { constructorRecsSelector } = ConstructorRecsSelector;
const { updateRequestData } = ConstructorRecsActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { getBestSellersRecs } = SephoraMLActions;
const getText = getLocaleResourceFile('components/Content/ContentLayout/LayoutProductGrid/locales', 'LayoutProductGrid');

const withLayoutProductGridProps = wrapHOC(
    connect(
        createSelector(
            coreUserDataSelector,
            constructorRecsSelector,
            createStructuredSelector({
                showMore: getTextFromResource(getText, 'showMore'),
                breadcrumb: getTextFromResource(getText, 'breadcrumb'),
                viewing: getTextFromResource(getText, 'viewing'),
                results: getTextFromResource(getText, 'results')
            }),
            constructorVsMLSelector,
            bestSellersMLSelector,
            (_state, ownProps) => ownProps.content,
            (user, constructorRecs, localization, constructorMLExperience, bestSellersML, content) => {
                const podId = content?.ctorPodId || '';

                let recs = null;
                let layoutExperience = '';
                const isNewContentPage = content?.sid?.includes(NEW_CONTENT_PAGE_ID);
                const {
                    isError = true,
                    isEmpty = true,
                    constructorRecommendations = null,
                    totalResults = null,
                    resultId = null
                } = constructorRecs[podId] || Empty.Object;

                if (constructorMLExperience === ML_VS_CONSTRUCTOR.ML && bestSellersML.fetchFailed === false) {
                    layoutExperience = constructorMLExperience;
                    recs = bestSellersML.items;
                } else {
                    layoutExperience = ML_VS_CONSTRUCTOR.CONSTRUCTOR;

                    if (isError || isEmpty) {
                        recs = content?.skuList || Empty.Array;
                    } else {
                        recs = constructorRecommendations;
                    }
                }

                return {
                    user,
                    localization,
                    layoutExperience,
                    recs,
                    podId,
                    isNewContentPage,
                    isLoading: recs === null || constructorRecs[podId]?.isLoading,
                    bestSellersMLFailed: bestSellersML.fetchFailed === true,
                    totalResults,
                    resultId
                };
            }
        ),
        {
            getBestSellersRecs,
            updateRequestData
        }
    )
);

export { withLayoutProductGridProps };
