describe('at.js thirdparty script header custom code', () => {
    it('should set global targetGlobalSettings bodyHidingEnabled property to false', () => {
        require('services/TestTarget/testTargetHeader.js');
        expect(window.targetGlobalSettings.bodyHidingEnabled).toBe(false);
    });

    it('should set global targetGlobalSettings secureOnly property to false', () => {
        require('services/TestTarget/testTargetHeader.js');
        expect(window.targetGlobalSettings.secureOnly).toBe(false);
    });

    it('should set global targetGlobalSettings viewsEnabled property to false', () => {
        require('services/TestTarget/testTargetHeader.js');
        expect(window.targetGlobalSettings.viewsEnabled).toBe(false);
    });
});
