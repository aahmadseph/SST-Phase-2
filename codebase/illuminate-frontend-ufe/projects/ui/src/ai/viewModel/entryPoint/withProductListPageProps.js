/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { pageSelector } from 'selectors/page/pageSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import superChatActions from 'ai/actions/superChatActions';
import { superChatSelector } from 'ai/selectors/superChatSelector';
import sdnApi from 'ai/services/sdn';
import { getGENAIAnonymousId } from 'ai/utils/sessionStorage';
import PageTemplateType from 'constants/PageTemplateType';
import { ENTRYPOINTS } from 'ai/constants/superchat';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/EntryPoint/locales', 'AIChat');

const { entryPointPrompts } = sdnApi;

const localization = createStructuredSelector({
    new: getTextFromResource(getText, 'new'),
    aiChatInputPlaceholderPlp: getTextFromResource(getText, 'aiChatInputPlaceholderPlp'),
    aiChatInputPlaceholderPlpLgUi: getTextFromResource(getText, 'aiChatInputPlaceholderPlpLgUi')
});

const functions = (dispatch, _ownProps) => ({
    fetchEntryPointPromptsPlp: async (nthCategory, searchKeyword, clientId, anonymousId) => {
        const { categories } = nthCategory || {};
        const categoryId = categories?.[0]?.categoryId || '';
        const isSearchPage = Sephora.template === PageTemplateType.Search;
        const page = isSearchPage ? ENTRYPOINTS.SRP : ENTRYPOINTS.PLP;
        const searchTerm = isSearchPage ? searchKeyword : '';

        return entryPointPrompts({
            categoryId,
            searchTerm,
            page,
            clientId,
            anonymousId
        }).then(data => data);
    },
    handlePromptClick: (prompts, nthCategory, products, selectedPrompt = null) => {
        const { categories } = nthCategory || {};
        const categoryId = categories?.[0]?.categoryId || '';

        const data = {
            entrypoint: ENTRYPOINTS.PLP,
            category_id: categoryId,
            products: products
                ?.filter(product => product.currentSku)
                ?.slice(0, 30)
                .map(product => ({
                    product_id: product.productId,
                    sku_id: product.currentSku.skuId
                })),
            selectedPrompt
        };
        dispatch(superChatActions.showSuperChat(true, prompts, data));
    }
});

const fields = createSelector(
    localization,
    coreUserDataSelector,
    pageSelector,
    superChatSelector,
    (_state, ownProps) => ownProps.giftFinder,
    (locales, user, page, superChat, giftFinder) => {
        const clientId = user?.biId;
        let anonymousId = undefined;

        if (!Sephora.isNodeRender) {
            anonymousId = getGENAIAnonymousId();
        }

        let chatName = superChat?.config?.meta?.try_chat_name || '';

        if (giftFinder) {
            chatName = superChat?.config?.meta?.try_gift_chat_name || '';
        }

        return {
            localization: locales,
            products: page?.nthCategory?.skuList || [],
            chatName: chatName,
            searchKeyword: page?.search?.keyword,
            nthCategory: page?.nthCategory || {},
            clientId,
            anonymousId
        };
    }
);

const withProductListPageProps = wrapHOC(connect(fields, functions));

export {
    withProductListPageProps, fields, functions
};
