// const React = require('react');
// const { shallow } = require('enzyme');
// const CustomRange = require('components/Catalog/Filters/CustomRange/CustomRange').default;

// describe('<CustomRange />', () => {
//     let props;
//     let wrapper;
//     let component;
//     let eventStub;
//     let onClickSpy;

//     beforeEach(() => {
//         props = {
//             checked: false,
//             isModal: false,
//             name: 'pricerange',
//             value: 'pl=min&ph=max&ptype=manual',
//             valueStatus: 1,
//             onClick: () => {}
//         };
//         onClickSpy = spyOn(props, 'onClick');
//         eventStub = {
//             target: {
//                 name: 'name',
//                 value: 'value'
//             }
//         };
//         wrapper = shallow(<CustomRange {...props} />);
//         component = wrapper.instance();
//         component.minRef = { focus: () => {} };
//     });

//     describe('isValid()', () => {
//         it('shoud return false if both min and max are empty', () => {
//             const isValid = component.isValid();

//             expect(isValid).toEqual(false);
//         });

//         it('shoud return true if min is not empty', () => {
//             wrapper.setState({ min: '10' });

//             const isValid = component.isValid();

//             expect(isValid).toEqual(true);
//         });

//         it('shoud return true if max is not empty', () => {
//             wrapper.setState({ max: '20' });

//             const isValid = component.isValid();

//             expect(isValid).toEqual(true);
//         });
//     });

//     describe('formatValue()', () => {
//         it('should return empty if value is empty', () => {
//             const formatedValue = component.formatValue('');

//             expect(formatedValue).toEqual('');
//         });

//         it('should return empty if value is \'$\'', () => {
//             const formatedValue = component.formatValue('$');

//             expect(formatedValue).toEqual('');
//         });

//         it('should return prev value if new value is not number', () => {
//             const prevValue = '$10';

//             const formatedValue = component.formatValue('fda', prevValue);

//             expect(formatedValue).toEqual(prevValue);
//         });

//         it('should return new value if new value is number', () => {
//             const prevValue = '$10';
//             const newValue = '$20';

//             const formatedValue = component.formatValue(newValue, prevValue);

//             expect(formatedValue).toEqual(newValue);
//         });
//     });

//     describe('handleClick()', () => {
//         it('sholud not apply params if they are not valid, but set focus to min input', () => {
//             const applyNewParamsSpy = spyOn(component, 'applyNewParams');
//             const minFocusSpy = spyOn(component.minRef, 'focus');

//             component.handleClick(eventStub);

//             expect(applyNewParamsSpy).toHaveBeenCalledTimes(0);
//             expect(minFocusSpy).toHaveBeenCalledTimes(1);
//         });

//         it('sholud apply params in min-max order if min <= max', () => {
//             const applyNewParamsSpy = spyOn(component, 'applyNewParams');
//             const state = {
//                 min: '$10',
//                 max: '$20'
//             };
//             wrapper.setState(state);

//             component.handleClick(eventStub);

//             expect(applyNewParamsSpy).toHaveBeenCalledWith(eventStub, state.min, state.max);
//         });

//         it('sholud apply params in max-min order if min > max', () => {
//             const applyNewParamsSpy = spyOn(component, 'applyNewParams');
//             const state = {
//                 min: '$100',
//                 max: '$20'
//             };
//             wrapper.setState(state);

//             component.handleClick(eventStub);

//             expect(applyNewParamsSpy).toHaveBeenCalledWith(eventStub, state.max, state.min);
//         });
//     });

//     describe('applyNewParams()', () => {
//         it('should call parrent onClick callback with a valid args when both values set', () => {
//             const refinement = {
//                 refinementValue: 'pl=10&ph=20&ptype=manual',
//                 refinementValueDisplayName: '10-20',
//                 refinementValueStatus: 1
//             };

//             component.applyNewParams(eventStub, '$10', '$20');

//             expect(onClickSpy).toHaveBeenCalledWith(eventStub, refinement);
//         });

//         it('should call parrent onClick callback with a valid args when only min value set', () => {
//             const refinement = {
//                 refinementValue: 'pl=10&ph=max&ptype=manual',
//                 refinementValueDisplayName: '10-0',
//                 refinementValueStatus: 1
//             };

//             component.applyNewParams(eventStub, '$10', '');

//             expect(onClickSpy).toHaveBeenCalledWith(eventStub, refinement);
//         });

//         it('should call parrent onClick callback with a valid args when only max value set', () => {
//             const refinement = {
//                 refinementValue: 'pl=min&ph=20&ptype=manual',
//                 refinementValueDisplayName: '0-20',
//                 refinementValueStatus: 1
//             };

//             component.applyNewParams(eventStub, '', '$20');

//             expect(onClickSpy).toHaveBeenCalledWith(eventStub, refinement);
//         });
//     });

//     describe('Radio', () => {
//         it('should be unselected if props.checked is not true', () => {
//             const radio = wrapper.findWhere(x => x.name() === 'Radio' && x.prop('checked') === false);
//             expect(radio.exists()).toBeTruthy();
//         });

//         it('should be selected if props.checked is true', () => {
//             wrapper.setProps({ checked: true });
//             const radio = wrapper.findWhere(x => x.name() === 'Radio' && x.prop('checked') === true);
//             expect(radio.exists()).toBeTruthy();
//         });

//         it('onClick should call handleClick', () => {
//             const handleClickSpy = spyOn(component, 'handleClick');
//             const radio = wrapper.findWhere(x => x.name() === 'Radio');

//             radio.simulate('click', eventStub);

//             expect(handleClickSpy).toHaveBeenCalledWith(eventStub);
//         });
//     });

//     describe('Min TextInput', () => {
//         it('onChange should set min into state', () => {
//             eventStub.target.value = '$10';
//             const textInput = wrapper.findWhere(x => x.name() === 'TextInput' && x.prop('placeholder') === '$ Min');

//             textInput.simulate('change', eventStub);

//             expect(wrapper.state('min')).toEqual(eventStub.target.value);
//         });
//     });

//     describe('Max TextInput', () => {
//         it('onChange should set max into state', () => {
//             eventStub.target.value = '$20';
//             const textInput = wrapper.findWhere(x => x.name() === 'TextInput' && x.prop('placeholder') === '$ Max');

//             textInput.simulate('change', eventStub);

//             expect(wrapper.state('max')).toEqual(eventStub.target.value);
//         });
//     });

//     describe('Button', () => {
//         it('should be disabled when values are not valid', () => {
//             const button = wrapper.findWhere(x => x.name() === 'Button' && x.prop('disabled') === true);
//             expect(button.exists()).toBeTruthy();
//         });

//         it('should be enabled when values are valid', () => {
//             wrapper.setState({ min: '10' });

//             const button = wrapper.findWhere(x => x.name() === 'Button' && x.prop('disabled') === false);
//             expect(button.exists()).toBeTruthy();
//         });

//         it('onClick should call handleClick', () => {
//             const handleClickSpy = spyOn(component, 'handleClick');
//             wrapper.setState({ min: '10' });
//             const button = wrapper.findWhere(x => x.name() === 'Button');

//             button.simulate('click', eventStub);

//             expect(handleClickSpy).toHaveBeenCalledWith(eventStub);
//         });
//     });
// });
