describe('Gis', () => {
    let Gis;

    beforeEach(() => {
        Gis = require('utils/Gis').default;
    });

    describe('getDistance', () => {
        const sanFranciscoLatLon = {
            lat: 37.773972,
            lon: -122.431297
        };

        const walnutCreekLatLon = {
            lat: 37.910076,
            lon: -122.065186
        };

        const trueDistances = {
            mi: 22,
            km: 36
        };

        it('should return distance in miles', () => {
            const distance = Gis.getDistance(sanFranciscoLatLon.lat, sanFranciscoLatLon.lon, walnutCreekLatLon.lat, walnutCreekLatLon.lon, {
                units: 'mi'
            });
            expect(Math.round(distance)).toEqual(trueDistances.mi);
        });

        it('should return distance in km', () => {
            const distance = Gis.getDistance(sanFranciscoLatLon.lat, sanFranciscoLatLon.lon, walnutCreekLatLon.lat, walnutCreekLatLon.lon, {
                units: 'km'
            });
            expect(Math.round(distance)).toEqual(trueDistances.km);
        });

        it('should not return distance if exceeds threshold', () => {
            const distance = Gis.getDistance(sanFranciscoLatLon.lat, sanFranciscoLatLon.lon, walnutCreekLatLon.lat, walnutCreekLatLon.lon, {
                threshold: trueDistances.mi - 1
            });
            expect(distance).toEqual(null);
        });

        it('should return distance if does not exceed threshold', () => {
            const distance = Gis.getDistance(sanFranciscoLatLon.lat, sanFranciscoLatLon.lon, walnutCreekLatLon.lat, walnutCreekLatLon.lon, {
                threshold: trueDistances.mi + 1
            });
            expect(Math.round(distance)).toEqual(trueDistances.mi);
        });
    });
});
