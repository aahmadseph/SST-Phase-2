import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Flex, Link } from 'components/ui';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import Modal from 'components/Modal/Modal';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import urlUtils from 'utils/Url';
import historyService from 'services/History';
import ProductActions from 'actions/ProductActions';
import * as PURCHASES_FILTER_OPTIONS from 'components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilterOptions';

const { getLocaleResourceFile } = localeUtils;

class PurchasesFilter extends BaseClass {
    state = {
        isActive: false
    };

    componentDidMount() {
        const filterByParam = urlUtils.getParamValueAsSingleString('filterby');

        if (!this.state.selectedOption) {
            this.setState({ selectedOption: this.props.filterOptions[0] });
        }

        if (filterByParam === 'rewards') {
            this.setState({ selectedOption: PURCHASES_FILTER_OPTIONS.REWARDS });
        }

        store.watchAction(ProductActions.TYPES.SELECT_FILTER_OPTION, data => {
            this.setState({
                selectedOption: {
                    code: data.filterOption.code,
                    name: data.filterOption.name
                }
            });
        });
    }

    handleModal = () => {
        this.setState({ isActive: !this.state.isActive });
    };

    handleSelect = (filterOptionCode, filterOptionName) => {
        const filterByParam = urlUtils.getParamValueAsSingleString('filterby');

        if (filterByParam && filterOptionCode !== 'rewards') {
            const location = historyService.normalizeLocation({
                path: '/purchase-history',
                queryParams: {}
            });

            historyService.replaceLocation(location);
        }

        store.dispatch(ProductActions.selectFilterOption(filterOptionCode, filterOptionName));

        if (Sephora.isMobile()) {
            this.handleModal();
        }
    };

    getFilterOptionDisplayNameByCode = filterOptionCode => {
        const filterOptionData = this.props.filterOptions.filter(item => item.code === filterOptionCode)[0];

        return filterOptionData && filterOptionData.name;
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/PurchaseHistoryList/PurchasesFilter/locales', 'PurchasesFilter');
        const isMobile = Sephora.isMobile();
        const { selectedOption } = this.state;
        const {
            filterOptions, currentFilterSelected, mobileLinkProps, ariaDescribedById, ariaDescribedByText
        } = this.props;
        const filterCode = currentFilterSelected || (selectedOption && selectedOption.code);
        const currentFilterOptionDisplayName = this.getFilterOptionDisplayNameByCode(filterCode);

        const options = [];
        filterOptions.forEach(option => {
            options.push({
                code: option.code,
                children: option.name,
                onClick: () => this.handleSelect(option.code, option.name),
                isActive: selectedOption && option.code === selectedOption.code
            });
        });

        return isMobile ? (
            <React.Fragment>
                <Link
                    {...mobileLinkProps}
                    onClick={() => this.handleModal()}
                    aria-describedby={ariaDescribedById}
                >
                    {getText('filterBy') + ': '}
                    <b>{currentFilterOptionDisplayName}</b>
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
                    onDismiss={this.handleModal}
                >
                    <Modal.Header>
                        <Modal.Title>{getText('filterBy')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {options.map(option => (
                            <Link
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
            </React.Fragment>
        ) : (
            <ActionMenu
                id='filter_menu'
                align='right'
                options={options}
                ariaDescribedById={ariaDescribedById}
                ariaDescribedByText={ariaDescribedByText}
            >
                {getText('filterBy') + ': '}
                <b>{currentFilterOptionDisplayName}</b>
            </ActionMenu>
        );
    }
}

export default wrapComponent(PurchasesFilter, 'PurchasesFilter', true);
