import { site } from 'style/config';

const COMPONENT_ID = {
    BIRTHDAY: 'bi-birthday',
    CREDIT_CARD_REWARDS: 'ccr',
    YEAR_AT_A_GLANCE: 'yaag',
    REWARDS: 'rewards',
    BI_GRID: 'bi-grid',
    BI_CASH_BACK: 'bi-cash-back',
    POINTS_MULTIPLIER: 'bi_points_miltiplier',
    POINTS_FOR_DISCOUNT: 'bi-points-for-discount',
    ROUGE_REWARDS: 'rouge-rewards'
};

const CCR_STATUS = {
    REWARDSEARNED: 'CreditCard_REWARDS_EARNED',
    NOREWARDSEARNED: 'CreditCard_NO_REWARDS_EARNED',
    REWARDSREDEEMED: 'CreditCard_REWARDS_ALREADY_REDEEMED'
};

const STATUS_BAR_HEIGHT = site.headerHeight;

export {
    COMPONENT_ID, CCR_STATUS, STATUS_BAR_HEIGHT
};
