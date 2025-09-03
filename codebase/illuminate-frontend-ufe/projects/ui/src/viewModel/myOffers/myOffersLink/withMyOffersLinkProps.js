import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import beautyInsiderActions from 'actions/BeautyInsiderActions';
import P13nUtils from 'utils/localStorage/P13n';
import PersonalizationUtils from 'utils/Personalization';
import cookieUtils from 'utils/Cookies';
import Empty from 'constants/empty';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import PersonalizationActions from 'actions/PersonalizationActions';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import store from 'store/Store';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const { getPersonalizedComponent } = PersonalizationUtils;
const { setPersonalizationPlaceholder, filteredCache } = P13nUtils;
const { wrapHOC } = FrameworkUtils;

const callbackPersonalizedComponents = personalization => {
    store.dispatch(beautyInsiderActions.updateBIPersonalizedOffers(personalization));
};

const fields = createSelector(
    p13nSelector,
    coreUserDataSelector,
    (_state, ownProps) => ownProps,
    (p13n, coreUserData, ownProps) => {
        let { personalization } = ownProps;
        let personalizedComponent = Empty.Array;

        if (!personalization) {
            const biOffers = Storage.local.getItem(LOCAL_STORAGE.BI_OFFERS);
            personalization = biOffers?.personalization;
        }

        const filteredItem = filteredCache(personalization);

        if (filteredItem && !coreUserData.isAnonymous) {
            setPersonalizationPlaceholder(personalization.context);
            store.dispatch(PersonalizationActions.getPersonalizedComponents(personalization, coreUserData, callbackPersonalizedComponents));
        }

        if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);

            if (prvCookie && p13n.data?.length > 0) {
                personalizedComponent = p13n.data.find(item => item.context === personalization?.context) || Empty.Array;
            } else if (coreUserData.isAnonymous) {
                personalizedComponent = Empty.Array;
            } else {
                personalizedComponent = getPersonalizedComponent(personalization, coreUserData, p13n);
            }
        }

        return {
            offersForYou: personalizedComponent?.variationData?.items?.length || 0
        };
    }
);

const functions = null;

const withMyOffersLinkProps = wrapHOC(connect(fields, functions));

export {
    withMyOffersLinkProps, fields, functions
};
