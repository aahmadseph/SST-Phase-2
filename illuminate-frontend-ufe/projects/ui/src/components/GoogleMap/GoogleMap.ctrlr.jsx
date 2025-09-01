/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import ReactDOMServer from 'react-dom/server';
import store from 'store/Store';
import ExperienceDetailsActions from 'actions/ExperienceDetailsActions';
import scriptUtils from 'utils/LoadScripts';

import Embed from 'components/Embed/Embed';
import InfoWindow from 'components/GoogleMap/InfoWindow/InfoWindow';

class GoogleMap extends BaseClass {
    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
    }

    componentDidMount() {
        this.loadGoogleScript(() => {
            this.googleScriptLoaded = true;
            this.initializeGoogleMaps();

            store.watchAction(ExperienceDetailsActions.TYPES.SHOW_MORE_STORES_ON_MAP, data => {
                //close the open infowindow when expanding map
                if (this.markers[0].infowindow.getMap()) {
                    this.markers[0].infowindow.close();
                }

                this.updateMarkers(data.stores, this.props.showFirstMarkerInfoBox, this.props.selectedStoreId);
            });

            store.watchAction(ExperienceDetailsActions.TYPES.OPEN_INFO_WINDOW, data => {
                this.openInfoWindow(data.storeId);
            });
        });
    }

    componentWillReceiveProps(newProps) {
        const currentSelectedStore = this.props.selectedStore;
        const newSelectedStore = newProps.selectedStore;

        //if no googleScript, no current selected store, or no new selected store
        //return and don't do anything
        if (!this.googleScriptLoaded || !currentSelectedStore || !newSelectedStore) {
            return;
        }

        const resetMapCenterAndZoom = () => {
            const newCenter = new google.maps.LatLng(newSelectedStore?.latitude, newSelectedStore?.longitude);
            this.gmap.setZoom(15);
            this.gmap.panTo(newCenter);
        };

        if (newSelectedStore.storeId !== currentSelectedStore.storeId) {
            resetMapCenterAndZoom();
            // if a different store was passed -> re-render markers
            this.updateMarkers(newProps.stores, this.props.showFirstMarkerInfoBox);
        } else if (newSelectedStore.distance !== currentSelectedStore.distance) {
            // if only distance was changed in existing store -> update only infowindow
            this.updateInfoWindow(newSelectedStore);
        } else if (newProps.stores?.length !== this.props.stores?.length) {
            //close the open infowindow when expanding map
            this.markers.forEach(marker => {
                if (marker.infowindow.getMap()) {
                    marker.infowindow.close();
                }
            });

            if (this.props.isHappening && newProps.stores.length === 1) {
                resetMapCenterAndZoom();
            }

            this.updateMarkers(newProps.stores, this.props.showFirstMarkerInfoBox);
        } else if (newProps.selectedStoreId !== this.props.selectedStoreId) {
            this.updateMarkers(newProps.stores, false, newProps.selectedStoreId);
            this.openInfoWindow(newProps.selectedStoreId);
        }
    }

    loadGoogleScript = callback => {
        if (!window.google) {
            scriptUtils.loadScripts([scriptUtils.SCRIPTS.GOOGLE], callback);
        } else {
            callback();
        }
    };

    initializeGoogleMaps = () => {
        const isDesktop = Sephora.isDesktop();

        const maps = google.maps;

        const mapOptions = {
            zoom: 15,
            panControl: false,
            zoomControl: !!this.props.isZoomControlShown,
            mapTypeControl: isDesktop,
            streetViewControl: isDesktop,
            scaleControl: true,
            center: new maps.LatLng(this.props.selectedStore?.latitude, this.props.selectedStore?.longitude),
            mapTypeId: maps.MapTypeId.ROADMAP
        };

        this.gmap = new maps.Map(this.mapRef.current, mapOptions);

        let stores = this.props.stores;

        if (!stores) {
            stores = [this.props.selectedStore];
        }

        this.updateMarkers(stores, this.props.showFirstMarkerInfoBox);
    };

    updateInfoWindow = selectedStore => {
        if (this.markers && this.markers.length > 0) {
            const marker = this.markers.filter(el => el.storeId === selectedStore.storeId)[0];

            if (marker && marker.infowindow) {
                marker.infowindow.setContent(ReactDOMServer.renderToString(this.renderInfoWindow(selectedStore)));
            }
        }
    };

    updateMarkers = (stores = [], showFirstMarkerInfoBox = false, selectedStoreId) => {
        this.clearMarkers();
        const maps = google.maps;
        const infoWindowsArray = [];
        const { isHappening, markerIcons = {}, setSelectedStoreId } = this.props;

        const bounds = new maps.LatLngBounds();
        const length = stores.length;

        for (let i = 0; i < length; i++) {
            const sephoraStore = stores[i];
            const isHappeningStoreSelected = isHappening && selectedStoreId === sephoraStore.storeId;
            const happeningIconUrl = isHappeningStoreSelected ? markerIcons.solid : markerIcons.outline;

            const icon = {
                url: isHappening ? happeningIconUrl : stores.length > 1 ? '/img/ufe/locate-solid.svg' : '/img/ufe/locate.svg',
                size: new maps.Size(21, 30),
                scaledSize: new maps.Size(21, 30),
                origin: new maps.Point(0, 0),
                anchor: new maps.Point(10.5, 30),
                labelOrigin: new maps.Point(10.5, 12)
            };

            const marker = new maps.Marker({
                position: new maps.LatLng(sephoraStore?.latitude, sephoraStore?.longitude),
                map: this.gmap,
                optimized: false,
                title: 'Sephora',
                label:
                    isHappening || stores.length > 1
                        ? {
                            text: `${i + 1}`,
                            color: isHappening ? (isHappeningStoreSelected ? 'var(--color-white)' : 'var(--color-black)') : 'var(--color-white)',
                            fontFamily: 'var(--font-family-base)',
                            fontSize: '10px',
                            fontWeight: 'var(--font-weight-bold)'
                        }
                        : null,
                icon,
                storeId: sephoraStore.storeId
            });

            if (!this.props.isFindInStore) {
                const contentString = ReactDOMServer.renderToString(this.renderInfoWindow(sephoraStore));
                const infowindow = (marker.infowindow = new maps.InfoWindow({
                    content: contentString,
                    maxWidth: 220
                }));

                // open infowindow if only one store
                // extend maps bounds if more than one store
                if (i === 0 && showFirstMarkerInfoBox) {
                    infowindow.open(this.gmap, marker);
                }

                if (length > 1) {
                    bounds.extend(marker.getPosition());
                }

                maps.event.addListener(marker, 'click', function () {
                    if (isHappening) {
                        setSelectedStoreId(marker.storeId);
                    }

                    infoWindowsArray.forEach(function (infoWin) {
                        infoWin.close();
                    });
                    infowindow.open(this.gmap, marker);
                });
                infoWindowsArray.push(infowindow);
                this.markers.push(marker);
            }
        }

        //if more than one store, zoom out map so all markers appear
        if (stores.length > 1) {
            this.gmap.fitBounds(bounds);
        }
    };

    clearMarkers = () => {
        if (this.markers) {
            this.markers.forEach(marker => {
                marker.setMap(null);
            });
        }

        this.markers = [];
    };

    openInfoWindow = storeId => {
        this.markers.forEach(marker => {
            const isInfoWindowOpen = marker.infowindow.getMap();
            const isNewSelectedStore = marker.storeId === storeId;

            if (isInfoWindowOpen && !isNewSelectedStore) {
                marker.infowindow.close();
            } else if (isNewSelectedStore && !isInfoWindowOpen) {
                marker.infowindow.open(this.gmap, marker);
            }
        });
    };

    renderInfoWindow = storeParam => {
        const { isStoreLocator } = this.props;

        return (
            <InfoWindow
                storeData={storeParam}
                isStoreLocator={isStoreLocator}
            />
        );
    };

    render() {
        const { ratio, isAbsoluteFill } = this.props;

        const map = (
            <div
                css={[
                    isAbsoluteFill
                        ? {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }
                        : null,
                    {
                        '.gm-style-iw.gm-style-iw-c': {
                            maxHeight: '250px !important',
                            padding: '0 !important',
                            '.gm-style-iw-chr': {
                                '.gm-style-iw-ch': {
                                    paddingTop: '12px !important'
                                },
                                button: {
                                    display: 'flex !important',
                                    justifyContent: 'end',
                                    height: '12px !important',
                                    span: {
                                        height: '12px !important',
                                        width: '12px !important',
                                        marginTop: '5.5px !important',
                                        marginRight: '6.5px !important'
                                    }
                                }
                            }
                        },
                        '.gm-style-iw-d': {
                            paddingLeft: '12px !important',
                            paddingBottom: '12px !important',
                            paddingRight: '12px !important',
                            maxHeight: '250px !important',
                            '.Store-address': { marginTop: '8px', marginBottom: '8px' }
                        }
                    }
                ]}
                ref={this.mapRef}
            />
        );

        return isAbsoluteFill ? (
            map
        ) : (
            <Embed
                ratio={ratio || 3 / 4}
                children={map}
            />
        );
    }
}

export default wrapComponent(GoogleMap, 'GoogleMap');
