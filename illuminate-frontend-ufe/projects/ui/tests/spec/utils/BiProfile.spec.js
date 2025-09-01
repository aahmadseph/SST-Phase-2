describe('BiProfile utils', () => {
    const BiProfile = require('utils/BiProfile').default;
    const store = require('Store').default;
    const userUtils = require('utils/User').default;

    let storeGetStateStub;

    const userWithNoBiInfo = { user: {} };
    // eslint-disable-next-line prefer-const
    let data;
    const userWithBiInfo = {
        user: {
            beautyInsiderAccount: {
                personalizedInformation: {
                    eyeColor: [
                        {
                            value: 'blue',
                            displayName: 'Blue'
                        },
                        {
                            value: 'brown',
                            displayName: 'Brown',
                            isSelected: true
                        },
                        {
                            value: 'green',
                            displayName: 'Green'
                        },
                        {
                            value: 'grey',
                            displayName: 'Grey'
                        },
                        {
                            value: 'hazel',
                            displayName: 'Hazel'
                        }
                    ]
                }
            }
        }
    };

    const userBiInfo = { eyeColor: 'Brown' };

    const savedData = {
        hairColor: ['gray'],
        hairDescrible: ['coarseHr', 'dryHr', 'oilyHr', 'wavy'],
        hairConcerns: ['antiAging', 'damaged']
    };

    let userBiInfoEmpty;

    beforeEach(() => {
        storeGetStateStub = spyOn(store, 'getState');
    });

    describe('getBiProfileInfo', () => {
        it('should return cleaned up version of bi profile data', () => {
            storeGetStateStub.and.returnValue(userWithBiInfo);

            expect(BiProfile.getBiProfileInfo()).toEqual({ eyeColor: 'Brown' });
        });

        it('should return undefined if user does not have bi profile data', () => {
            storeGetStateStub.and.returnValue(userWithNoBiInfo);
            expect(BiProfile.getBiProfileInfo()).not.toBeDefined();
        });
    });

    describe('BI User has all traits', () => {
        let getBiProfileInfoStub;
        let profileInfo;

        beforeEach(() => {
            getBiProfileInfoStub = spyOn(BiProfile, 'getBiProfileInfo');
        });

        it('should get all the traits from users BI profile', () => {
            BiProfile.hasAllTraits();
            expect(getBiProfileInfoStub).toHaveBeenCalled();
        });

        it('should return false if user is not BI', () => {
            profileInfo = null;
            getBiProfileInfoStub.and.returnValue(profileInfo);
            expect(BiProfile.hasAllTraits()).toEqual(false);
        });

        it('should return false if user is BI but no traits specified yet', () => {
            profileInfo = {};
            getBiProfileInfoStub.and.returnValue(profileInfo);
            expect(BiProfile.hasAllTraits()).toEqual(false);
        });

        it('should return false if some traits are specified but not all of them', () => {
            profileInfo = {
                hairColor: 'Blonde',
                skinTone: 'Light',
                skinType: 'Oily',
                hairDescrible: 'Dry',
                hairConcerns: 'Curl Enhancing, Damaged, Dandruff'
            };
            getBiProfileInfoStub.and.returnValue(profileInfo);
            expect(BiProfile.hasAllTraits()).toEqual(false);
        });

        it('should return true if all 4 traits (hairColor, eyeColor, skinTone, skinType) specified', () => {
            profileInfo = {
                hairColor: 'Blonde',
                eyeColor: 'Green',
                skinTone: 'Light',
                skinType: 'Oily'
            };
            getBiProfileInfoStub.and.returnValue(profileInfo);
            expect(BiProfile.hasAllTraits()).toEqual(true);
        });
    });

    describe('getMatchingBiTraits', () => {
        it('given two lists of bi trait values, return the list of bi traits that match', () => {
            const usersTraitList = {
                eyeColor: {
                    DimensionLabel: 'Eye Color',
                    Id: 'eyeColor',
                    Value: 'brown',
                    ValueLabel: 'Brown'
                }
            };

            const traitListToMatch = ['eyeColor'];

            expect(BiProfile.getMatchingBiTraits(userBiInfo, usersTraitList, traitListToMatch)).toEqual(['eyeColor']);
        });

        it('given two lists of bi trait values, return empty array if no traits match', () => {
            const usersTraitList = {
                eyeColor: {
                    DimensionLabel: 'Eye Color',
                    Id: 'eyeColor',
                    Value: 'Green',
                    ValueLabel: 'Green'
                }
            };

            const traitListToMatch = ['eyeColor'];

            expect(BiProfile.getMatchingBiTraits(userBiInfo, usersTraitList, traitListToMatch).length).toBe(0);
        });

        it('if user does not have bi data, should return undefined', () => {
            const usersTraitList = {
                eyeColor: {
                    DimensionLabel: 'Eye Color',
                    Id: 'eyeColor',
                    Value: 'brown',
                    ValueLabel: 'Green'
                }
            };

            const traitListToMatch = ['eyeColor'];

            expect(BiProfile.getMatchingBiTraits(userBiInfoEmpty, usersTraitList, traitListToMatch)).not.toBeDefined();
        });

        it('if second user does not have bi data defined, should return undefined', () => {
            let usersTraitList;

            const traitListToMatch = ['eyeColor'];
            storeGetStateStub.and.returnValue(userWithBiInfo);

            expect(BiProfile.getMatchingBiTraits(usersTraitList, traitListToMatch)).not.toBeDefined();
        });
    });

    describe('sortBiTraits', () => {
        it('should return traits array sorted according to bi traits order array', () => {
            const biTraitsOrder = ['eyeColor', 'hairColor', 'skinColor'];
            const biTraitsOrdered = [{ Id: 'eyeColor' }, { Id: 'hairColor' }, { Id: 'skinColor' }];

            const biTraits = [{ Id: 'hairColor' }, { Id: 'skinColor' }, { Id: 'eyeColor' }];

            expect(BiProfile.sortBiTraits(biTraits, biTraitsOrder)).toEqual(biTraitsOrdered);
        });

        it('should return empty array if biTraits is empty', () => {
            const biTraitsOrder = ['eyeColor', 'hairColor', 'skinColor'];
            const biTraits = [];

            expect(BiProfile.sortBiTraits(biTraits, biTraitsOrder).length).toEqual(0);
        });
    });

    describe('complete Profile Object', () => {
        it('should get the proper content', () => {
            const result = BiProfile.completeProfileObject(savedData, data);
            expect(result).toEqual({
                hairColor: ['gray'],
                hairDescrible: ['coarseHr', 'dryHr', 'oilyHr', 'wavy'],
                hairConcerns: ['antiAging', 'damaged'],
                eyeColor: ['brown'],
                skinType: ['oilySk'],
                skinTone: ['dark'],
                skinConcerns: ['acne'],
                gender: ['female']
            });
        });
    });

    data = {
        eyeColor: [
            {
                value: 'blue',
                displayName: 'Blue'
            },
            {
                value: 'brown',
                displayName: 'Brown',
                isSelected: true
            },
            {
                value: 'green',
                displayName: 'Green'
            },
            {
                value: 'grey',
                displayName: 'Grey'
            },
            {
                value: 'hazel',
                displayName: 'Hazel'
            }
        ],
        skinType: [
            {
                value: 'comboSk',
                displayName: 'Combination'
            },
            {
                value: 'drySk',
                displayName: 'Dry'
            },
            {
                value: 'normalSk',
                displayName: 'Normal'
            },
            {
                value: 'oilySk',
                displayName: 'Oily',
                isSelected: true
            }
        ],
        skinTone: [
            {
                value: 'porcelain',
                displayName: 'Porcelain',
                imageUrl: '/images/skintone/porcelain.jpg'
            },
            {
                value: 'fair',
                displayName: 'Fair',
                imageUrl: '/images/skintone/fair.jpg'
            },
            {
                value: 'light',
                displayName: 'Light',
                imageUrl: '/images/skintone/light.jpg'
            },
            {
                value: 'medium',
                displayName: 'Medium',
                imageUrl: '/images/skintone/med.jpg'
            },
            {
                value: 'tan',
                displayName: 'Tan',
                imageUrl: '/images/skintone/tan.jpg'
            },
            {
                value: 'olive',
                displayName: 'Olive',
                imageUrl: '/images/skintone/olive.jpg'
            },
            {
                value: 'deep',
                displayName: 'Deep',
                imageUrl: '/images/skintone/deep.jpg'
            },
            {
                value: 'dark',
                displayName: 'Dark',
                imageUrl: '/images/skintone/dark.jpg',
                isSelected: true
            },
            {
                value: 'ebony',
                displayName: 'Ebony',
                imageUrl: '/images/skintone/ebony.jpg'
            }
        ],
        hairColor: [
            {
                value: 'blonde',
                displayName: 'Blonde'
            },
            {
                value: 'brunette',
                displayName: 'Brunette'
            },
            {
                value: 'auburn',
                displayName: 'Auburn'
            },
            {
                value: 'black',
                displayName: 'Black'
            },
            {
                value: 'red',
                displayName: 'Red'
            },
            {
                value: 'gray',
                displayName: 'Grey',
                isSelected: true
            }
        ],
        skinConcerns: [
            {
                value: 'acne',
                displayName: 'Acne',
                isSelected: true
            },
            {
                value: 'aging',
                displayName: 'Aging'
            },
            {
                value: 'blackheads',
                displayName: 'Blackheads'
            },
            {
                value: 'calluses',
                displayName: 'Calluses'
            },
            {
                value: 'cellulite',
                displayName: 'Cellulite'
            },
            {
                value: 'cuticles',
                displayName: 'Cuticles'
            },
            {
                value: 'darkCircles',
                displayName: 'Dark Circles'
            },
            {
                value: 'dullness',
                displayName: 'Dullness'
            },
            {
                value: 'pores',
                displayName: 'Pores'
            },
            {
                value: 'puffiness',
                displayName: 'Puffiness'
            },
            {
                value: 'redness',
                displayName: 'Redness'
            },
            {
                value: 'sens',
                displayName: 'Sensitivity'
            },
            {
                value: 'stretchMarks',
                displayName: 'Stretch Marks'
            },
            {
                value: 'sunDamage',
                displayName: 'Sun Damage'
            },
            {
                value: 'skinTone',
                displayName: 'Uneven Skin Tones'
            }
        ],
        hairDescrible: [
            {
                value: 'chemHr',
                displayName: 'Chemically Treated'
            },
            {
                value: 'coarseHr',
                displayName: 'Coarse',
                isSelected: true
            },
            {
                value: 'curly',
                displayName: 'Curly'
            },
            {
                value: 'dryHr',
                displayName: 'Dry',
                isSelected: true
            },
            {
                value: 'fineHr',
                displayName: 'Fine'
            },
            {
                value: 'normalHr',
                displayName: 'Normal'
            },
            {
                value: 'oilyHr',
                displayName: 'Oily',
                isSelected: true
            },
            {
                value: 'straight',
                displayName: 'Straight'
            },
            {
                value: 'wavy',
                displayName: 'Wavy',
                isSelected: true
            }
        ],
        hairConcerns: [
            {
                value: 'antiAging',
                displayName: 'Anti-aging',
                isSelected: true
            },
            {
                value: 'colorProtection',
                displayName: 'Color Protection'
            },
            {
                value: 'curlEnhancing',
                displayName: 'Curl Enhancing'
            },
            {
                value: 'damaged',
                displayName: 'Damaged',
                isSelected: true
            },
            {
                value: 'dandruffHr',
                displayName: 'Dandruff'
            },
            {
                value: 'frizzHr',
                displayName: 'Frizz'
            },
            {
                value: 'heatProtection',
                displayName: 'Heat Protection'
            },
            {
                value: 'hold',
                displayName: 'Hold'
            },
            {
                value: 'oiliness',
                displayName: 'Oiliness'
            },
            {
                value: 'shine',
                displayName: 'Shine'
            },
            {
                value: 'straigteningSmoothing',
                displayName: 'Straightening'
            },
            {
                value: 'thinHr',
                displayName: 'Thinning'
            },
            {
                value: 'volumizing',
                displayName: 'Volumizing'
            }
        ],
        gender: [
            {
                value: 'male',
                displayName: 'Male'
            },
            {
                value: 'female',
                displayName: 'Female',
                isSelected: true
            }
        ]
    };

    describe('isBiDown', () => {
        it('should return true when BI is down', () => {
            storeGetStateStub.and.returnValue({ basket: { isBIPointsAvailable: false } });
            expect(BiProfile.isBiDown()).toEqual(true);
        });

        it('should return false when BI is not down', () => {
            storeGetStateStub.and.returnValue({ basket: { isBIPointsAvailable: true } });
            expect(BiProfile.isBiDown()).toEqual(false);
        });
    });

    describe('isBIDataAvailable', () => {
        it('should return false when isBIPointsAvailable is false', () => {
            storeGetStateStub.and.returnValue({
                basket: { isBIPointsAvailable: false },
                user: { profileStatus: 4 }
            });
            expect(BiProfile.isBIDataAvailable()).toEqual(false);
        });

        it('should return true when BI data is available', () => {
            storeGetStateStub.and.returnValue({
                basket: { isBIPointsAvailable: true },
                user: {
                    beautyInsiderAccount: { data: 'test' },
                    profileStatus: 0
                }
            });
            expect(BiProfile.isBIDataAvailable()).toEqual(true);
        });

        it('should return false when isBIPointsAvailable is true but BI data is not available', () => {
            spyOn(userUtils, 'isBI').and.returnValue(true);
            storeGetStateStub.and.returnValue({
                basket: { isBIPointsAvailable: true },
                user: { profileStatus: 2 }
            });
            expect(BiProfile.isBIDataAvailable()).toEqual(false);
        });
    });

    describe('getBiAccountId', () => {
        let biUser;
        let nonBiUser;

        beforeEach(() => {
            biUser = { user: { beautyInsiderAccount: { biAccountId: 123 } } };
            nonBiUser = { user: {} };
        });

        it('should return the id for BI users', () => {
            storeGetStateStub.and.returnValue(biUser);
            expect(BiProfile.getBiAccountId()).toEqual(123);
        });

        it('should return the id for BI users when passing the user through params', () => {
            expect(BiProfile.getBiAccountId(biUser.user)).toEqual(123);
        });

        it('should return undefined for non-BI users', () => {
            storeGetStateStub.and.returnValue(nonBiUser);
            expect(BiProfile.getBiAccountId()).toEqual(undefined);
        });
    });
});
