const AccessPointsUtils = require('utils/AccessPoints');

describe('AccessPoints utils', () => {
    describe('computeOperatingHours', () => {
        const operatingHours = {
            A: [
                {
                    dayType: 1,
                    openAt: '12:00:00',
                    closeAt: '16:00:00'
                },
                {
                    dayType: 2,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 3,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 4,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 5,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 6,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 7,
                    openAt: '09:00:00',
                    closeAt: '19:00:00'
                }
            ],
            B: [
                {
                    dayType: 1,
                    openAt: '08:00:00',
                    closeAt: '19:00:00'
                },
                {
                    dayType: 2,
                    openAt: '08:00:00',
                    closeAt: '19:00:00'
                },
                {
                    dayType: 3,
                    openAt: '08:00:00',
                    closeAt: '19:00:00'
                },
                {
                    dayType: 4,
                    openAt: '08:00:00',
                    closeAt: '19:00:00'
                },
                {
                    dayType: 5,
                    openAt: '08:00:00',
                    closeAt: '19:00:00'
                }
            ],
            C: [
                {
                    dayType: 1,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 2,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 3,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 4,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 5,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 7,
                    openAt: '11:00:00',
                    closeAt: '18:00:00'
                }
            ],
            D: [
                {
                    dayType: 1,
                    openAt: '12:00:00',
                    closeAt: '16:00:00'
                },
                {
                    dayType: 2,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 3,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 4,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 5,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 6,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                }
            ],
            E: [
                {
                    dayType: 1,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 2,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 3,
                    openAt: '08:00:00',
                    closeAt: '20:00:00'
                },
                {
                    dayType: 4,
                    openAt: '08:00:00',
                    closeAt: '20:00:00'
                },
                {
                    dayType: 5,
                    openAt: '07:00:00',
                    closeAt: '19:00:00'
                },
                {
                    dayType: 6,
                    openAt: '07:00:00',
                    closeAt: '19:00:00'
                }
            ],
            F: [
                {
                    dayType: 1,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 2,
                    openAt: '10:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 3,
                    openAt: '11:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 4,
                    openAt: '12:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 5,
                    openAt: '13:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 6,
                    openAt: '14:00:00',
                    closeAt: '21:00:00'
                }
            ],
            G: [
                {
                    dayType: 1,
                    openAt: '09:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 2,
                    openAt: '10:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 3,
                    openAt: '11:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 4,
                    openAt: '11:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 5,
                    openAt: '12:00:00',
                    closeAt: '21:00:00'
                },
                {
                    dayType: 6,
                    openAt: '12:00:00',
                    closeAt: '21:00:00'
                }
            ]
        };

        const expectedOutput = {
            A: [
                { label: 'Mon', value: '12:00 PM - 04:00 PM' },
                { label: 'Tue - Sat', value: '09:00 AM - 09:00 PM' },
                { label: 'Sun', value: '09:00 AM - 07:00 PM' }
            ],
            B: [
                { label: 'Mon - Fri', value: '08:00 AM - 07:00 PM' },
                { label: 'Sat', value: 'No location hours' },
                { label: 'Sun', value: 'No location hours' }
            ],
            C: [
                { label: 'Mon - Fri', value: '09:00 AM - 09:00 PM' },
                { label: 'Sat', value: 'No location hours' },
                { label: 'Sun', value: '11:00 AM - 06:00 PM' }
            ],
            D: [
                { label: 'Mon', value: '12:00 PM - 04:00 PM' },
                { label: 'Tue - Sat', value: '09:00 AM - 09:00 PM' },
                { label: 'Sun', value: 'No location hours' }
            ],
            E: [
                { label: 'Mon - Tue', value: '09:00 AM - 09:00 PM' },
                { label: 'Wed - Thu', value: '08:00 AM - 08:00 PM' },
                { label: 'Fri - Sat', value: '07:00 AM - 07:00 PM' },
                { label: 'Sun', value: 'No location hours' }
            ],
            F: [
                { label: 'Mon', value: '09:00 AM - 09:00 PM' },
                { label: 'Tue', value: '10:00 AM - 09:00 PM' },
                { label: 'Wed', value: '11:00 AM - 09:00 PM' },
                { label: 'Thu', value: '12:00 PM - 09:00 PM' },
                { label: 'Fri', value: '01:00 PM - 09:00 PM' },
                { label: 'Sat', value: '02:00 PM - 09:00 PM' },
                { label: 'Sun', value: 'No location hours' }
            ],
            G: [
                { label: 'Mon', value: '09:00 AM - 09:00 PM' },
                { label: 'Tue', value: '10:00 AM - 09:00 PM' },
                { label: 'Wed - Thu', value: '11:00 AM - 09:00 PM' },
                { label: 'Fri - Sat', value: '12:00 PM - 09:00 PM' },
                { label: 'Sun', value: 'No location hours' }
            ]
        };

        it('should return empty array when no input data is provided ', () => {
            expect(AccessPointsUtils.computeOperatingHours(undefined)).toEqual([]);
        });

        it('should return expected output A for given input', () => {
            expect(AccessPointsUtils.computeOperatingHours(operatingHours.A)).toEqual(expectedOutput.A);
        });

        it('should return expected output B for given input', () => {
            expect(AccessPointsUtils.computeOperatingHours(operatingHours.B)).toEqual(expectedOutput.B);
        });

        it('should return expected output C for given input', () => {
            expect(AccessPointsUtils.computeOperatingHours(operatingHours.C)).toEqual(expectedOutput.C);
        });

        it('should return expected output D for given input', () => {
            expect(AccessPointsUtils.computeOperatingHours(operatingHours.D)).toEqual(expectedOutput.D);
        });

        it('should return expected output E for given input', () => {
            expect(AccessPointsUtils.computeOperatingHours(operatingHours.E)).toEqual(expectedOutput.E);
        });

        it('should return expected output F for given input', () => {
            expect(AccessPointsUtils.computeOperatingHours(operatingHours.F)).toEqual(expectedOutput.F);
        });

        it('should return expected output G for given input', () => {
            expect(AccessPointsUtils.computeOperatingHours(operatingHours.G)).toEqual(expectedOutput.G);
        });
    });
});
