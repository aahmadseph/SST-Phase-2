describe('at.js thirdparty script footer custom code', () => {
    it('should dispatch window event for TestTargetLoaded', () => {
        const dispatchEventStub = spyOn(window, 'dispatchEvent');
        require('services/TestTarget/testTargetFooter.js');
        expect(dispatchEventStub).toHaveBeenCalled();
    });

    it('should set global loadEvents.TestTargetLoaded to true', () => {
        require('services/TestTarget/testTargetFooter.js');
        expect(Sephora.Util.InflatorComps.services.loadEvents.TestTargetLoaded).toBe(true);
    });
});
