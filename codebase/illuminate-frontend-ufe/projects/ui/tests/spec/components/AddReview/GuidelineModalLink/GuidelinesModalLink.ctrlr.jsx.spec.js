const React = require('react');
const { shallow } = require('enzyme');
const GuidelinesModalLink = require('components/ProductPage/RatingsAndReviews/GuidelinesModalLink/GuidelinesModalLink').default;
const cmsApi = require('services/api/cms').default;
const Modal = require('components/Modal/Modal').default;

describe('GuidelinesModalLink component', () => {
    let getMediaContent;
    let wrapper;
    let resolvedApiCall;

    beforeEach(() => {
        wrapper = shallow(<GuidelinesModalLink globalModals={{}} />);
        const dataStub = { regions: { content: 'dataRegionsContentStub' } };
        resolvedApiCall = Promise.resolve(dataStub);
        getMediaContent = spyOn(cmsApi, 'getMediaContent').and.returnValue(resolvedApiCall);
        wrapper.instance().componentDidMount();
    });

    it('should get media content from API', () => {
        const MEDIA_ID = 100400018;
        // Arrange
        const link = wrapper.findWhere(n => n.name() === 'Link');

        //Act
        wrapper.update();
        link.simulate('click');

        // Assert
        expect(getMediaContent).toHaveBeenCalledWith(MEDIA_ID);
    });

    it('should set the state for the modal to be opened', () => {
        // Arrange
        const link = wrapper.findWhere(n => n.name() === 'Link');

        //Act
        wrapper.update();
        link.simulate('click');
        // Assert
        resolvedApiCall.then(() => {
            expect(wrapper.find(Modal).exists()).toBeTruthy();
        });
    });
});
