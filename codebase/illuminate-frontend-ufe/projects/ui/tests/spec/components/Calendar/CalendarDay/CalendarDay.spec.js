const React = require('react');
// eslint-disable-next-line no-undef
const shallow = enzyme.shallow;
const { createSpy } = jasmine;

describe('CalendarDay', function () {
    let CalendarDay;
    let component;
    let wrapper;
    let props;
    let day;
    let onClickStub;
    let onKeyDownStub;

    beforeEach(() => {
        CalendarDay = require('components/Calendar/CalendarDay/CalendarDay').default;
        onClickStub = createSpy();
        onKeyDownStub = createSpy();
        day = new Date(2018, 0, 20);
        props = {
            onClick: onClickStub,
            onKeyDown: onKeyDownStub,
            modifiers: {},
            day
        };
        wrapper = shallow(<CalendarDay {...props} />);
        component = wrapper.instance();
    });

    describe('CalendarDay.prototype.handleClick', () => {
        it('should call onClick prop method', () => {
            component.handleClick(day, {}, {});
            expect(onClickStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('CalendarDay.prototype.handleKeyDown', () => {
        it('should call onKeyDown prop method', () => {
            component.handleKeyDown(day, {}, {});
            expect(onKeyDownStub).toHaveBeenCalledTimes(1);
        });
    });
});
