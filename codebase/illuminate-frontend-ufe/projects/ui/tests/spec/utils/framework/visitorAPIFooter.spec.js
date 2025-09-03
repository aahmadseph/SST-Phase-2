describe('VisitorAPI.js thirdparty script footer custom code', () => {
    beforeEach(() => {
        Sephora.Util = {
            TestTarget: {},
            Perf: {
                loadEvents: [],
                report: () => {},
                isReportSupported: () => {
                    return window.performance && typeof window.performance.mark === 'function';
                }
            },
            InflatorComps: {
                services: {
                    loadEvents: {}
                }
            }
        };
        Sephora.template = 'Homepage/Homepage';
    });
    it('should dispatch window event for VisitorAPILoaded', () => {
        const dispatchEventStub = spyOn(window, 'dispatchEvent');
        require('services/TestTarget/visitorAPIFooter.js');
        expect(dispatchEventStub).toHaveBeenCalled();
    });

    it('should set global loadEvents.VisitorAPILoaded to true', () => {
        require('services/TestTarget/visitorAPIFooter.js');
        expect(Sephora.Util.InflatorComps.services.loadEvents.VisitorAPILoaded).toBe(true);
    });
});
