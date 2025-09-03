/* eslint-disable no-shadow */

const React = require('react');
const { shallow } = require('enzyme');

describe('BioProfile component', () => {
    const BioProfile = require('components/RichProfile/EditMyProfile/Content/BioProfile/BioProfile').default;
    // const imageUtil = require('utils/Image.js').default;
    let component;
    let e;
    let file;
    const props = {
        socialProfile: {
            avatar: 'testImage.jpg',
            background: 'backgroundImage.jpg'
        }
    };

    describe('handleAvatarUpload', () => {
        it('should call replaceImageSpy', () => {
            const wrapper = shallow(<BioProfile {...props} />);
            component = wrapper.instance();

            const replaceImageSpy = spyOn(component, 'replaceImage');

            file = 'avatar';
            e = { target: { files: [file] } };
            component.handleAvatarUpload(e);
            expect(replaceImageSpy).toHaveBeenCalled();
        });
    });

    describe('handleBackgroundUpload', () => {
        it('should call replaceImageSpy', () => {
            const wrapper = shallow(<BioProfile {...props} />);
            component = wrapper.instance();

            const replaceImageSpy = spyOn(component, 'replaceImage');
            file = 'background';
            e = { target: { files: [file] } };

            component.handleBackgroundUpload(e);
            expect(replaceImageSpy).toHaveBeenCalled();
        });
    });

    /*
    describe('replaceImage', () => {
        it('should execute the callback if successful', () => {
            const callbackSpy = createSpy();
            // Phantom JS doesn't know what FileReader is
            window.FileReader = createSpy();
            file = 'test';
            imageUtil.resetOrientation = function (evt, f, callback) {
                callback();
            };
            // When readAsDataURL succeeds, it calls the instance own onload
            FileReader.prototype.readAsDataURL = function () {
                this.onload({ target: { result: file } });
            };
            component.replaceImage(file, callbackSpy);
            expect(callbackSpy).toHaveBeenCalled();
        });
    });
    */
});
