const { loadAdobeLaunch } = require('analytics/tagManagementSystem').default;
const { adobeLaunchEnvironments } = require('config/tagManagerConfig.js');
const { createSpy, objectContaining } = jasmine;

describe('loadTagManagementSystem', () => {
    let createElementStub;
    let getElementsByTagStub;
    let insertBeforeSpy;

    describe('loadAdobeLaunch', () => {
        beforeEach(() => {
            Sephora.configurationSettings.adobeLaunchContainerLoading = true;
            createElementStub = spyOn(document, 'createElement').and.returnValue({});
            insertBeforeSpy = createSpy();
            getElementsByTagStub = spyOn(document, 'getElementsByTagName').and.returnValue([{ parentNode: { insertBefore: insertBeforeSpy } }]);
            loadAdobeLaunch();
        });

        it('should call createElement with script', () => {
            expect(createElementStub).toHaveBeenCalledWith('script');
        });

        it('should call getElementsByTag with script', () => {
            expect(getElementsByTagStub).toHaveBeenCalledWith('script');
        });

        describe('should call insertBefore with the right Adobe Launch configuration', () => {
            it('when evironment is not PROD, the default Adobe Launch config should be QATesting', () => {
                if (Sephora.UFE_ENV !== 'PROD') {
                    expect(insertBeforeSpy.calls.mostRecent().args[0]).toEqual(objectContaining({ src: adobeLaunchEnvironments.QATesting }));
                }
            });

            it('when Sephora.configurationSettings.adobeLaunchConfig is invalid config should be QATesting on Non PROD environment.', () => {
                if (Sephora.UFE_ENV !== 'PROD') {
                    Sephora.configurationSettings.adobeLaunchConfig = '';
                    expect(insertBeforeSpy.calls.mostRecent().args[0]).toEqual(objectContaining({ src: adobeLaunchEnvironments.QATesting }));
                }
            });

            it('when Sephora.configurationSettings.adobeLaunchConfig is set.', () => {
                if (Sephora.UFE_ENV !== 'PROD') {
                    Sephora.configurationSettings.adobeLaunchConfig = 'Development';
                    loadAdobeLaunch();
                    expect(insertBeforeSpy.calls.mostRecent().args[0]).toEqual(objectContaining({ src: adobeLaunchEnvironments.Development }));
                }
            });
        });
    });
});
