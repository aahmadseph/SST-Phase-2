import { fields, functions } from 'components/FrictionlessCheckout/BopisSection/PickupInfoCard';
import Actions from 'Actions';
import mockState from '__mocks__/pageData/productPage/cream-lip-stain-liquid-lipstick-P281411_DeliveryOptions.json';

describe('ViewModel for PickupInfoCard component', () => {
    let state;

    beforeEach(async () => {
        // Create a deep copy - don't use JSON.parse(JSON.stringify( as it's 2 times slower
        state = window.structuredClone(mockState);
    });

    test('should provide all required fields', () => {
        // Arrange
        const requiredFields = {
            localization: {
                addAltPickupPerson: 'Add an alternate pickup person',
                altPickupPerson: 'Alternate Pickup Person',
                confirmationDetails: 'Please have your <b>confirmation email</b> or <b>photo ID</b> ready when you pick up your order.',
                curbsidePickup: 'Curbside pickup',
                edit: 'Edit',
                gotIt: 'Got it',
                inStorePickup: 'In-store pickup',
                modalMessage:
                    'The store will hold your items for 5 days after you place your order. We’ll notify you via email when your order is ready for pickup, usually within 2 hours.',
                pickupCardTitle: 'Pickup Info',
                pickupPerson: 'Pickup Person',
                pickupStore: 'Pickup Store',
                usuallyReady: 'Usually ready in 2 hours',
                information: 'information',
                forThisOrderText: 'for this order',
                pickupConfirmationDetails: 'Pickup confirmation details',
                itemsToBePickedUp: 'Items to be picked up'
            },
            pickupDetails: undefined,
            sectionLevelError: undefined
        };

        // Act
        const data = fields(state);

        // Assert
        expect(data).toStrictEqual(requiredFields);
    });

    test('should provide all required functions', () => {
        // Arrange
        const requiredFields = {
            showInfoModal: Actions.showInfoModal,
            showAlternatePickupPersonModal: Actions.showAlternatePickupPersonModal
        };

        // Act
        // When "functions" field defined as an object test doesn't require any actions in "Act" block

        // Assert
        expect(Object.keys(functions)).toEqual(Object.keys(requiredFields));
        expect(functions.showInfoModal.name).toBe(requiredFields.showInfoModal.name);
        expect(functions.showAlternatePickupPersonModal.name).toBe(requiredFields.showAlternatePickupPersonModal.name);
    });
});
