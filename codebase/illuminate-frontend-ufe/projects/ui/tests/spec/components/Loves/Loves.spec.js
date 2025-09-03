const React = require('react');
const { shallow } = require('enzyme');

describe('Loves component', () => {
    let Loves;
    let component;

    describe('watch loves list interactions', () => {
        beforeEach(() => {
            Loves = require('components/Loves/Loves').default;
            const props = {
                maxLoves: 2,
                currentLoves: [{ shoppingListItemiId: '1' }, { shoppingListItemiId: '2' }, { shoppingListItemiId: '3' }, { shoppingListItemiId: '4' }]
            };
            const wrapper = shallow(<Loves {...props} />);
            component = wrapper.instance();
        });

        it('should slice loves list to max length', () => {
            expect(component.state.loves.length).toEqual(2);
        });
    });
});
