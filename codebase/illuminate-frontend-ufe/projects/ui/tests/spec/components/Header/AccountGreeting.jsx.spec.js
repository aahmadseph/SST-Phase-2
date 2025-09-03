// const React = require('react');
// // eslint-disable-next-line object-curly-newline
// const {
//     shallow, mount
// } = require('enzyme');
// const AccountGreeting = require('components/Header/AccountGreeting/AccountGreeting').default;
// const userUtils = require('utils/User').default;

/*
describe('AccountGreeting component', () => {
    let wrapper;
    let component;
    let name = 'Beautiful';

    describe('getTimeOfDayMessage', () => {
        let dateObj;

        beforeEach(() => {
            dateObj = new Date();
            wrapper = shallow(<AccountGreeting />);
            component = wrapper.instance();
        });

        describe('in the morning', () => {
            it('return correct val for the lower boundary', () => {
                dateObj.setHours(0);
                dateObj.setMinutes(0);
                expect(component.getTimeOfDayMessage(dateObj, name)).toEqual('Good morning, Beautiful. ☀️');
            });

            it('return correct val for the upper boundary', () => {
                dateObj.setHours(11);
                dateObj.setMinutes(59);
                expect(component.getTimeOfDayMessage(dateObj, name)).toEqual('Good morning, Beautiful. ☀️');
            });
        });

        describe('in the afternoon', () => {
            it('return correct val for the lower boundary', () => {
                dateObj.setHours(12);
                dateObj.setMinutes(0);
                expect(component.getTimeOfDayMessage(dateObj, name)).toEqual('Good afternoon, Beautiful. 👋');
            });

            it('return correct val for the upper boundary', () => {
                dateObj.setHours(17);
                dateObj.setMinutes(0);
                expect(component.getTimeOfDayMessage(dateObj, name)).toEqual('Good afternoon, Beautiful. 👋');
            });
        });

        describe('in the evening', () => {
            it('return correct val for the lower boundary', () => {
                dateObj.setHours(17);
                dateObj.setMinutes(1);
                expect(component.getTimeOfDayMessage(dateObj, name)).toEqual('Good evening, Beautiful. 🌙');
            });

            it('return correct val for the upper boundary', () => {
                dateObj.setHours(23);
                dateObj.setMinutes(59);
                expect(component.getTimeOfDayMessage(dateObj, name)).toEqual('Good evening, Beautiful. 🌙');
            });
        });

        it('should return empty string on malformed args', () => {
            expect(component.getTimeOfDayMessage()).toEqual('');
        });
    });

    describe('getDayOfWeekMessages', () => {
        let dateObj;

        const setDayOffWeek = (date, dow) => date.setDate(date.getDate() - date.getDay() + dow);

        const messages = [
            ['Sunday Funday, Beautiful. 🎉'],
            ['New week, new you, Beautiful. 🙌'],
            [], [], [],
            ['Happy Friday, Beautiful. 🎉', 'Hi Beautiful, Hello Friday! 🤩'],
            ['Happy weekend, Beautiful. 🙌', 'Cheers to the weekend, Beautiful. 💋']
        ];

        beforeEach(() => {
            dateObj = new Date();
            wrapper = shallow(<AccountGreeting />);
            component = wrapper.instance();
        });

        it('should return correct message(s) for all days of week', () => {
            for (let i = 0; i < messages.length; i++) {
                dateObj = new Date();
                setDayOffWeek(dateObj, i);
                expect(component.getDayOfWeekMessages(dateObj, name)).toEqual(messages[i]);
            }
        });

        it('should return empty array on malformed args', () => {
            expect(component.getDayOfWeekMessages()).toEqual([]);
        });
    });

    describe('getRegularGreetingMsg', () => {
        let getDayOfWeekMessagesStub;
        let getTimeOfDayMessageStub;

        beforeEach(() => {
            wrapper = shallow(<AccountGreeting />);
            component = wrapper.instance();
            getTimeOfDayMessageStub = spyOn(component, 'getTimeOfDayMessage');
            getTimeOfDayMessageStub.and.returnValue('q');
            getDayOfWeekMessagesStub = spyOn(component, 'getDayOfWeekMessages');
            getDayOfWeekMessagesStub.and.returnValue(['p', 's']);
        });

        it('should call getTimeOfDayMessage', () => {
            component.getRegularGreetingMsg(name);
            expect(getTimeOfDayMessageStub).toHaveBeenCalledTimes(1);
        });

        it('should call getTimeOfDayMessage', () => {
            component.getRegularGreetingMsg(name);
            expect(getTimeOfDayMessageStub).toHaveBeenCalledTimes(1);
        });

        it('should return one of the allowed messages', () => {
            expect(
                ['q', 'p', 's'].indexOf(component.getRegularGreetingMsg(name))
            ).not.toEqual(-1);
        });
    });

    describe('personal messages', () => {
        let getDayOfWeekMessagesStub;
        let getTimeOfDayMessageStub;
        const getMessage = comp => comp.find('[data-at="person_greeting"]').prop('children');

        beforeEach(() => {
            getTimeOfDayMessageStub = spyOn(component, 'getTimeOfDayMessage');
            getTimeOfDayMessageStub.and.returnValue('q');
            getDayOfWeekMessagesStub = spyOn(component, 'getDayOfWeekMessages');
            getDayOfWeekMessagesStub.and.returnValue(['p', 's']);
            wrapper = shallow(<AccountGreeting />);
        });

        describe('birthday message', () => {
            beforeEach(() => {
                wrapper = mount(<AccountGreeting />);
                wrapper.setState({
                    isAnonymous: false,
                    isBirthdayGiftEligible: true
                });
            });

            it('should render birthday message if eligibleForBirthdayGift', () => {
                expect(getMessage(wrapper)).toEqual('Happy Birthday, Beautiful! 🎁🎂🎉');
            });
        });

        describe('regular message', () => {
            beforeEach(() => {
                wrapper = mount(<AccountGreeting />);
                component = wrapper.instance();
                spyOn(component, 'getRegularGreetingMsg').and.returnValue('987');
                wrapper.setState({
                    isBirthdayGiftEligible: false
                });
            });

            it('should render birthday message if eligibleForBirthdayGift', () => {
                expect(getMessage(wrapper)).toEqual('987');
            });
        });
    });
});
*/
