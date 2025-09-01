const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('Calendar component', () => {
    let Calendar;
    let component;
    let blurStub;
    let focusStub;
    let onDayClickStub;
    let event;
    let props;
    let day;
    let dateUtils;
    let calendarUtils;
    let setStateStub;
    let calendarConstants;

    beforeEach(() => {
        Calendar = require('components/Calendar/Calendar').default;
        dateUtils = require('utils/Date').default;
        calendarUtils = require('utils/Calendar').default;
        calendarConstants = require('constants/Calendar');
        blurStub = createSpy();
        focusStub = createSpy();
        onDayClickStub = createSpy();
        event = {
            currentTarget: {
                blur: blurStub,
                focus: focusStub
            },
            preventDefault: createSpy(),
            stopPropagation: createSpy()
        };
        props = { onDayClick: onDayClickStub };
        day = new Date(2018, 0, 20);
        const wrapper = shallow(<Calendar {...props} />, { disableLifecycleMethods: true });
        component = wrapper.instance();
        setStateStub = spyOn(component, 'setState');
    });

    describe('Calendar.prototype.handleDayClick', () => {
        it('should blur the day element if it is disabled', () => {
            component.handleDayClick(day, { disabled: true }, event);
            expect(blurStub).toHaveBeenCalledTimes(1);
        });

        it('should call onDayClick prop with selected day', () => {
            component.handleDayClick(day, {}, event);
            expect(onDayClickStub).toHaveBeenCalledWith(
                day,
                {
                    start: undefined,
                    end: undefined
                },
                event
            );
        });
    });

    describe('Calendar.prototype.handleDayKeyDown', () => {
        let focusDayStub;
        let handleDayClickStub;
        const keyConsts = require('utils/KeyConstants').default;

        beforeEach(() => {
            focusDayStub = spyOn(component, 'focusDay');
            handleDayClickStub = spyOn(component, 'handleDayClick');
        });
        it('should call focusDay with correct args when the RIGHT key was pressed', () => {
            event.key = keyConsts.RIGHT;
            component.handleDayKeyDown(day, {}, event);
            expect(focusDayStub).toHaveBeenCalledWith(event.currentTarget, day, calendarConstants.FOCUS.NEXT_DAY);
        });
        it('should call focusDay with correct args when the LEFT key was pressed', () => {
            event.key = keyConsts.LEFT;
            component.handleDayKeyDown(day, {}, event);
            expect(focusDayStub).toHaveBeenCalledWith(event.currentTarget, day, calendarConstants.FOCUS.PREV_DAY);
        });
        it('should call focusDay with correct args when the DOWN key was pressed', () => {
            event.key = keyConsts.DOWN;
            component.handleDayKeyDown(day, {}, event);
            expect(focusDayStub).toHaveBeenCalledWith(event.currentTarget, day, calendarConstants.FOCUS.NEXT_WEEK);
        });
        it('should call focusDay with correct args when the UP key was pressed', () => {
            event.key = keyConsts.UP;
            component.handleDayKeyDown(day, {}, event);
            expect(focusDayStub).toHaveBeenCalledWith(event.currentTarget, day, calendarConstants.FOCUS.PREV_WEEK);
        });
        it('should call handleDayClick method when the SPACE key was pressed', () => {
            event.key = keyConsts.SPACE;
            component.handleDayKeyDown(day, {}, event);
            expect(handleDayClickStub).toHaveBeenCalledTimes(1);
        });
        it('should set focus on the day when the SPACE key was pressed', () => {
            event.key = keyConsts.SPACE;
            component.handleDayKeyDown(day, {}, event);
            expect(focusStub).toHaveBeenCalledTimes(1);
        });
        it('should call focusPreviousWeek method when the ENTER key was pressed', () => {
            event.key = keyConsts.ENTER;
            component.handleDayKeyDown(day, {}, event);
            expect(handleDayClickStub).toHaveBeenCalledTimes(1);
        });
        it('should set focus on the day when the ENTER key was pressed', () => {
            event.key = keyConsts.SPACE;
            component.handleDayKeyDown(day, {}, event);
            expect(focusStub).toHaveBeenCalledTimes(1);
        });
        it('should not call preventDefault when TAB key was pressed', () => {
            event.key = keyConsts.TAB;
            component.handleDayKeyDown(day, {}, event);
            expect(event.preventDefault).not.toHaveBeenCalledTimes(1);
        });
    });

    describe('focus methods', () => {
        let nodes;
        let focusCurrentStub;
        let dayNodeIndexStub;
        let currentNode;
        let nodeListToArrayStub;
        let onNextMonthClickStub;
        let onPrevMonthClickStub;
        let getMonthDiffStub;

        beforeEach(() => {
            focusCurrentStub = createSpy();
            onNextMonthClickStub = spyOn(component, 'onNextMonthClick');
            onPrevMonthClickStub = spyOn(component, 'onPrevMonthClick');
            spyOn(component, 'preventEarlyFocus');
            currentNode = { focus: focusCurrentStub };
            nodeListToArrayStub = spyOn(calendarUtils, 'nodeListToArray');
            getMonthDiffStub = spyOn(dateUtils, 'getMonthDiff').and.returnValue(0);
            component.props = { monthsInView: 2 };
            component.state = {
                currentMonthGridIndex: 1,
                months: [
                    {
                        name: 'March',
                        index: 2
                    },
                    {
                        name: 'April',
                        index: 3
                    },
                    {
                        name: 'May',
                        index: 4
                    }
                ]
            };
        });

        describe('Calendar.prototype.focusDay', () => {
            describe('when focusing the previous day', () => {
                beforeEach(() => {
                    nodes = [{ focus: focusStub }, currentNode];
                    dayNodeIndexStub = spyOn(nodes, 'indexOf');
                    spyOn(calendarUtils, 'getDayNodes').and.returnValue(nodes);
                    nodeListToArrayStub.and.returnValue(nodes);
                });

                it('should not select the previous node if the current node is the first one', () => {
                    dayNodeIndexStub.and.returnValue(0);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.PREV_DAY);
                    expect(focusStub).not.toHaveBeenCalled();
                });

                it('should select the previous node if there is one', () => {
                    dayNodeIndexStub.and.returnValue(1);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.PREV_DAY);
                    expect(focusStub).toHaveBeenCalledTimes(1);
                });

                describe('and it is out of view', () => {
                    beforeEach(() => {
                        dayNodeIndexStub.and.returnValue(1);
                        getMonthDiffStub.and.returnValue(-1);
                    });

                    it('should call prevMonthClick', () => {
                        component.focusDay(currentNode, day, calendarConstants.FOCUS.PREV_DAY);
                        expect(onPrevMonthClickStub).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe('when focusing the previous week', () => {
                let anotherFocusStub;
                beforeEach(() => {
                    anotherFocusStub = createSpy();
                    nodes = [
                        { focus: focusStub }, // mon
                        { focus: anotherFocusStub }, // tue
                        { focus: anotherFocusStub }, // wed
                        { focus: anotherFocusStub }, // thu
                        { focus: anotherFocusStub }, // fri
                        { focus: anotherFocusStub }, // sat
                        { focus: anotherFocusStub }, // sun
                        currentNode // next mon
                    ];
                    dayNodeIndexStub = spyOn(nodes, 'indexOf');
                    spyOn(calendarUtils, 'getDayNodes').and.returnValue(nodes);
                    nodeListToArrayStub.and.returnValue(nodes);
                });

                it('should focus first node if the current node is within the first week', () => {
                    dayNodeIndexStub.and.returnValue(6);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.PREV_WEEK);
                    expect(focusStub).toHaveBeenCalledTimes(1);
                });

                it('should select the previous week node if there is one', () => {
                    dayNodeIndexStub.and.returnValue(7);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.PREV_WEEK);
                    expect(focusStub).toHaveBeenCalledTimes(1);
                });

                it('should not select a previous day node', () => {
                    dayNodeIndexStub.and.returnValue(7);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.PREV_WEEK);
                    expect(anotherFocusStub).not.toHaveBeenCalled();
                });

                describe('and it is out of view', () => {
                    beforeEach(() => {
                        dayNodeIndexStub.and.returnValue(7);
                        getMonthDiffStub.and.returnValue(-1);
                    });

                    it('should call prevMonthClick', () => {
                        component.focusDay(currentNode, day, calendarConstants.FOCUS.PREV_WEEK);
                        expect(onPrevMonthClickStub).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe('when focusing the next day', () => {
                beforeEach(() => {
                    nodes = [currentNode, { focus: focusStub }];
                    dayNodeIndexStub = spyOn(nodes, 'indexOf');
                    spyOn(calendarUtils, 'getDayNodes').and.returnValue(nodes);
                    nodeListToArrayStub.and.returnValue(nodes);
                });

                it('should not select the next node if the current node is the last one', () => {
                    dayNodeIndexStub.and.returnValue(1);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.NEXT_DAY);
                    expect(focusStub).not.toHaveBeenCalled();
                });

                it('should select the next node if there is one', () => {
                    dayNodeIndexStub.and.returnValue(0);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.NEXT_DAY);
                    expect(focusStub).toHaveBeenCalledTimes(1);
                });

                describe('and it is out of view', () => {
                    beforeEach(() => {
                        dayNodeIndexStub.and.returnValue(0);
                        getMonthDiffStub.and.returnValue(component.props.monthsInView);
                    });

                    it('should call nextMonthClick', () => {
                        component.focusDay(currentNode, day, calendarConstants.FOCUS.NEXT_DAY);
                        expect(onNextMonthClickStub).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe('when focusing the next week', () => {
                let anotherFocusStub;
                beforeEach(() => {
                    anotherFocusStub = createSpy();
                    nodes = [
                        currentNode, // mon
                        { focus: anotherFocusStub }, // tue
                        { focus: anotherFocusStub }, // wed
                        { focus: anotherFocusStub }, // thu
                        { focus: anotherFocusStub }, // fri
                        { focus: anotherFocusStub }, // sat
                        { focus: anotherFocusStub }, // sun
                        { focus: focusStub } // next mon
                    ];
                    dayNodeIndexStub = spyOn(nodes, 'indexOf');
                    spyOn(calendarUtils, 'getDayNodes').and.returnValue(nodes);
                    nodeListToArrayStub.and.returnValue(nodes);
                });

                it('should focus last node if the current node is within the last week', () => {
                    dayNodeIndexStub.and.returnValue(1);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.NEXT_WEEK);
                    expect(focusStub).toHaveBeenCalledTimes(1);
                });

                it('should select the next week node if there is one', () => {
                    dayNodeIndexStub.and.returnValue(0);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.NEXT_WEEK);
                    expect(focusStub).toHaveBeenCalledTimes(1);
                });

                it('should not select a next day node', () => {
                    dayNodeIndexStub.and.returnValue(0);
                    component.focusDay(currentNode, day, calendarConstants.FOCUS.NEXT_WEEK);
                    expect(anotherFocusStub).not.toHaveBeenCalled();
                });

                describe('and it is out of view', () => {
                    beforeEach(() => {
                        dayNodeIndexStub.and.returnValue(0);
                        getMonthDiffStub.and.returnValue(component.props.monthsInView);
                    });

                    it('should call onNextMonthClick', () => {
                        component.focusDay(currentNode, day, calendarConstants.FOCUS.NEXT_WEEK);
                        expect(onNextMonthClickStub).toHaveBeenCalledTimes(1);
                    });
                });
            });

            describe('Calendar.prototype.focusSelectedDay', () => {
                let daySelectedNodeStub;
                let getDaySelectedNodeStub;

                beforeEach(() => {
                    daySelectedNodeStub = { focus: focusStub };
                    getDaySelectedNodeStub = spyOn(calendarUtils, 'getDaySelectedNode').and.returnValue(daySelectedNodeStub);
                });

                it('should focus the selected day', () => {
                    component.focusSelectedDay();
                    expect(focusStub).toHaveBeenCalledTimes(1);
                });

                it('should not focus the selected day if the node doesnt exist', () => {
                    getDaySelectedNodeStub.and.returnValue(null);
                    component.focusSelectedDay();
                    expect(focusStub).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('Calendar.prototype.onNextMonthClick', () => {
        let prevStateStub;

        beforeEach(() => {
            prevStateStub = {
                currentMonthGridIndex: 0,
                hasNavigation: true
            };
            component.state = {
                currentMonthGridIndex: 0,
                hasNavigation: true
            };
            component.props = {
                ...component.props,
                maxMonths: 4,
                monthsInView: 2
            };
        });

        it('should call setState with correct args', () => {
            // Arrange
            component.preventEarlyFocus = () => {};

            // Act
            component.onNextMonthClick();

            // Assert
            expect(setStateStub.calls.argsFor(0)[0](prevStateStub)).toEqual(
                {
                    currentMonthGridIndex: 1,
                    isMonthTransitioning: true
                },
                any(Function)
            );
        });

        it('should not call setState if the month is the last one', () => {
            component.state = { currentMonthGridIndex: 2 };
            component.onNextMonthClick();
            expect(setStateStub).not.toHaveBeenCalled();
        });
    });

    describe('Calendar.prototype.onPrevMonthClick', () => {
        let prevStateStub;

        beforeEach(() => {
            prevStateStub = {
                currentMonthGridIndex: 1,
                hasNavigation: true
            };
            component.state = {
                currentMonthGridIndex: 1,
                hasNavigation: true
            };
            component.props = {
                ...component.props,
                maxMonths: 2
            };
        });

        it('should call setState with correct args', () => {
            component.preventEarlyFocus = () => {};
            component.onPrevMonthClick();
            expect(setStateStub.calls.argsFor(0)[0](prevStateStub)).toEqual({
                currentMonthGridIndex: 0,
                isMonthTransitioning: true
            });
        });

        it('should not call setState if the month is the first one', () => {
            component.state = { currentMonthGridIndex: 0 };
            component.onPrevMonthClick();
            expect(setStateStub).not.toHaveBeenCalled();
        });
    });
});
