import { createSelector } from 'reselect';
import get from 'lodash.get';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const createTestTargetOfferSelector = (offerName, deepObjectPath) => {
    return createSelector(testTargetOffersSelector, offers => {
        const offer = offers[offerName];

        if (!offer || !deepObjectPath) {
            return offer;
        }

        return get(offer, deepObjectPath);
    });
};

export { createTestTargetOfferSelector };
