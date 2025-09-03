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

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/EntryPoint/locales', 'AIChat');

const { entryPointPrompts } = sdnApi;

const PAGE = 'PDP';
const localization = createStructuredSelector({
    new: getTextFromResource(getText, 'new'),
    aiChatInputPlaceholderPdp: getTextFromResource(getText, 'aiChatInputPlaceholderPdp')
});

const functions = (dispatch, _ownProps) => ({
    fetchEntryPointPromptsPdp: async (product, clientId, anonymousId) => {
        const { currentSku, productDetails, parentCategory } = product || {};
        const { skuId } = currentSku;
        const { productId } = productDetails;
        const { categoryId } = parentCategory;

        return entryPointPrompts({
            productId,
            skuId,
            categoryId,
            page: PAGE,
            clientId,
            anonymousId
        }).then(data => data);
    },
    handlePromptClick: (prompts, product, selectedPrompt = null) => {
        const { productId, currentSku } = product;

        const data = {
            entrypoint: 'PDP',
            products: [
                {
                    product_id: productId,
                    sku_id: currentSku.skuId
                }
            ],
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
            product: page?.product || {},
            chatName: chatName,
            clientId,
            anonymousId
        };
    }
);

const withProductPageProps = wrapHOC(connect(fields, functions));

export {
    withProductPageProps, fields, functions
};
