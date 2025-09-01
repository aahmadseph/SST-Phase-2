const React = require('react');
const { shallow } = require('enzyme');

describe('Paginator component', () => {
    let Paginator;

    beforeEach(() => {
        Paginator = require('components/Paginator/Paginator').default;
    });

    it('Paginator.prototype.getTotalPagesNumber calculate the amount of pages', () => {
        const props = {
            currentPage: 1,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        expect(component.getTotalPagesNumber()).toEqual(11);
    });

    it('Paginator.prototype.getPreviousPagesArray should return an empty array for previous pages when currentPage = 1', () => {
        const props = {
            currentPage: 1,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        const previousPagesArray = component.getPreviousPagesArray(1);

        expect(previousPagesArray).toEqual([]);
    });

    it('Paginator.prototype.getPreviousPagesArray should return [1, 2] when currentPage = 3', () => {
        const props = {
            currentPage: 3,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        const previousPagesArray = component.getPreviousPagesArray(3);

        expect(previousPagesArray).toEqual([1, 2]);
    });

    it('Paginator.prototype.getPreviousPagesArray should return [1, ..., previousPageNumber] when currentPage > 3', () => {
        const props = {
            currentPage: 3,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        const previousPagesArray = component.getPreviousPagesArray(5);

        expect(previousPagesArray).toEqual([1, null, 4]);
    });

    it('Paginator.prototype.getNextPagesArray should return [] when currentPage is the last one', () => {
        const props = {
            currentPage: 11,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        const nextPagesArray = component.getNextPagesArray(11, 11);

        expect(nextPagesArray).toEqual([]);
    });

    it('Paginator.prototype.getNextPagesArray should return [lastPage] when currentPage is the penultimate one', () => {
        const props = {
            currentPage: 10,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        const nextPagesArray = component.getNextPagesArray(10, 11);

        expect(nextPagesArray).toEqual([11]);
    });

    it('Paginator.prototype.getNextPagesArray should return [penultimate, lastPage] when currentPage is the antepenultimate', () => {
        const props = {
            currentPage: 9,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        const nextPagesArray = component.getNextPagesArray(9, 11);

        expect(nextPagesArray).toEqual([10, 11]);
    });

    it('Paginator.prototype.getNextPagesArray should return [next, ..., lastPage] when currentPage < antepenultimate', () => {
        const props = {
            currentPage: 8,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        const nextPagesArray = component.getNextPagesArray(7, 11);

        expect(nextPagesArray).toEqual([8, null, 11]);
    });

    it('Paginator.prototype.setArrowsDisplay When currentPage = 1, disable PREVIOUS arrow', () => {
        const props = {
            currentPage: 1,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        component.setArrowsDisplay(1);

        expect(component.state.showPreviousArrow).toEqual(false);
        expect(component.state.showNextArrow).toEqual(true);
    });

    it('Paginator.prototype.setArrowsDisplay When currentPage = last, disable NEXT arrow', () => {
        const props = {
            currentPage: 11,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        component.setArrowsDisplay(11);

        expect(component.state.showPreviousArrow).toEqual(true);
        expect(component.state.showNextArrow).toEqual(false);
    });

    it('Paginator.prototype.setArrowsDisplay When currentPage is not last nor first, and there are more than 3 pages, enable both arrows', () => {
        const props = {
            currentPage: 5,
            totalItems: 105,
            itemsPerPage: 10
        };
        const wrapper = shallow(<Paginator {...props} />);
        const component = wrapper.instance();

        component.setArrowsDisplay(5);

        expect(component.state.showPreviousArrow).toEqual(true);
        expect(component.state.showNextArrow).toEqual(true);
    });
});
