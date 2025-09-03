export default function getResource(label, vars = []) {
    const resources = {
        changeStore: 'Change Store',
        viewDetails: 'View details',
        myReservation: 'My Reservations',
        beautyFAQ: 'Beauty Service FAQs',
        getDirections: 'Get directions',
        findASephora: 'Find a Sephora',
        happeningAtSephora: 'Happening at Sephora',
        viewAll: 'View all',
        openUntil: `Open until ${vars[0]}`,
        closed: 'Closed',
        noStoreNear: `We were not able to find a store near “${vars[0]}”.`,
        useStore: 'Use This Store',
        chooseThisStore: 'Choose This Store',
        chooseYourStore: 'Choose Your Store',
        chooseStore: 'Choose a Store',
        setYourLocation: 'Set Your Location',
        pickupAndDelivery: 'Pickup & Delivery',
        pickupInStore: 'Pick Up In Store',
        pickupNotOffered: 'Pickup not offered',
        showResults: 'Show Results',
        cancel: 'Cancel',
        confirm: 'Confirm',
        reservationNotOffered: 'Reservation not offered',
        milesAway: ' miles away',
        kmAway: ' kilometers away',
        done: 'Done',
        ok: 'OK',
        changeStoreMessage: 'The pickup location will be updated to',
        changeStoreMessage2: 'for all pickup items',
        anyPromosRewardsMsg:
            'Any promos or rewards in your pickup basket will also be removed. You may add promos and rewards in store, if available.',
        changeItemQtyMsg: 'Quantity will be updated to 1 for all pickup items.',
        changeItemQtyMsgHeader: 'Buy Online and Pickup items are limited to 1 per item at Kohl’s locations.',
        changeItemQtyMsgHeaderMoreThanOne: 'Your pickup basket will be updated.',
        goTo: 'Go to ',
        kohlsCopy: ' or visit a store to purchase. Sephora promotions and rewards may not apply at Kohl\'s stores.'
    };

    return resources[label];
}
