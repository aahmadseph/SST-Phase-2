import React from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import {
    Box, Grid, Button, Icon
} from 'components/ui';
import Empty from 'constants/empty';
import Radio from 'components/Inputs/Radio/Radio';
import Modal from 'components/Modal/Modal';
import Pill from 'components/Pill';
import { fontSizes } from 'style/config';

class MyListsSort extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            actionToSort: null,
            sortOptions: []
        };
    }

    componentDidMount() {
        this.setState({
            sortOptions: this.props.options
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.options !== this.props.options) {
            this.setState({
                sortOptions: this.props.options
            });
        }
    }

    requestClose = () => {
        this.setState({ isOpen: false, sortOptions: this.props.options });
    };

    handleSort = () => {
        if (typeof this.state.actionToSort === 'function') {
            this.state.actionToSort();
            this.requestClose();
        }
    };

    handleClick = option => {
        this.setState({
            actionToSort: option.onClick,
            sortOptions: this.state.sortOptions.map(sortOption => ({
                ...sortOption,
                isActive: sortOption.code === option.code
            }))
        });
    };

    openModal = () => {
        this.setState({ isOpen: true });
    };

    render() {
        const { sortText, sortBy, cancel, isActive } = this.props;

        return (
            <Box>
                <Pill
                    fontSize={[fontSizes.sm, fontSizes.base]}
                    onClick={this.openModal}
                    isActive={isActive}
                >
                    {sortText + ': ' + sortBy}
                    <Icon
                        className='Accordion-icon'
                        name={'caretDown'}
                        size={15}
                        marginLeft={1}
                    />
                </Pill>
                <Modal
                    isOpen={this.state.isOpen}
                    onDismiss={this.requestClose}
                    width={0}
                    isDrawer={true}
                >
                    <Modal.Header>
                        <Modal.Title>{sortText}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        lineHeight='tight'
                        paddingBottom={2}
                    >
                        {this.state.sortOptions?.map((option, index) => (
                            <Radio
                                key={option.children || index}
                                display='inline-block'
                                width='100%'
                                role='menuitem'
                                paddingY={2}
                                paddingX={5}
                                checked={option.isActive}
                                css={{ whiteSpace: 'nowrap', display: 'flex', paddingLeft: '0px', marginBottom: '3px' }}
                                aria-current={option.isActive ? true : null}
                                fontWeight={option.isActive && 'bold'}
                                onKeyDown={e => this.handleKeyDown(e, index)}
                                {...option}
                                onClick={() => this.handleClick(option)}
                            >
                                <span children={option.children} />
                            </Radio>
                        ))}
                    </Modal.Body>
                    <Modal.Footer
                        marginTop={2}
                        hasBorder={false}
                        paddingX={[3, 3]}
                    >
                        <Grid gap={4}>
                            <Button
                                onClick={this.handleSort}
                                variant='primary'
                            >
                                {sortText}
                            </Button>
                            <Button
                                onClick={this.requestClose}
                                variant='secondary'
                            >
                                {cancel}
                            </Button>
                        </Grid>
                    </Modal.Footer>
                </Modal>
            </Box>
        );
    }
}

MyListsSort.defaultProps = {
    sortText: '',
    sortBy: '',
    cancel: '',
    options: Empty.Array
};

MyListsSort.propTypes = {
    sortText: PropTypes.string,
    sortBy: PropTypes.string,
    cancel: PropTypes.string,
    options: PropTypes.array
};

export default wrapComponent(MyListsSort, 'MyListsSort');
