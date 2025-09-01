import { createSelector } from 'reselect';

import Empty from 'constants/empty';
import cookieUtils from 'utils/Cookies';
import P13nUtils from 'utils/localStorage/P13n';
import PersonalizationUtils from 'utils/Personalization';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';

const { setPersonalizationCache } = P13nUtils;
const { getPersonalizedComponent, checkDataToDisplay } = PersonalizationUtils;

const personalizationSelector = createSelector(
    p13nSelector,
    coreUserDataSelector,
    (_state, ownProps) => ownProps.personalization,
    (p13n, user, personalization) => {
        let personalizedComponent = Empty.Array;

        if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);

            if (prvCookie && p13n.data?.length > 0) {
                personalizedComponent = p13n.data.find(item => item.context === personalization?.context) || Empty.Array;
            } else if (p13n.headData?.length) {
                setPersonalizationCache(p13n.headData);
                const headItemData = p13n.headData.find(item => (item.p13n?.context || item.context) === personalization?.context);
                personalizedComponent = checkDataToDisplay(headItemData, personalization);
            } else if (user.isAnonymous) {
                personalizedComponent = Empty.Array;
            } else {
                personalizedComponent = getPersonalizedComponent(personalization, user, p13n);
            }
        }

        const isPersonalizationInitializing = personalization?.isEnabled && !p13n.isInitialized;

        return {
            personalizedComponent,
            isPersonalizationInitializing
        };
    }
);

export { personalizationSelector };
