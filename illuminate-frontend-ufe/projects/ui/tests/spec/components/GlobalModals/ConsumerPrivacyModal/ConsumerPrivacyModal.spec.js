const React = require('react');
const { shallow } = require('enzyme');
const processEvent = require('analytics/processEvent').default;
const anaUtils = require('analytics/utils').default;
const { LINK_TRACKING_EVENT } = require('analytics/constants').default;
const Location = require('utils/Location').default;
const ConsumerPrivacyModal = require('components/GlobalModals/ConsumerPrivacyModal/ConsumerPrivacyModal').default;

describe('ConsumerPrivacyModal component', () => {
    it('Trigger analytics when hitting Overview tab', () => {
        // Arrange
        const processStub = spyOn(processEvent, 'process');
        const sectionHeading = 'Overview';
        const overviewTab = shallow(<ConsumerPrivacyModal />).find(`[title="${sectionHeading}"]`);
        const data = { actionInfo: `privacy settings:${sectionHeading.toLowerCase()}` };

        // Act
        overviewTab.simulate('click');

        // Assert
        expect(processStub).toHaveBeenCalledWith(LINK_TRACKING_EVENT, { data });
    });

    it('Trigger analytics when hitting Required Cookies tab', () => {
        // Arrange
        const processStub = spyOn(processEvent, 'process');
        const sectionHeading = 'Required Cookies';
        const overviewTab = shallow(<ConsumerPrivacyModal />).find(`[title="${sectionHeading}"]`);
        const data = { actionInfo: `privacy settings:${sectionHeading.toLowerCase()}` };

        // Act
        overviewTab.simulate('click');

        // Assert
        expect(processStub).toHaveBeenCalledWith(LINK_TRACKING_EVENT, { data });
    });

    it('Trigger analytics when hitting Third Party Advertising Cookies tab', () => {
        // Arrange
        const processStub = spyOn(processEvent, 'process');
        const sectionHeading = 'Third Party Advertising & Analytics Cookies';
        const overviewTab = shallow(<ConsumerPrivacyModal />).find(`[title="${sectionHeading}"]`);
        const data = { actionInfo: 'privacy settings:advertising cookies' };

        // Act
        overviewTab.simulate('click');

        // Assert
        expect(processStub).toHaveBeenCalledWith(LINK_TRACKING_EVENT, { data });
    });

    it('Trigger analytics after saving advertising prefences', () => {
        // Arrange
        const saveButton = shallow(<ConsumerPrivacyModal />).find('Button');
        const setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
        const data = { linkData: 'privacy settings:save preferences' };
        spyOn(Location, 'reload').and.callFake(function () {});

        // Act
        saveButton.simulate('click');

        // Assert
        expect(setNextPageDataStub).toHaveBeenCalledWith({ ...data });
    });
});
