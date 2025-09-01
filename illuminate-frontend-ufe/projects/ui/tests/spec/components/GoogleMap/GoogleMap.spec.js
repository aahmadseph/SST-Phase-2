/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any, createSpy } = jasmine;

describe('GoogleMap component', () => {
    let component;
    let GoogleMap;
    let watchAction;
    beforeEach(() => {
        GoogleMap = require('components/GoogleMap/GoogleMap').default;
    });

    describe('componentDidMount', () => {
        let store;
        let watchActionStub;
        let ExperienceDetailsActions;
        let initializeGoogleMapsStub;
        let updateMarkersStub;
        let openInfoWindowStub;
        let loadGoogleScriptStub;
        let wrapper;

        beforeEach(() => {
            store = require('store/Store').default;
            watchAction = store.watchAction;
            watchActionStub = spyOn(store, 'watchAction');

            ExperienceDetailsActions = require('actions/ExperienceDetailsActions').default;
            wrapper = shallow(<GoogleMap />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            initializeGoogleMapsStub = spyOn(component, 'initializeGoogleMaps');
            updateMarkersStub = spyOn(component, 'updateMarkers');
            openInfoWindowStub = spyOn(component, 'openInfoWindow');
            loadGoogleScriptStub = spyOn(component, 'loadGoogleScript');
            component.markers = [
                {
                    infowindow: {
                        getMap: createSpy(),
                        close: createSpy()
                    }
                }
            ];
            component.componentDidMount();
            loadGoogleScriptStub.calls.argsFor(0)[0]();
        });

        it('should call initializeGoogleMaps once', () => {
            expect(initializeGoogleMapsStub).toHaveBeenCalledTimes(1);
        });

        it('should call watchAction for showing more stores on map', () => {
            // Arrange
            store.watchAction = watchAction;
            watchActionStub = spyOn(store, 'watchAction');

            wrapper = shallow(<GoogleMap />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            initializeGoogleMapsStub = spyOn(component, 'initializeGoogleMaps');
            updateMarkersStub = spyOn(component, 'updateMarkers');
            openInfoWindowStub = spyOn(component, 'openInfoWindow');
            loadGoogleScriptStub = spyOn(component, 'loadGoogleScript');
            component.markers = [
                {
                    infowindow: {
                        getMap: createSpy(),
                        close: createSpy()
                    }
                }
            ];
            component.componentDidMount();
            loadGoogleScriptStub.calls.argsFor(0)[0]();

            // Assert
            expect(watchActionStub).toHaveBeenCalledWith(ExperienceDetailsActions.TYPES.SHOW_MORE_STORES_ON_MAP, any(Function));
        });

        it('should call expandMapDisplay if action for showing more stores called', () => {
            watchActionStub.calls.argsFor(0)[1]({ stores: ['store1', 'store2'] });
            expect(updateMarkersStub.calls.mostRecent().args[0]).toEqual(['store1', 'store2']);
        });

        it('should call updateMakers preserving the summary info box showing prop', () => {
            const showFirstMarkerInfoBox = true;
            wrapper.setProps({ showFirstMarkerInfoBox: showFirstMarkerInfoBox });
            watchActionStub.calls.argsFor(0)[1]({ stores: ['store1', 'store2'] });
            expect(updateMarkersStub.calls.mostRecent().args[1]).toEqual(showFirstMarkerInfoBox);
        });

        it('should watchAction for opeining new info window', () => {
            // Arrange
            store.watchAction = watchAction;
            watchActionStub = spyOn(store, 'watchAction');

            wrapper = shallow(<GoogleMap />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            initializeGoogleMapsStub = spyOn(component, 'initializeGoogleMaps');
            updateMarkersStub = spyOn(component, 'updateMarkers');
            openInfoWindowStub = spyOn(component, 'openInfoWindow');
            loadGoogleScriptStub = spyOn(component, 'loadGoogleScript');
            component.markers = [
                {
                    infowindow: {
                        getMap: createSpy(),
                        close: createSpy()
                    }
                }
            ];
            component.componentDidMount();
            loadGoogleScriptStub.calls.argsFor(0)[0]();

            // Assert
            expect(watchActionStub).toHaveBeenCalledWith(ExperienceDetailsActions.TYPES.OPEN_INFO_WINDOW, any(Function));
        });

        it('should open new info window if action is called', () => {
            watchActionStub.calls.argsFor(1)[1]({ storeId: 'storeId' });
            expect(openInfoWindowStub).toHaveBeenCalledWith('storeId');
        });
    });

    describe('updateMarkers', () => {
        //let SizeStub;
        //let ScaledSizeStub;
        let LatLngStub;
        let boundsStub;
        let markerStub;
        let storesStub;
        let renderInfoWindowStub;
        let InfowWindowStub;

        beforeEach(() => {
            window.google = {
                maps: {
                    Size: createSpy(),
                    ScaledSize: createSpy(),
                    Point: createSpy(),
                    LatLngBounds: createSpy().and.returnValue({
                        extend: createSpy()
                    }),
                    Marker: createSpy().and.returnValue({
                        getPosition: createSpy()
                    }),
                    LatLng: createSpy().and.returnValue('POSITION'),
                    InfoWindow: createSpy().and.returnValue({
                        open: createSpy(),
                        close: createSpy()
                    }),
                    event: {
                        addListener: createSpy('addListener')
                    }
                }
            };

            //SizeStub = new window.google.maps.Size();
            //ScaledSizeStub = new window.google.maps.ScaledSize();
            LatLngStub = new window.google.maps.LatLng();
            markerStub = new window.google.maps.Marker();
            InfowWindowStub = new window.google.maps.InfoWindow();
            boundsStub = new window.google.maps.LatLngBounds();

            const wrapper = shallow(<GoogleMap />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            renderInfoWindowStub = spyOn(component, 'renderInfoWindow');
            component.gmap = {
                fitBounds: createSpy()
            };

            const happeningProps = {
                isHappening: false,
                markerIcons: {
                    outline: '',
                    solid: ''
                }
            };

            wrapper.setProps(happeningProps);
        });

        describe('for only one store', () => {
            beforeEach(() => {
                storesStub = [
                    {
                        storeId: '0001',
                        displayName: 'store1',
                        latitude: 'lat',
                        longitude: 'long'
                    }
                ];

                component.updateMarkers(storesStub, true);
            });

            it('should generate marker for google map', () => {
                expect(window.google.maps.Marker).toHaveBeenCalledWith({
                    position: LatLngStub,
                    map: component.gmap,
                    optimized: false,
                    title: 'Sephora',
                    label: null,
                    icon: any(Object),
                    storeId: '0001'
                });
            });

            it('should call renderInfoWindow for store', () => {
                expect(renderInfoWindowStub).toHaveBeenCalledWith(storesStub[0]);
            });

            it('should call infowwindow.open', () => {
                expect(InfowWindowStub.open).toHaveBeenCalledTimes(1);
                expect(InfowWindowStub.open).toHaveBeenCalledWith(component.gmap, markerStub);
            });

            it('should not update bounds for map', () => {
                expect(boundsStub.extend).not.toHaveBeenCalled();
            });

            it('should not call gmap.fitBounds', () => {
                expect(component.gmap.fitBounds).not.toHaveBeenCalled();
            });

            it('should addListener for marker click', () => {
                expect(window.google.maps.event.addListener).toHaveBeenCalledWith(markerStub, 'click', any(Function));
            });

            it('should close marker and open a marker', () => {
                window.google.maps.event.addListener.calls.argsFor(0)[2]();
                expect(InfowWindowStub.close).toHaveBeenCalledTimes(1);
                expect(InfowWindowStub.open).toHaveBeenCalledTimes(2);
            });
        });

        describe('for multiple store', () => {
            beforeEach(() => {
                storesStub = [
                    {
                        storeId: '0001',
                        displayName: 'store1',
                        latitude: 'lat',
                        longitude: 'long'
                    },
                    {
                        storeId: '0002',
                        displayName: 'store2',
                        latitude: 'lat',
                        longitude: 'long'
                    }
                ];

                component.updateMarkers(storesStub, false);
            });

            it('should generate marker for google map', () => {
                expect(window.google.maps.Marker).toHaveBeenCalledWith({
                    position: LatLngStub,
                    map: component.gmap,
                    optimized: false,
                    title: 'Sephora',
                    label: {
                        text: '1',
                        color: 'var(--color-white)',
                        fontFamily: 'var(--font-family-base)',
                        fontSize: '10px',
                        fontWeight: 'var(--font-weight-bold)'
                    },
                    icon: any(Object),
                    storeId: '0001'
                });
            });

            it('should call renderInfowWindow for stores', () => {
                expect(renderInfoWindowStub).toHaveBeenCalledWith(storesStub[0]);
                expect(renderInfoWindowStub).toHaveBeenCalledWith(storesStub[1]);
            });

            it('should update bounds for map', () => {
                expect(boundsStub.extend).toHaveBeenCalledTimes(2);
                expect(boundsStub.extend).toHaveBeenCalledWith(markerStub.getPosition());
            });

            it('should not call infowwindow.open', () => {
                expect(InfowWindowStub.open).not.toHaveBeenCalled();
            });

            it('should call gmap.fitBounds', () => {
                expect(component.gmap.fitBounds).toHaveBeenCalledTimes(1);
            });

            it('should addListener for marker click', () => {
                expect(window.google.maps.event.addListener).toHaveBeenCalledWith(markerStub, 'click', any(Function));
            });

            it('should close markers and open marker clicked', () => {
                window.google.maps.event.addListener.calls.argsFor(0)[2]();
                expect(InfowWindowStub.close).toHaveBeenCalledTimes(2);
                expect(InfowWindowStub.open).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('openInfoWindow', () => {
        let openMarker;
        let marker;

        beforeEach(() => {
            openMarker = {
                infowindow: {
                    getMap: createSpy().and.returnValue(true),
                    close: createSpy(),
                    open: createSpy()
                },
                storeId: '0001',
                storeName: 'openStore'
            };

            marker = {
                infowindow: {
                    getMap: createSpy(),
                    close: createSpy(),
                    open: createSpy()
                },
                storeId: '0002',
                storeName: 'closedStore'
            };

            const wrapper = shallow(<GoogleMap />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.markers = [openMarker, marker];
            component.gmap = { gmap: 'gmapData' };
        });

        describe('when store to open is already shown', () => {
            beforeEach(() => {
                component.openInfoWindow('0001');
            });

            it('should not call infowindow.close', () => {
                expect(openMarker.infowindow.close).not.toHaveBeenCalled();
            });

            it('should not call infowindow.open', () => {
                expect(marker.infowindow.open).not.toHaveBeenCalled();
            });
        });

        describe('when store to open is not showing', () => {
            beforeEach(() => {
                component.openInfoWindow('0002');
            });

            it('should call infowindow.close once', () => {
                expect(openMarker.infowindow.close).toHaveBeenCalledTimes(1);
            });

            it('should call infowindow.open with gmap and marker', () => {
                expect(marker.infowindow.open).toHaveBeenCalledWith(component.gmap, marker);
            });
        });
    });

    describe('componentWillReceiveProps', () => {
        let props;
        let newProps;
        let newCenterStub;
        let updateMarkersStub;

        beforeEach(() => {
            props = {
                selectedStore: {
                    storeId: '123',
                    latitude: 'lat',
                    longitude: 'long',
                    distance: 1
                }
            };

            newProps = {
                selectedStore: {
                    storeId: '456',
                    latitude: 'newlat',
                    longitude: 'newlong',
                    distance: 2
                },
                stores: 'storeList'
            };
            const wrapper = shallow(<GoogleMap {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.googleScriptLoaded = true;
        });

        describe('if store has been changed', () => {
            beforeEach(() => {
                window.google = {
                    maps: {
                        LatLng: createSpy().and.returnValue('NEWCENTER')
                    }
                };
                newCenterStub = new window.google.maps.LatLng();
                component.gmap = {
                    setZoom: createSpy(),
                    panTo: createSpy()
                };
                updateMarkersStub = spyOn(component, 'updateMarkers');
                component.componentWillReceiveProps(newProps);
            });

            it('should call gmap.setZoom with 15', () => {
                expect(component.gmap.setZoom).toHaveBeenCalledWith(15);
            });

            it('should call gmap.panTo to newCenter', () => {
                expect(component.gmap.panTo).toHaveBeenCalledWith(newCenterStub);
            });

            it('should call updateMarkers with new location markers', () => {
                expect(updateMarkersStub.calls.mostRecent().args[0]).toEqual(newProps.stores);
            });
        });

        it('if distance has been changed should call updateInfoWindow', () => {
            // Arrange
            const updateInfoWindow = spyOn(component, 'updateInfoWindow');
            newProps.selectedStore.storeId = props.selectedStore.storeId;

            // Act
            component.componentWillReceiveProps(newProps);

            // Assert
            expect(updateInfoWindow).toHaveBeenCalledWith(newProps.selectedStore);
        });
    });

    describe('updateInfoWindow', () => {
        let renderInfoWindowStub;
        let storeStub;
        beforeEach(() => {
            storeStub = {
                storeId: '456',
                latitude: 'newlat',
                longitude: 'newlong',
                distance: 2
            };
            const wrapper = shallow(<GoogleMap />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            renderInfoWindowStub = spyOn(component, 'renderInfoWindow');
            component.markers = [
                {
                    storeId: '123',
                    infowindow: { setContent: createSpy() }
                },
                {
                    storeId: '456',
                    infowindow: { setContent: createSpy() }
                }
            ];
        });

        it('should call renderInfoWindow if store is found', () => {
            component.updateInfoWindow(storeStub);
            expect(renderInfoWindowStub).toHaveBeenCalledWith(storeStub);
        });

        it('should not call renderInfoWindow if store is not found', () => {
            const newStoreStub = Object.assign({}, storeStub, { storeId: '789' });
            component.updateInfoWindow(newStoreStub);
            expect(renderInfoWindowStub).not.toHaveBeenCalled();
        });
    });
});
