describe('<Calendar />', () => {
    let React;
    let Calendar;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        Calendar = require('components/Calendar/Calendar').default;
    });

    describe('Default Layout', () => {
        let months;
        let dataAtStub;
        let props;
        beforeEach(() => {
            props = {
                selectedDay: new Date('2024-01-01'),
                isWeekView: true,
                disabledDays: [],
                monthsInView: 1,
                enableAllMonths: true,
                maxMonths: 4,
                defaultDate: new Date('2024-01-01')
            };
            shallowComponent = enzyme.shallow(<Calendar {...props} />, { disableLifecycleMethods: true });
            months = shallowComponent.find('CalendarMonth');
        });

        it('should render one months', () => {
            expect(months.length).toEqual(1);
        });

        it('should render each month with correct data-at attribute', () => {
            dataAtStub = spyOn(Sephora.debug, 'dataAt');
            dataAtStub.and.callFake(month => {
                if (month === 'current_month' || month === 'next_month') {
                    return month;
                }

                return '';
            });
            const expectedDataAt = {
                0: 'current_month',
                1: 'next_month',
                2: 'next_month'
            };
            months.forEach((month, i) => {
                const actualDataAt = month.dive().props()['data-at'];
                expect(actualDataAt).toEqual(expectedDataAt[i]);
            });
        });

        it('should render one calendar headers', () => {
            expect(shallowComponent.find('CalendarHeader').length).toEqual(1);
        });
    });
});
