export default function getResource(label, vars = []) {
    const resources = {
        pickUpInStore: 'Pick Up In Store',
        chooseThisStore: 'Choose This Store',
        notAbleToFind: `We were not able to find a store near “${vars[0]}”.`,
        differentLocation: 'Please try a different location.',
        ok: 'OK',
        changeStoreTitle: 'Change Store',
        changeStoreMessage: 'The pickup location will be updated to',
        changeStoreMessage2: 'for all pickup items',
        anyPromosRewardsMsg:
            'Any promos or rewards in your pickup basket will also be removed. You may add promos and rewards in store, if available.',
        changeItemQtyMsg: 'Quantity will be updated to 1 for all pickup items.'
    };

    return resources[label];
}
