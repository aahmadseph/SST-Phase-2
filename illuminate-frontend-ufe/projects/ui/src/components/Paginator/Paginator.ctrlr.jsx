import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors, space } from 'style/config';
import { Box, Flex, Link } from 'components/ui';
import Chevron from 'components/Chevron/Chevron';

const FIRST_PAGE = 1;

class Paginator extends BaseClass {
    state = {
        currentPage: parseInt(this.props.currentPage, 10),
        pagesArray: []
    };

    componentDidMount() {
        const currentPage = parseInt(this.props.currentPage, 10);
        this.setPagesArray(currentPage);
        this.setState({ currentPage });
        this.setArrowsDisplay(currentPage);
    }

    getTotalPagesNumber = () => {
        return Math.ceil(this.props.totalItems / this.props.itemsPerPage);
    };

    setPagesArray = currentPage => {
        const pagesArray = this.getPreviousPagesArray(currentPage)
            .concat(currentPage)
            .concat(this.getNextPagesArray(currentPage, this.getTotalPagesNumber()));

        this.setState({ pagesArray });
    };

    getPreviousPagesArray = currentPage => {
        var previousPage = currentPage - 1;

        if (currentPage === FIRST_PAGE) {
            return [];
        }

        if (previousPage > 2) {
            return [1, null, previousPage];
        }

        if (previousPage === 2) {
            return [1, previousPage];
        }

        return [1];
    };

    getNextPagesArray = (currentPage, totalPages) => {
        var nextPage = currentPage + 1;
        var toLastPage = totalPages - currentPage;

        if (currentPage === totalPages) {
            return [];
        }

        if (nextPage === totalPages) {
            return [nextPage];
        }

        if (currentPage === FIRST_PAGE) {
            if (nextPage + 1 === totalPages) {
                return [nextPage, totalPages];
            }

            return [nextPage, nextPage + 1, null, totalPages];
        }

        if (toLastPage > 2) {
            return [nextPage, null, totalPages];
        }

        if (toLastPage <= 2) {
            return [nextPage, totalPages];
        }

        return [totalPages];
    };

    navigateToPage = currentPage => {
        if (currentPage === 0 || currentPage > this.getTotalPagesNumber()) {
            return;
        }

        if (typeof currentPage === 'number') {
            this.updateUI(currentPage);

            if (this.props.onNavigate) {
                this.props.onNavigate(currentPage);
            }
        }
    };

    updateUI = currentPage => {
        this.setState({ currentPage });
        this.setPagesArray(currentPage);
        this.setArrowsDisplay(currentPage);
    };

    componentWillReceiveProps = nextProps => {
        if (nextProps.currentPage) {
            this.updateUI(parseInt(nextProps.currentPage, 10));
        }
    };

    setArrowsDisplay = currentPage => {
        this.setState({
            showPreviousArrow: false,
            showNextArrow: false
        });

        if (currentPage > FIRST_PAGE) {
            this.setState({ showPreviousArrow: true });
        }

        if (currentPage < this.getTotalPagesNumber()) {
            this.setState({ showNextArrow: true });
        }
    };

    render() {
        const { showPreviousArrow, showNextArrow } = this.state;

        return (
            <nav aria-label={this.props.label}>
                <Flex
                    is='ul'
                    justifyContent='center'
                    alignItems='center'
                >
                    <li>
                        <Box
                            aria-label='Previous'
                            {...itemStyleProps}
                            color={showPreviousArrow || 'midGray'}
                            disabled={!showPreviousArrow}
                            onClick={() => this.navigateToPage(this.state.currentPage - 1)}
                        >
                            <Chevron direction='left' />
                        </Box>
                    </li>
                    {this.state.pagesArray.map((item, index) => {
                        const isActive = item === this.state.currentPage;
                        let element;

                        if (item !== null) {
                            element = (
                                <Link
                                    onClick={() => this.navigateToPage(item)}
                                    {...itemStyleProps}
                                    css={[
                                        { borderRadius: 9999 },
                                        isActive && {
                                            backgroundColor: colors.black,
                                            fontWeight: 'var(--font-weight-bold)',
                                            color: colors.white
                                        }
                                    ]}
                                    children={item}
                                />
                            );
                        } else {
                            element = (
                                <Flex
                                    aria-hidden
                                    alignItems='center'
                                    justifyContent='center'
                                    {...itemStyleProps}
                                    children='...'
                                />
                            );
                        }

                        return <li key={index.toString()}>{element}</li>;
                    })}
                    <Box
                        aria-label='Next'
                        {...itemStyleProps}
                        color={showNextArrow || 'midGray'}
                        disabled={!showNextArrow}
                        onClick={() => this.navigateToPage(this.state.currentPage + 1)}
                    >
                        <Chevron direction='right' />
                    </Box>
                </Flex>
            </nav>
        );
    }
}

const itemStyleProps = {
    width: space[5],
    height: space[5],
    textAlign: 'center',
    marginX: 2,
    lineHeight: 'none'
};

export default wrapComponent(Paginator, 'Paginator', true);
