const React = require('react');
const { shallow } = require('enzyme');

describe('AboutMeSlide component', () => {
    let AboutMeSlide;
    let LOCAL_STORAGE;
    let Storage;
    let MAXIMUM_POPOVER_DISPLAY_COUNT;
    let setItemStub;
    let getItemStub;
    let mockedLocalStorage;

    beforeEach(() => {
        AboutMeSlide = require('components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlide/AboutMeSlide').default;
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;
        Storage = require('utils/localStorage/Storage').default;
        MAXIMUM_POPOVER_DISPLAY_COUNT = 2;
        mockedLocalStorage = {};

        setItemStub = spyOn(Storage.local, 'setItem').and.callFake((key, value) => {
            mockedLocalStorage[key] = value;
        });
        getItemStub = spyOn(Storage.local, 'getItem').and.callFake(key => {
            return mockedLocalStorage[key];
        });

        setItemStub(LOCAL_STORAGE.PROFILE_POPOVER_DISPLAY_COUNT, 0);
        setItemStub(LOCAL_STORAGE.PROFILE_POPOVER_DISMISSED, false);
    });

    it('should increment the number of times a Popover has displayed', () => {
        // Arrange
        const wrapper = shallow(<AboutMeSlide />);
        const component = wrapper.instance();
        const initialDisplayCount = getItemStub(LOCAL_STORAGE.PROFILE_POPOVER_DISPLAY_COUNT);

        // Act
        component.incrementPopoverDisplayedCount();

        // Assert
        const nextDisplayCount = getItemStub(LOCAL_STORAGE.PROFILE_POPOVER_DISPLAY_COUNT);
        expect(nextDisplayCount).toBe(initialDisplayCount + 1);
    });

    it('should indicate if a Popover has been displayed the maximum number of times', () => {
        const wrapper = shallow(<AboutMeSlide />);
        const component = wrapper.instance();

        for (let a = 0; a <= MAXIMUM_POPOVER_DISPLAY_COUNT; a++) {
            component.incrementPopoverDisplayedCount();
        }

        expect(component.maximumPopoverDisplayedCountReached()).toBe(true);
        setItemStub(LOCAL_STORAGE.PROFILE_POPOVER_DISPLAY_COUNT, 0);
        expect(component.maximumPopoverDisplayedCountReached()).toBe(false);
    });

    it('should record the dismissal of a Popover', () => {
        const wrapper = shallow(<AboutMeSlide />);
        const component = wrapper.instance();
        component.dismissPopover();

        expect(mockedLocalStorage[LOCAL_STORAGE.PROFILE_POPOVER_DISMISSED]).toBe('true');
    });

    it('should indicate that a Popover was dismissed', () => {
        const wrapper = shallow(<AboutMeSlide />);
        const component = wrapper.instance();

        for (let a = 0; a <= MAXIMUM_POPOVER_DISPLAY_COUNT; a++) {
            component.incrementPopoverDisplayedCount();
        }

        expect(component.shouldDisplayPopover()).toBe(false);
    });
});
