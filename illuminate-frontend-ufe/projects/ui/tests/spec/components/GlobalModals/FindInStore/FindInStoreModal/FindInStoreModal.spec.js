/* eslint-disable object-curly-newline */
const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const store = require('store/Store').default;
const actions = require('Actions').default;
const localeUtils = require('utils/LanguageLocale').default;
const snbApi = require('services/api/search-n-browse').default;
const FindInStoreModal = require('components/GlobalModals/FindInStore/FindInStoreModal/FindInStoreModal').default;

describe('FindInStoreModal component', () => {
    let component;
    let event;

    beforeEach(() => {
        spyOn(store, 'dispatch');
        spyOn(snbApi, 'findInStore');
        spyOn(localeUtils, 'isCanada');
        spyOn(actions, 'showFindInStoreModal');
        spyOn(actions, 'showFindInStoreMapModal');
        event = {
            target: {
                value: 'somevalue'
            },
            preventDefault: createSpy('preventDefault')
        };
    });

    describe('Request Close Method', () => {
        const componentProps = {
            currentProduct: {
                currentSku: {
                    skuId: 'somesku'
                }
            }
        };
        it('should dispatch an action on store', () => {
            shallow(<FindInStoreModal {...componentProps} />)
                .instance()
                .requestClose();
            expect(store.dispatch).toHaveBeenCalledTimes(1);
        });

        it('should should dispatch action for closing find in store modal', () => {
            shallow(<FindInStoreModal {...componentProps} />)
                .instance()
                .requestClose();
            expect(actions.showFindInStoreModal).toHaveBeenCalledTimes(1);
            expect(actions.showFindInStoreModal).toHaveBeenCalledWith(false);
        });
    });

    describe('handleDistanceSelect Method', () => {
        beforeEach(() => {
            const componentProps = {
                currentProduct: {
                    currentSku: {
                        skuId: 'somesku'
                    }
                }
            };
            const wrapper = shallow(<FindInStoreModal {...componentProps} />);
            component = wrapper.instance();
            spyOn(component, 'setState');
        });

        it('should set state', () => {
            component.handleDistanceSelect(event);
            expect(component.setState).toHaveBeenCalledTimes(1);
        });

        it('should set state with somevalue', () => {
            component.handleDistanceSelect(event);
            expect(component.setState).toHaveBeenCalledWith({ searchedDistance: 'somevalue' });
        });
    });

    xdescribe('handleSubmit Method', () => {
        beforeEach(() => {
            const wrapper = shallow(<FindInStoreModal />);
            component = wrapper.instance();
            spyOn(component, 'setState');
            spyOn(component, 'fetchStores');
            spyOn(component, 'fireAnalytics');
        });

        it('should not call fetchStores method', () => {
            component.storeZipCode = {
                validateError: () => {
                    return true;
                }
            };
            component.handleSubmit(event);
            expect(component.fetchStores).not.toHaveBeenCalled();
        });

        it('should call fetchStores method', () => {
            component.storeZipCode = {
                validateError: () => {
                    return false;
                }
            };
            component.handleSubmit(event);
            expect(component.fetchStores).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleSubmit Method', () => {
        beforeEach(() => {
            const componentProps = {
                currentProduct: {
                    currentSku: {
                        skuId: 'somesku'
                    }
                }
            };
            const wrapper = shallow(<FindInStoreModal {...componentProps} />);
            component = wrapper.instance();
            spyOn(component, 'setState');
            component.storeZipCode = { getValue: () => 'somevalue' };
            component.state = { searchedDistance: '10' };
            snbApi.findInStore.and.returnValue(Promise.resolve());
        });

        xit('should call findInStore api', () => {
            component.fetchStores();
            expect(snbApi.findInStore).toHaveBeenCalledTimes(1);
        });

        xit('should call findInStore api with params', () => {
            component.fetchStores();
            expect(snbApi.findInStore).toHaveBeenCalledWith('somesku', {
                zipCode: 'somevalue',
                radius: 10,
                country: 'US'
            });
        });
    });

    describe('showMap Method', () => {
        let props;

        beforeEach(() => {
            const componentProps = {
                currentProduct: {
                    currentSku: {
                        skuId: 'somesku'
                    }
                }
            };
            const wrapper = shallow(<FindInStoreModal {...componentProps} />);
            component = wrapper.instance();
            props = {
                product: 'productId',
                selectedStore: 'storeId',
                zipCode: '94105',
                searchedDistance: '10',
                storesToShow: {}
            };
            component.showMap(props);
        });

        it('should close the findInStoreModal', () => {
            expect(actions.showFindInStoreModal).toHaveBeenCalledTimes(1);
        });

        it('should close the findInStoreModal with param', () => {
            expect(actions.showFindInStoreModal).toHaveBeenCalledWith(false);
        });

        it('should show the findInStoreMapModal', () => {
            expect(actions.showFindInStoreMapModal).toHaveBeenCalledTimes(1);
        });

        it('should show the findInStoreMapModal with params', () => {
            expect(actions.showFindInStoreMapModal).toHaveBeenCalledWith({
                isOpen: true,
                currentProduct: props,
                selectedStore: undefined,
                zipCode: undefined,
                searchedDistance: undefined,
                storesToShow: undefined,
                useBackToStoreLink: true
            });
        });
    });

    describe('shouldShowMoreStores Method', () => {
        beforeEach(() => {
            const componentProps = {
                currentProduct: {
                    currentSku: {
                        skuId: 'somesku'
                    }
                }
            };
            const wrapper = shallow(<FindInStoreModal {...componentProps} />);
            component = wrapper.instance();
            component.state = { currentPage: 2 };
        });

        it('should return true for showMoreStores function', () => {
            component.totalStores = 20;
            expect(component.shouldShowMoreStores()).toBeTruthy();
        });

        it('should return false for showMoreStores function', () => {
            component.totalStores = 6;
            expect(component.shouldShowMoreStores()).toBeFalsy();
        });
    });

    describe('showMoreStores Method', () => {
        beforeEach(() => {
            const componentProps = {
                currentProduct: {
                    currentSku: {
                        skuId: 'somesku'
                    }
                }
            };
            component = shallow(<FindInStoreModal {...componentProps} />).instance();
            component.state = { currentPage: 2 };
            spyOn(component, 'getCurrentPageStores').and.returnValue('somestores');
            spyOn(component, 'setState');
            component.showMoreStores();
        });

        it('should call setState method', () => {
            expect(component.setState).toHaveBeenCalledTimes(1);
        });

        it('should call setState method with params', () => {
            expect(component.setState).toHaveBeenCalledWith({
                currentPage: 3,
                storesToShow: 'somestores'
            });
        });
    });

    describe('getCurrentPageStores Method', () => {
        beforeEach(() => {
            const componentProps = {
                currentProduct: {
                    currentSku: {
                        skuId: 'somesku'
                    }
                }
            };
            component = shallow(<FindInStoreModal {...componentProps} />).instance();
            component.storeList = ['Store1', 'Store2', 'Store3', 'Store4', 'Store5', 'Store6'];
        });

        it('should return first 5 stores', () => {
            expect(component.getCurrentPageStores(1)).toEqual(['Store1', 'Store2', 'Store3', 'Store4', 'Store5']);
        });
    });
});
