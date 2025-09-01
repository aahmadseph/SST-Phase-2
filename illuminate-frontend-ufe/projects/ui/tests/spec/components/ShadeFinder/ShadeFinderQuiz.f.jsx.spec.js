/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
// eslint-disable-next-line no-undef
const { shallow } = enzyme;

describe('ShadeFinderQuiz Component', () => {
    let ShadeFinderQuiz;
    let analyticsConstants;
    let processEvent;
    let wrapper;
    let world;

    beforeEach(() => {
        ShadeFinderQuiz = require('components/ShadeFinder/ShadeFinderQuiz').default;
        analyticsConstants = require('analytics/constants').default;
        processEvent = require('analytics/processEvent').default;
        world = window.digitalData.page.attributes.world || 'n/a';
    });

    it('open ShadeFinderQuiz should fire event with proper data', () => {
        // Arrange
        const process = spyOn(processEvent, 'process');
        digitalData.page.attributes.sephoraPageInfo.pageName = 'quiz page';

        // Act
        wrapper = shallow(<ShadeFinderQuiz componentName='Foundation_nthlevel_quiz_banner_image_desktop_8.9 animation' />);
        const component = wrapper.instance();

        // Assert
        expect(process).toHaveBeenCalledWith(analyticsConstants.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `product:shade finder-landing page:${world}:*`,
                linkData: 'product:shade finder:banner',
                internalCampaign: 'shade finder:Foundation_nthlevel_quiz_banner_image_desktop_8.9 animation',
                pageType: 'product', // eVar 93
                pageDetail: 'shade finder-landing page' // eVar 94
            }
        });
    });
});
