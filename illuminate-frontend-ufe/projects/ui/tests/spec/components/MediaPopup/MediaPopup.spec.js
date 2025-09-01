const React = require('react');
const { shallow } = require('enzyme');

describe('MediaPopup component', () => {
    let MediaPopup;
    let propsStub;
    let getMediaContentStub;

    beforeEach(() => {
        const getMediaContentModule = require('services/api/cms/getMediaContent').default;
        getMediaContentStub = spyOn(getMediaContentModule, 'getMediaContent').and.returnValue({ then: () => {} });
        MediaPopup = require('components/GlobalModals/MediaPopup/MediaPopup').default;
        propsStub = {
            title: 'Beauty Insider Terms & Conditions',
            dataAt: 'TermsConditionsModal',
            isOpen: true,
            onClose: () => {},
            mediaId: '20800040',
            showContent: true
        };
    });

    it('call the catalog media endpoint to get the border free content should call refetch with the appropriate endpoint', () => {
        // Arrange
        const mediaId = '20800040';

        // Act
        shallow(<MediaPopup />)
            .instance()
            .getMediaContent(mediaId);

        // Assert
        expect(getMediaContentStub).toHaveBeenCalledWith(mediaId);
    });

    describe('when MediaPopup receives contentDataAt attribute', () => {
        it('the wrapper div should have the correct contentDataAt attribute value', () => {
            const propsStubWithContentDataAt = {
                ...propsStub,
                contentDataAt: 'terms_condition_content'
            };

            const wrapper = shallow(<MediaPopup {...propsStubWithContentDataAt} />);
            const customContainer = wrapper.find('div').at(0);

            expect(customContainer.length).toEqual(1);
            expect(customContainer.prop('data-at')).toEqual('terms_condition_content');
        });
    });

    describe('when MediaPopup does not contentDataAt attribute', () => {
        it('the wrapper div should not contain the contentDataAt attribute', () => {
            const wrapper = shallow(<MediaPopup {...propsStub} />);
            const customContainer = wrapper.find('div').at(0);

            expect(customContainer.length).toEqual(1);
            expect(customContainer.props()['data-at']).toBeNull();
        });
    });
});
