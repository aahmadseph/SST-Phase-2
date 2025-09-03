import userUtils from 'utils/User';
import skuHelpers from 'utils/skuHelpers';
import basketUtils from 'utils/Basket';
import skuUtils from 'utils/Sku';
import store from 'store/Store';

const isRougeExclusiveEnabled = Boolean(Sephora.configurationSettings.isRougeExclusiveEnabled);
const isRougeCashFlagEnabled = Boolean(Sephora.configurationSettings.isRougeCashFlagEnabled);
const isRougeFlaginBasketEnabled = Boolean(Sephora.configurationSettings.isRougeFlaginBasketEnabled);
const POINTS_THRESHOLD = 1000;
const APPLIED_VALUE = 20;

const isRougeExclusive = () => {
    return isRougeExclusiveEnabled && userUtils.isRouge();
};

const isRougeExclusiveForBasket = () => {
    return isRougeExclusive() && isRougeFlaginBasketEnabled;
};

const isRougeCashFlag = () => {
    return isRougeCashFlagEnabled && userUtils.isRouge();
};

const isRougeCashFlagForBasket = () => {
    return isRougeFlaginBasketEnabled && isRougeCashFlag();
};

const renderRougeExclusiveBadge = points => {
    return (
        (checkRougeFlagDisplayEligibility(points) && !basketUtils.isCBRPromoAppliedInBasket()) ||
        (isRougeCashFlagForBasket() && isAppliedEqualAppliedValue())
    );
};

const isAppliedEqualAppliedValue = () => {
    return basketUtils.isCBRPromoAppliedInBasket() && basketUtils.getCBRPromoAppliedValueInBasket() === APPLIED_VALUE;
};

const checkRougeFlagDisplayEligibility = points => {
    return isRougeCashFlagForBasket() && points >= POINTS_THRESHOLD;
};

const updateRougeExclusiveSkus = skus => {
    const { basket } = store.getState();

    if (!skus || !basket) {
        return skus;
    }

    const { netBeautyBankPointsAvailable } = basket;
    const newSkus = skus.map(s => {
        const isInBasket = skuHelpers.isInBasket(s.skuId, basket);

        s.isInBasket = isInBasket;
        s.rewardPoints = s.rewardPoints || skuUtils.getBiPoints(s);

        const isEligible = !isInBasket && netBeautyBankPointsAvailable >= s.rewardPoints && !s.isOutOfStock;

        s.isEligible = isEligible;

        return s;
    });

    return newSkus;
};

const updateRougeExclusiveBiRewardGroups = (biRewardGroups, basket) => {
    if (!biRewardGroups || !basket) {
        return biRewardGroups;
    }

    Object.entries(biRewardGroups).forEach(([key, value]) => {
        biRewardGroups[key] = updateRougeExclusiveSkus(value, basket);
    });

    return biRewardGroups;
};

export default {
    isRougeExclusiveEnabled,
    isRougeCashFlagEnabled,
    isRougeExclusive,
    updateRougeExclusiveSkus,
    updateRougeExclusiveBiRewardGroups,
    isRougeExclusiveForBasket,
    renderRougeExclusiveBadge,
    isAppliedEqualAppliedValue
};
