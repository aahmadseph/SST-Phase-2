import React from 'react';
import store from 'Store';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Flex, Link } from 'components/ui';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import Modal from 'components/Modal/Modal';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import languageLocale from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import ProductActions from 'actions/ProductActions';
import * as PRODUCT_SORT_OPTIONS from 'components/Product/ProductSort/ProductSortOptions';

const getText = languageLocale.getLocaleResourceFile('components/Product/ProductSort/locales', 'ProductSort');

class ProductSort extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isActive: false
        };
    }

    render() {
        const isMobile = Sephora.isMobile();
        const { selectedOption } = this.state;
        const {
            sortOptions, currentSortSelected, mobileLinkProps, ariaDescribedById, ariaDescribedByText
        } = this.props;
        const sortCode = currentSortSelected || (selectedOption && selectedOption.code);
        const currentSortOptionDisplayName = this.getSortOptionDisplayNameByCode(sortCode);

        const options = [];
        sortOptions.forEach(option => {
            options.push({
                children: option.name,
                code: option.code,
                onClick: () => this.handleSelect(option.code, option.name),
                isActive: selectedOption && option.code === selectedOption.code
            });
        });

        return isMobile ? (
            <div>
                <Link
                    {...mobileLinkProps}
                    data-at={Sephora.debug.dataAt('sort_by_button')}
                    onClick={() => this.activateSelect()}
                    aria-describedby={ariaDescribedById}
                >
                    {getText('sortBy') + ': '}
                    <b>{currentSortOptionDisplayName}</b>
                    {ariaDescribedById && ariaDescribedByText && (
                        <span
                            id={ariaDescribedById}
                            style={{ display: 'none' }}
                            children={ariaDescribedByText}
                        />
                    )}
                </Link>
                <Modal
                    isOpen={this.state.isActive}
                    onDismiss={this.dismissSelect}
                >
                    <Modal.Header>
                        <Modal.Title>{getText('sortBy')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body data-at={Sephora.debug.dataAt('sorting_menu')}>
                        {options.map(option => (
                            <Link
                                data-at={Sephora.debug.dataAt('sort_option')}
                                key={option.code}
                                onClick={option.onClick}
                                fontWeight={option.isActive && 'bold'}
                                display='block'
                                width='100%'
                                paddingY={3}
                            >
                                <Flex
                                    is='span'
                                    alignItems='baseline'
                                >
                                    {option.children}
                                    {option.isActive && <IconCheckmark marginLeft={2} />}
                                </Flex>
                            </Link>
                        ))}
                    </Modal.Body>
                </Modal>
            </div>
        ) : (
            <ActionMenu
                id='sort_menu'
                align='right'
                options={options}
                ariaDescribedById={ariaDescribedById}
                ariaDescribedByText={ariaDescribedByText}
                triggerDataAt={Sephora.debug.dataAt('sort_by_button')}
                menuDataAt={Sephora.debug.dataAt('sorting_menu')}
                menuItemDataAt={Sephora.debug.dataAt('sort_option')}
            >
                {getText('sortBy') + ': '}
                <b>{currentSortOptionDisplayName}</b>
            </ActionMenu>
        );
    }

    componentDidMount() {
        const filterByParam = urlUtils.getParamValueAsSingleString('filterby');

        if (!this.state.selectedOption) {
            this.setState({ selectedOption: this.props.sortOptions[0] });
        }

        if (filterByParam === 'rewards') {
            this.setState({ selectedOption: PRODUCT_SORT_OPTIONS.RECENTLY });
        }

        store.watchAction(ProductActions.TYPES.SELECT_SORT_OPTION, data => {
            this.setState({
                selectedOption: {
                    code: data.sortOption.code,
                    name: data.sortOption.name
                }
            });
        });
    }

    activateSelect = () => {
        this.setState({ isActive: true });
    };

    dismissSelect = () => {
        this.setState({ isActive: false });
    };

    handleSelect = (sortOptionCode, sortOptionName) => {
        store.dispatch(ProductActions.selectSortOption(sortOptionCode, sortOptionName));
        this.dismissSelect();
    };

    getSortOptionDisplayNameByCode = sortOptionCode => {
        const sortOptionData = this.props.sortOptions.filter(item => item.code === sortOptionCode)[0];

        return sortOptionData && sortOptionData.name;
    };
}

export default wrapComponent(ProductSort, 'ProductSort', true);
