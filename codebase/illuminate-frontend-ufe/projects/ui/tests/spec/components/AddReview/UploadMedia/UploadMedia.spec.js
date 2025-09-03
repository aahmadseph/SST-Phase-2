const React = require('react');
const shallow = enzyme.shallow;

describe('UploadMedia', () => {
    describe('#removeMedia', () => {
        let props;
        let UploadMedia;
        let wrapper;
        let component;
        let newMediaContainer;

        beforeEach(() => {
            // prettier-ignore
            newMediaContainer = {
                'photourl_1': 'http://photourl_1.com',
                'photourl_2': 'http://photourl_2.com'
            };
            props = {
                onChange: () => {
                    return;
                }
            };
            Sephora.configurationSettings['bvApi_rich_profile'] = {
                host: 'host',
                token: 'token',
                version: 1,
                isBazaarVoiceEnabled: true
            };
            UploadMedia = require('components/AddReview/UploadMedia/UploadMedia').default;
            wrapper = shallow(<UploadMedia {...props} />);
            component = wrapper.instance();
        });

        it('should remove media', () => {
            component.state.media = newMediaContainer;
            component.removeMedia({}, 'photourl_1');
            expect(component.state.media['photourl_1']).toBe('http://photourl_2.com');
        });
    });
});
