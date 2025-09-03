import store from 'Store';
import userUtils from 'utils/User';

const TYPES = {
    EYE_COLOR: 'eyeColor',
    HAIR_COLOR: 'hairColor',
    SKIN_TYPE: 'skinType',
    SKIN_TONE: 'skinTone',
    SKIN_CONCERNS: 'skinConcerns',
    HAIR_DESCRIBE: 'hairDescribe',
    HAIR_TYPE: 'hairType',
    HAIR_CONCERNS: 'hairConcerns',
    AGE_RANGE: 'ageRange'
};

const SOURCES = {
    PROFILE: 'profile',
    ORDER_CONFIRMATION: 'orderConfirmation'
};

const BEAUTY_MATCH_FILTERS = ['hairColor', 'skinTone', 'skinType', 'eyeColor'];

const REWARD_GROUPS = {
    REWARD: 'Reward Yourself',
    CELEBRATION: 'Celebration Gift',
    BIRTHDAY: 'Birthday Gift',
    ROUGE: 'Rouge Reward'
};

const BI_LOCATIONS = { MY_POINTS: '/profile/BeautyInsider/MyPoints' };

const REWARDS_PURCHASED_GROUPS = 'rewardsPurchasedGroups';

const BiProfile = {
    TYPES: TYPES,
    SOURCES: SOURCES,
    BEAUTY_MATCH_FILTERS: BEAUTY_MATCH_FILTERS, // not used as text, used as action types
    REWARD_GROUPS, // not used as text
    BI_LOCATIONS, //analytics,
    REWARDS_PURCHASED_GROUPS,

    /**
     * Given a two sets of user trait values,
     * returns a list of traits both users have in common
     * @param {Object} userBiTraits - Object containing bi traits of logged in user.
     * @param {Object} reviewerBiTraits - Object containig bi traits of reviewer.
     * @param {Array} traitListToMatch - Array of bi traits.
     */
    getMatchingBiTraits: function (userBiTraits, reviewerBiTraits, traitListToMatch) {
        let matchedTraits;

        if (userBiTraits && reviewerBiTraits) {
            matchedTraits = traitListToMatch.filter(trait => {
                return userBiTraits[trait] === (reviewerBiTraits[trait] && reviewerBiTraits[trait].ValueLabel);
            });
        }

        return matchedTraits;
    },

    formatBeautyTraits: (userBiTraits = {}) => {
        return [
            userBiTraits[TYPES.EYE_COLOR] && userBiTraits[TYPES.EYE_COLOR].ValueLabel + ' eyes',
            userBiTraits[TYPES.HAIR_COLOR] && userBiTraits[TYPES.HAIR_COLOR].ValueLabel + ' hair',
            userBiTraits[TYPES.SKIN_TONE] && userBiTraits[TYPES.SKIN_TONE].ValueLabel + ' skin tone',
            userBiTraits[TYPES.SKIN_TYPE] && userBiTraits[TYPES.SKIN_TYPE].ValueLabel + ' skin'
        ]
            .filter(trait => !!trait)
            .join(', ');
    },

    /**
     * Checks if logged in user has bi traits
     * if user does, returns a cleaned up version of the traits
     * if user does not have any bi traits, returns undefined
     */
    getBiProfileInfo: function () {
        const user = store.getState().user;

        const userBiInfo = user && user.beautyInsiderAccount && user.beautyInsiderAccount.personalizedInformation;

        /* TODO: biPersonalInfoDisplayCleanUp should be moved to BiProfile util */
        return userBiInfo && userUtils.biPersonalInfoDisplayCleanUp(userBiInfo);
    },

    /**
     * Takes a list of bi traits and reorders them according to
     * the order of traits of biTraitsOrder
     * @param {Array} biTraits - Logged in users's bi traits.
     * @param {Array} biTraitsOrder - List of bi traits in desired order
     */
    sortBiTraits: function (biTraits, biTraitsOrder) {
        const biTraitsArray = biTraits || [];

        biTraitsArray.sort(function (a, b) {
            var p = biTraitsOrder;

            return p.indexOf(a.Id) < p.indexOf(b.Id) ? -1 : p.indexOf(a.Id) > p.indexOf(b.Id) ? 1 : 0;
        });

        return biTraitsArray;
    },

    /**
     * Check if all important traits are filled in user's BI profile
     */
    hasAllTraits: function () {
        const biInfo = this.getBiProfileInfo();

        return !!biInfo && BEAUTY_MATCH_FILTERS.every(trait => biInfo[trait]);
    },

    /** Transform data from the profile, which comes in the format:
     * {@param} {Object} savedData - an Object containing ONLY the data the user has
     * just changed. It could be as follows:
     * skinConcerns: [
     *     {
     *        displayName: "Acne",
     *        isSelected: true,
     *        value: "acne"
     *     }, {
     *         displayName: "Aging",
     *         isSelected: true,
     *         value: "aging"
     *    }
     * ]
     * {@param} {Object} wholedata - an Object containing the whole set of properties
     * related to the user profile (including the old values from the data the user
     * has just changed).
     *
     * {@returns} An object containing all data (replacing the old values with the new
     * ones the user has just changed) in the format that is needed for saving the data,
     * for instance, given the previous example:
     * skinConcerns: [ "acne", "aging" ]
     */
    completeProfileObject: function (savedData, wholeData) {
        // Get the keys from the data the user has just saved
        const savedDataKeys = Object.keys(savedData);
        // Get ALL the keys from ALL data
        const wholeDataKeys = Object.keys(wholeData);

        const personalizedInfo = [];

        // Get an array of ONLY the keys that are not being saved by the user right now
        const intactKeys = wholeDataKeys.filter(key => savedDataKeys.indexOf(key) === -1);

        for (const key of intactKeys) {
            for (const obj of wholeData[key]) {
                if (obj.isSelected) {
                    if (personalizedInfo[key]) {
                        personalizedInfo[key].push(obj.value);
                    } else {
                        personalizedInfo[key] = [obj.value];
                    }
                }
            }
        }

        // Return the "merged" object from combining the two (the one the user just saved and
        // the rest of properties)
        return Object.assign({}, savedData, personalizedInfo);
    },

    isBiDown: function () {
        const basket = store.getState().basket;

        return !basket.isBIPointsAvailable;
    },

    isBIDataAvailable: function () {
        /*
        This functions covers two ways in which BI could be turned off.
            - BIRewardsRedemption service turned off, isBIPointsAvailable is set to false
            - The whole BI service is down, user.beautyInsiderAccount is undefined.

        plus also checks if the user is anonymous and non-bi user.
        */
        const { user, basket, auth } = store.getState();
        const isAnonymous = auth?.profileStatus === userUtils.PROFILE_STATUS.ANONYMOUS;
        const isBIPointsAvailable = Boolean(basket?.isBIPointsAvailable);

        return isBIPointsAvailable && (isAnonymous || Boolean(user?.beautyInsiderAccount) || !userUtils.isBI());
    },

    getBiAccountId: function (userData) {
        const user = userData || store.getState().user;

        return user?.biAccountId || user?.beautyInsiderAccount?.biAccountId;
    }
};

export default BiProfile;
