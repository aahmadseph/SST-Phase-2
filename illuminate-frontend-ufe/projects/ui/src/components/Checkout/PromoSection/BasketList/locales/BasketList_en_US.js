export default function getResource(label, vars = []) {
    const resources = {
        //BasketList
        itemsInBasketMessage: `Get It Shipped (${vars[0]})`,
        emptyBasketMessage: 'Your basket is currently empty.',
        shopNewArrivals: 'Shop New Arrivals',
        pleaseSignIn: `Please ${vars[0]} if you are trying to retrieve a basket created in the past.`,
        signInText: 'sign in',
        emptyRopisBasketTitle: 'Empty Basket',
        emptyRopisBasket: 'Your Reserve & Pick Up basket is empty. You will be taken to your online order basket',
        ok: 'OK',
        gotIt: 'Got it',
        undo: 'Undo',
        itemMoved: 'Item Moved',
        gotIt2: 'Got It',
        emptyBasket: 'Empty Basket',
        emptyPickupBasket: 'Your Buy Online & Pick Up basket is empty. You will be taken to your Get It Shipped basket.',
        emptyDcBasket: 'Your Get It Shipped basket is empty. You will be taken to your Buy Online & Pick Up basket.',
        emptyStandardBasketMessage: 'You have no items for standard delivery.',
        rougeMemberFreeSameDayDeliveryMessage: 'As a Rouge member, you can try Free Same-Day Delivery!',
        rougeMemberFreeSameDayDeliveryBoxTitle: 'Want your items today?',
        rougeMemberFreeSameDayDeliveryBoxText: 'Rouge members can also try Free Same-Day Delivery! Check availability by tapping the "Change Method" button.',
        rougeMemberFreeSameDayDeliveryBoxTextEmptyBasket: 'Rouge members can also try Free Same-Day Delivery! Check availability by selecting "Same-Day Delivery" on the product page.',
        sddRougeTestV2MessageEmptyBasket: `Rouge members can also try Free Same-Day Delivery on $${vars[0]}+ orders! Check availability by selecting "Same-Day Delivery" on the product page.`,
        sddRougeTestV2MessageStandard: `Rouge members can also try Free Same-Day Delivery on $${vars[0]}+ orders! Check availability by tapping the "Change Method" button.`,
        sddRougeTestV2Message: `As a Rouge member, get FREE Same-Day Delivery by adding ${vars[0]}.`,
        sddRougeTestV2FreeShippingMessage: 'As a Rouge member, you\’re getting FREE Same-Day Delivery.',

        //BasketListItem
        shippingRestrictionPopoverText: 'Due to shipping regulations, this item and the rest of your order must ship ground (2-8 days total delivery time). This includes expedited orders.',
        shippingRestrictions: 'Shipping Restrictions',
        rewardCardText: 'Rouge Reward is valid on *a future transaction only*, it *expires in 90 days*, and it will be sent via email within *24 hours*.',
        remove: 'Remove',
        moveToLoves: 'Move to Loves',
        loved: 'Loved',
        outOfStock: 'Out of Stock',
        outOfStockAtStore: 'Out of Stock at Selected Store',
        soldOut: 'Sold Out',
        changeMethod: 'Change Method',
        getItSooner: 'Get It Sooner',
        free: 'FREE',
        sephoraSubscription: 'Sephora Subscription'
    };

    return resources[label];
}
