describe('BCC utils', function () {
    const BCC = require('utils/BCC').default;

    describe('extractTargeters', () => {
        const pageStub = {
            apiConfigurationData: { isClaripPrivacyEnabled: false },
            headerFooterTemplate: {
                regions: {
                    categoryMenu: [
                        {
                            displayTitle: 'Sephora Collection',
                            name: 'meganav_shopcategories_sephoracollection_link'
                        },
                        {
                            displayTitle: 'Beauty Offers',
                            name: 'meganav_shopcategories_beautyoffers_desktop_link'
                        }
                    ],
                    persistentBanner1: [
                        {
                            componentName: 'Sephora Unified Targeter Component',
                            componentType: 63,
                            enableTesting: false,
                            targeterName: '/atg/registry/RepositoryTargeters/AprilSpringBonusMobilePB'
                        }
                    ],
                    topNavigationMenu: []
                }
            },
            displayName: 'PLAY 100% Mineral Broad Spectrum Lotion SPF 50',
            flashBanner: {
                componentName: 'Sephora Unified Targeter Component',
                targeterName: 'faketargeterName1',
                regions: {
                    content: [
                        {
                            componentName: 'Sephora Unified Markdown Component',
                            componentType: 57
                        },
                        {
                            componentName: 'Sephora Unified Targeter Component',
                            targeterName: 'faketargeterName2'
                        }
                    ]
                }
            }
        };

        it('should extract targeters from all the levels of data object', () => {
            expect(BCC.extractTargeters(pageStub)).toEqual([
                '/atg/registry/RepositoryTargeters/AprilSpringBonusMobilePB',
                'faketargeterName1',
                'faketargeterName2'
            ]);
        });

        it('should return empty array for if input is malformed', () => {
            expect(BCC.extractTargeters(777)).toEqual([]);
        });
    });

    describe('buildTargetersQueryParams', () => {
        it('should return quesry string with comma-separated values', () => {
            const values = ['val1', 'val2', 12];
            expect(BCC.buildTargetersQueryParams(values)).toEqual('?includeTargeters=val1,val2,12');
        });

        it('should uriEncode values', () => {
            const values = ['/atg/registry/RepositoryTargeters/AprilSpringBonusMobilePB'];
            expect(BCC.buildTargetersQueryParams(values)).toEqual(
                '?includeTargeters=%2Fatg%2Fregistry%2FRepositoryTargeters%2FAprilSpringBonusMobilePB'
            );
        });

        it('should return ? for empty targeters array', () => {
            expect(BCC.buildTargetersQueryParams([])).toEqual('?');
        });

        it('should return ? for malformed input', () => {
            expect(BCC.buildTargetersQueryParams(null)).toEqual('?');
        });
    });

    describe('setTargetWindow method', () => {
        it('should return _blank if integer 1 is passed in', () => {
            expect(BCC.setTargetWindow(1)).toEqual('_blank');
        });
        it('should return _blank if string 1 is passed in', () => {
            expect(BCC.setTargetWindow('1')).toEqual('_blank');
        });
        it('should return _blank if string _blank is passed in', () => {
            expect(BCC.setTargetWindow('_blank')).toEqual('_blank');
        });
        it('should return _blank if string blank is passed in', () => {
            expect(BCC.setTargetWindow('blank')).toEqual('_blank');
        });
        it('should return _blank if string overlay is passed in', () => {
            expect(BCC.setTargetWindow('overlay')).toEqual('_blank');
        });
        it('should return _self if integer 0 is passed in', () => {
            expect(BCC.setTargetWindow(0)).toEqual(null);
        });
    });
});
