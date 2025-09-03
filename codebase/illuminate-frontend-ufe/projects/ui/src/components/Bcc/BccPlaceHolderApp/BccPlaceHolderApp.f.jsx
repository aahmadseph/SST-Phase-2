import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import BCCUtils from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';
import CustomerServiceChat from 'components/CustomerServiceChat/CustomerServiceChat';
import GiftCards from 'components/GiftCards/GiftCards';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import ChatEntry from 'components/Content/CustomerService/ChatWithUs/ChatEntry';
import { CHAT_ENTRY } from 'constants/chat';
import MultiProductShadeFinderResults from 'components/ShadeFinder/ResultsScreen/MultiProductShadeFinderResults';
import TextAlertsLogin from 'components/TextAlertsLogin';

const { PLACEHOLDER_APPS } = BCCUtils;

const BccPlaceHolderApp = ({ placeHolderType, enablePageRenderTracking = false }) => {
    const getText = localeUtils.getLocaleResourceFile('components/Bcc/BccPlaceHolderApp/locales', 'BccPlaceHolderApp');
    let comp;

    /**
     * Basically a bcc controlled component for producers to use to render custom
     * components on various Content or Brand Pages, on the H@S home page, etc. From placeHolderApp
     * producers can pass custom data via the dynamicAttributes. You can see how this is working for
     * the featured activity carousel on the StoreHub.jsx page file.
     *
     * Based on placeHolderType defined within bcc component we will render specific UFE comp.
     * Current place holders include: Gift Card Lookup, The Activity Carousels on H@S,
     * Customer Service Chat, and PowerFront Chat.
     *
     * https://jira.sephora.com/wiki/display/ILLUMINATE/Components#Components-BCCPlaceholderApp
     */

    switch (placeHolderType) {
        case PLACEHOLDER_APPS.FIXEDLIVECHAT:
            comp = <CustomerServiceChat isFixed={true} />;

            break;

        case PLACEHOLDER_APPS.DYNAMICLIVECHAT:
            comp = <CustomerServiceChat />;

            break;

        case PLACEHOLDER_APPS.GIFTCARDLOOKUP:
            comp = <GiftCards hasTitle={false} />;

            break;

        case PLACEHOLDER_APPS.CUSTOMER_SERVICE_CHAT:
            comp = <ChatEntry type={CHAT_ENTRY.bccPlaceHolderApp} />;

            break;

        case PLACEHOLDER_APPS.MULTIPRODUCT_SHADEFINDER_RESULTS:
            comp = <MultiProductShadeFinderResults />;

            break;

        case PLACEHOLDER_APPS.SMS_PHONE_SUBSCRIBER:
            comp = <TextAlertsLogin />;

            break;

        default:
            comp = <div>{getText('componentNotFound')}</div>;

            break;
    }

    return (
        <div>
            {comp}
            {enablePageRenderTracking && <PageRenderReport />}
        </div>
    );
};

export default wrapFunctionalComponent(BccPlaceHolderApp, 'BccPlaceHolderApp');
