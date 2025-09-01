const baseDir = process.cwd();

describe('gamificationUtils', () => {
    let RENDERING,
        PARAMETERS,
        DATASOURCE,
        LAYOUTS,
        CHALLENGE_STATUS;

    let gamificationUtils;

    beforeEach((done) => {
        Promise.all([
            import('#server/services/apiOrchestration/content/constants.mjs'),
            import('#server/services/apiOrchestration/content/utils/gamificationUtils.mjs')
        ]).then(function (res) {
            if (res[0]) {
                RENDERING = res[0].RENDERING;
                PARAMETERS = res[0].PARAMETERS;
                DATASOURCE = res[0].DATASOURCE;
                LAYOUTS = res[0].LAYOUTS;
                CHALLENGE_STATUS = res[0].CHALLENGE_STATUS;
            }

            if (res[1]) {
                gamificationUtils = res[1].default;
            }

            done();
        });
    });

    describe('calculateMarketingFlagColor', () => {
        it('should return GRAY color when the challenge has ended', () => {
            expect(gamificationUtils.calculateMarketingFlagColor({
                daysLeft: 0,
                endDateTime: '10/21/2022'
            }, true)).toEqual('gray');
        });

        it('should return RED color when days is <= 14', () => {
            expect(gamificationUtils.calculateMarketingFlagColor({ daysLeft: 14 })).toEqual('red');
        });

        it('should return BLACK color when days is > 14 and <= 30', () => {
            expect(gamificationUtils.calculateMarketingFlagColor({ daysLeft: 20 })).toEqual('black');
        });

        it('should return empty string if days > 30', () => {
            expect(gamificationUtils.calculateMarketingFlagColor({ daysLeft: 35 })).toEqual('');
        });
    });

    describe('calculateMarketingFlagText', () => {
        const obj = {
            dayLeft: 'DAY LEFT',
            daysLeft: 'DAYS LEFT',
            lastDay: 'LAST DAY',
            challengeEnded: 'CHALLENGE ENDED'
        };

        it('should return word CHALLENGE ENDED if the challenge has ended', () => {
            expect(gamificationUtils.calculateMarketingFlagText({
                daysLeft: 0,
                endDateTime: '10/21/2020'
            }, obj)).toEqual(obj.challengeEnded);
        });

        it('should return word LAST DAY if day ie equal 0', () => {
            expect(gamificationUtils.calculateMarketingFlagText({ daysLeft: 0 }, obj)).toEqual(obj.lastDay);
        });

        it('should return word DAY LEFT if day is equal 1', () => {
            expect(gamificationUtils.calculateMarketingFlagText({ daysLeft: 1 }, obj)).toEqual(`1 ${obj.dayLeft}`);
        });

        it('should return word DAYS LEFT if day is > 1 and < 30', () => {
            expect(gamificationUtils.calculateMarketingFlagText({ daysLeft: 20 }, obj)).toEqual(`20 ${obj.daysLeft}`);
        });

        it('should return empty string if days is > 30', () => {
            expect(gamificationUtils.calculateMarketingFlagText({ daysLeft: 35 }, obj)).toEqual('');
        });
    });

    describe('calculateActionLabelText', () => {
        const gamificationSettings = {
            challengeCtaLabel: 'LEARN MORE ▸',
            challengeCtaLabelNj: 'JOIN CHALLENGE ▸',
            challengeCtaLabelJ: 'COMPLETE TASKS ▸',
            challengeCtaLabelC: 'SEE POINTS EARNED ▸'
        };

        it('should return challengeCtaLabel if user anonymous', () => {
            expect(gamificationUtils.calculateActionLabelText({ gameStatus: CHALLENGE_STATUS.NOT_JOINED }, gamificationSettings))
                .toEqual(gamificationSettings.challengeCtaLabel);

        });

        it('should return Challenge CTA Label - Not Joined if gameStatus NOT_JOINED', () => {
            expect(gamificationUtils.calculateActionLabelText({ gameStatus: CHALLENGE_STATUS.NOT_JOINED }, gamificationSettings, { userId: 123 }))
                .toEqual(gamificationSettings.challengeCtaLabelNj);
        });


        it('should return Challenge CTA label - Joined if gameStatus OPTED_IN', () => {
            expect(gamificationUtils.calculateActionLabelText({ gameStatus: CHALLENGE_STATUS.OPTED_IN }, gamificationSettings, { userId: 123 }))
                .toEqual(gamificationSettings.challengeCtaLabelJ);
        });


        it('should return Challenge CTA Label - Completed if gameStatus COMPLETED', () => {
            expect(gamificationUtils.calculateActionLabelText({ gameStatus: CHALLENGE_STATUS.COMPLETED }, gamificationSettings, { userId: 123 }))
                .toEqual(gamificationSettings.challengeCtaLabelC);
        });
    });

    describe('buildStatusText', () => {
        const gamificationSettings = {
            gameStatusNotJoined: 'Join Challenge',
            gameStatusJoined: 'Joined',
            gameStatusPending: 'Joined',
            gameStatusEarned: 'Joined  • {0} pts earned',
            gameStatusCompleted: 'Completed  •  Total {0} pts earned'
        };

        const sharedContext = { userId: 123 };

        it('should return gameStatusNotJoined if gameStatus is NOT_JOINED', () => {
            expect(gamificationUtils.buildStatusText({ gameStatus: CHALLENGE_STATUS.NOT_JOINED }, gamificationSettings, sharedContext))
                .toContain(gamificationSettings.gameStatusNotJoined);
        });

        it('should return gameStatusJoined if gameStatus is OPTED_IN and no pointsEarned', () => {
            expect(gamificationUtils.buildStatusText({ gameStatus: CHALLENGE_STATUS.OPTED_IN }, gamificationSettings, sharedContext))
                .toContain(gamificationSettings.gameStatusJoined);
        });

        it('should return gameStatusPending if gameStatus is OPTED_IN and pointsEarned = 0', () => {
            expect(gamificationUtils.buildStatusText({
                gameStatus: CHALLENGE_STATUS.OPTED_IN,
                pointsEarned: 0
            }, gamificationSettings, sharedContext))
                .toContain(gamificationSettings.gameStatusPending);
        });

        it('should return gameStatusEarned if gameStatus is OPTED_IN and pointsEarned > 0', () => {
            expect(gamificationUtils.buildStatusText({
                gameStatus: CHALLENGE_STATUS.OPTED_IN,
                pointsEarned: 100
            }, gamificationSettings, sharedContext))
                .toContain(gamificationSettings.gameStatusEarned.replace('{0}', 100));
        });

        it('should return gameStatusCompleted if gameStatus is COMPLETED', () => {
            expect(gamificationUtils.buildStatusText({
                gameStatus: CHALLENGE_STATUS.COMPLETED,
                pointsEarned: 100
            }, gamificationSettings, sharedContext))
                .toContain(gamificationSettings.gameStatusCompleted.replace('{0}', 100));
        });

        it('should return gameStatusCompleted if gameStatus is ""', () => {
            expect(gamificationUtils.buildStatusText({
                gameStatus: '',
                pointsEarned: 100
            }, gamificationSettings, sharedContext))
                .toContain(gamificationSettings.gameStatusCompleted.replace('{0}', 100));
        });

        it('should return "" if no condition is met', () => {
            expect(gamificationUtils.buildStatusText({}, gamificationSettings, sharedContext))
                .toEqual('');
        });

        it('should return "" if user is anonymous', () => {
            expect(gamificationUtils.buildStatusText({}, gamificationSettings, {}))
                .toEqual('');
        });
    });

    describe('createGameItems', () => {
        it('should return of mapped games', () => {
            const dynamicComponent = {
                sid: 'dynamicComponentSid'
            };
            const gamificationGames = [
                {
                    gameId: 123,
                    gameName: 'Passport to Beauty',
                    gameDescription:
                        'Earn 100 points for each task. Earn 500 points by completing all 5 tasks, and redeem for $10 Beauty Insider Cash!',
                    daysLeft: 24,
                    totalOfPointsToReward: 500
                }
            ];
            const gamificationSettings = {
                type: 'GamificationSettings',
                sid: 'Gamification-Settings',
                dayLeft: 'DAY LEFT',
                daysLeft: 'DAYS LEFT',
                lastDay: 'LAST DAY',
                challengeEnded: 'CHALLENGE ENDED',
                allGames: [
                    {
                        sid: 'Gamification-Game-123',
                        gameId: '123',
                        title: 'Passport to Beauty',
                        description:
                            'Earn 100 points for each task. Earn 500 points by completing all 5 tasks, and redeem for $10 Beauty Insider Cash!',
                        image: {},
                        action: {}
                    }
                ],
                challengeCtaLabel: 'LEARN MORE >'
            };

            const expected = [
                {
                    sid: `dynamicComponentSid-123-${RENDERING.CARD}`,
                    type: RENDERING.CARD,
                    parameters: {
                        sid: `dynamicComponentSid-123-${PARAMETERS.CARD}`,
                        type: PARAMETERS.CARD,
                        marketingFlagBackgroundColor: 'black',
                        titleIsHighlighted: true,
                        layout: LAYOUTS.VERTICAL,
                        withBorder: true
                    },
                    datasource: {
                        sid: `dynamicComponentSid-123-${DATASOURCE.CARD}`,
                        type: DATASOURCE.CARD,
                        title: 'Passport to Beauty',
                        description:
                            'Earn 100 points for each task. Earn 500 points by completing all 5 tasks, and redeem for $10 Beauty Insider Cash!',
                        action: {},
                        image: {},
                        marketingFlagText: '24 DAYS LEFT',
                        actionLabel: 'LEARN MORE >',
                        textBelowTheTitle: undefined,
                        imageBelowTheTitle: undefined
                    }
                }
            ];

            expect(gamificationUtils.createGameItems(dynamicComponent, gamificationGames, gamificationSettings)).toEqual(expected);
        });
    });

    describe('createFallbackCopyComponent', () => {
        const dynamicComponent = { sid: 'dynamicComponentSid' };
        const fallbackCopy = { text: 'some-value' };

        it('should return copy component', () => {
            const expectedResult = [{
                sid: 'dynamicComponentSid-gamification-key-demo',
                type: 'Copy',
                content: fallbackCopy,
                style: {
                    marginTop: '0',
                    marginBottom: '0'
                }
            }];

            expect(gamificationUtils.createFallbackCopyComponent('gamification-key-demo', dynamicComponent, fallbackCopy)).toEqual(expectedResult);
        });

        it('should return empty array if no value provided', () => {
            expect(gamificationUtils.createFallbackCopyComponent('gamification-key-demo', null, fallbackCopy)).toEqual([]);
        });
    });

    describe('getDateString', () => {
        it('should return correct date string', () => {
            expect(gamificationUtils.getDateString('2023-04-15T10:00:00')).toEqual('Apr 15, 2023');
        });
    });

    describe('parseStatusForAnalytics', () => {
        it('should return "not joined" when status is NOT_JOINED', () => {
            expect(gamificationUtils.parseStatusForAnalytics(CHALLENGE_STATUS.NOT_JOINED)).toEqual('not joined');
        });

        it('should return "joined" when status is OPTED_IN', () => {
            expect(gamificationUtils.parseStatusForAnalytics(CHALLENGE_STATUS.OPTED_IN)).toEqual('joined');
        });

        it('should return "completed" when status is COMPLETED', () => {
            expect(gamificationUtils.parseStatusForAnalytics(CHALLENGE_STATUS.COMPLETED)).toEqual('completed');
        });

        it('should return "" when status is invalid', () => {
            expect(gamificationUtils.parseStatusForAnalytics('NOT_VALID_STATUS')).toEqual('');
        });
    });

    describe('hasGameEnded', () => {
        it('should return true if now is after end date', () => {
            const gameDetails = {
                gameId: 1038,
                endDateTime: '2020-12-22T23:59:00-08:00'
            };
            expect(gamificationUtils.hasGameEnded(gameDetails)).toEqual(true);
        });

        it('should return false if now is before end date', () => {
            const gameDetails = {
                gameId: 1038,
                endDateTime: '2050-12-22T23:59:00-08:00'
            };
            expect(gamificationUtils.hasGameEnded(gameDetails)).toEqual(false);
        });
    });

});
