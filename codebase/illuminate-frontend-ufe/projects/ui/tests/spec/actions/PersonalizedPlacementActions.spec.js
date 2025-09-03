import PersonalizedPlacementActions from 'actions/PersonalizedPlacementActions';
import personalizedPreviewPlacementsApi from 'services/api/personalizedPreviewPlacements';
import decorators from 'utils/decorators';

describe('Personalized Placement Actions', () => {
    describe('set P13N Variations', () => {
        it('should set p13n variations', () => {
            const payload = {
                contextId: 'variationId'
            };
            const action = {
                type: 'SET_P13N_VARIATIONS',
                payload
            };
            expect(PersonalizedPlacementActions.setP13NVariations(payload)).toEqual(action);
        });
    });

    describe('set Active Variation', () => {
        it('should set active variation', () => {
            const payload = {
                contextId: 'variationId'
            };
            const action = {
                type: 'SET_ACTIVE_P13N_VARIATION',
                payload
            };
            expect(PersonalizedPlacementActions.setActiveVariation(payload)).toEqual(action);
        });
    });

    describe('set sid data', () => {
        it('should set sid data', () => {
            const payload = 'sid_of_component';
            const action = {
                type: 'SET_SID_DATA',
                payload
            };
            expect(PersonalizedPlacementActions.setSidData(payload)).toEqual(action);
        });
    });

    describe('set personalized variations', () => {
        const dispatch = jasmine.createSpy('dispatch');
        it('should dispatch set p13n variations with fetched data on successfull API call', async () => {
            spyOn(decorators, 'withInterstice').and.callFake(arg => arg);
            const resolvesPromise = Promise.resolve({ data: '123' });
            spyOn(personalizedPreviewPlacementsApi, 'getVariations').and.returnValue(resolvesPromise);
            PersonalizedPlacementActions.setPersonalizedVariations(
                123,
                123
            )(dispatch).then(() => {
                expect(dispatch).toHaveBeenCalledTimes(1);
            });
        });
    });
});
