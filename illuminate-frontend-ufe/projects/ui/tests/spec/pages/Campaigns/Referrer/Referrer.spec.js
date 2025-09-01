/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');

describe('Referrer page', () => {
    let Referrer;
    let wrapper;

    beforeEach(() => {
        Referrer = require('pages/Campaigns/Referrer').default;
    });

    it('should display the landing page', () => {
        wrapper = shallow(<Referrer />);
        expect(wrapper.find('Referrer').length).toEqual(1);
    });
});
