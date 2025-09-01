describe('PreferredStore component', () => {
    let PreferredStore;
    let React;
    let wrapper;
    let store;
    let component;

    beforeEach(() => {
        React = require('react');
        store = require('store/Store').default;
        PreferredStore = require('components/PreferredStore/PreferredStore').default;
    });

    describe('componentDidMount', () => {
        let setAndWatchStub;

        beforeEach(() => {
            setAndWatchStub = spyOn(store, 'setAndWatch');
            wrapper = enzyme.shallow(<PreferredStore />);
            component = wrapper.instance();
        });

        it('should watch for user.nearestStore in the store', () => {
            component.componentDidMount();
            expect(setAndWatchStub).toHaveBeenCalledWith('user.preferredStoreInfo', component, jasmine.any(Function));
        });
    });
});
