/* eslint-disable ssr-friendly/no-dom-globals-in-react-fc */
import { useState, useRef } from 'react';
import { getSkuDetails, addToCart } from 'utils/api';
import { useOnOutsideClick } from 'hooks/useOnOutsideClick';
import SearchIcon from 'assets/Icons/SearchIcon';
import CloseIcon from 'assets/Icons/CloseIcon';

const Search = () => {
    const [sku, setSku] = useState({});
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formContainerRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchValueIsEmpty = searchValue.length === 0;
    const refreshBasketButton = document.getElementById('agent-aware-refresh-basket');

    const handleFocus = hasFocus => setIsFocused(hasFocus);

    const handleSearchChange = event => {
        handleResetSearch();
        setSearchValue(event.target.value.split(' ').join(''));
    };

    const handleSearchSubmit = event => {
        if (event.key === 'Enter') {
            setIsError(false);

            if (!searchValueIsEmpty) {
                setIsLoading(true);
                getSkuDetails(searchValue)
                    .then(data => {
                        setIsLoading(false);
                        setSku(data);
                    })
                    .catch(() => {
                        setIsLoading(false);
                        setIsError(true);
                    });
            }
        }
    };

    const handleResetSearch = () => {
        setSearchValue('');
        setSku({});
        setIsError(false);
        searchInputRef.current.focus();
    };

    const addProductsToCartAndRefreshBasket = () => {
        addToCart(sku).then(() => {
            refreshBasketButton.click();
            setSearchValue('');
            setSku({});
            handleFocus(false);
        });
    };
    useOnOutsideClick(formContainerRef, () => handleFocus(false));

    const styles = {
        searchContainer: {
            position: 'relative'
        },
        formContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            height: '39px',
            paddingLeft: '16px',
            borderRadius: '18px',
            boxSizing: 'border-box',
            border: `${isFocused ? '1px solid #000000' : ''}`,
            backgroundColor: `${isFocused ? '#FFFFFF' : '#F6F6F8'}`
        },
        searchLabel: {
            display: 'none'
        },
        searchInput: {
            width: '95%',
            padding: '9px 0px',
            outline: 'none'
        },
        resultsContainer: {
            position: 'absolute',
            width: '100%',
            zIndex: '1',
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.2)'
        },
        result: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '16px 16px'
        },
        resultContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
        },
        resultDescription: {
            display: 'flex',
            flexDirection: 'column'
        },
        errorDescription: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '114px'
        },
        boldText: {
            fontWeight: '700'
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '32px',
            boxSizing: 'border-box',
            padding: '9px',
            fontWeight: '700',
            borderRadius: '22px'
        },
        buttonPrimary: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '32px',
            boxSizing: 'border-box',
            padding: '9px',
            fontWeight: '700',
            borderRadius: '22px',
            border: '2px solid #000000'
        },
        disabledButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '32px',
            boxSizing: 'border-box',
            padding: '9px',
            fontWeight: '700',
            borderRadius: '22px',
            color: '#666666',
            backgroundColor: '#EEEEEE'
        },
        resultImage: {
            width: '50px',
            height: '50px'
        },
        resetSearchButton: {
            display: 'flex'
        },
        spinner: {
            border: '1px solid #f3f3f3',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'rgb(243, 243, 243)',
            WebkitAnimation: 'agent-spin 1s linear infinite',
            animation: 'agent-spin 1s linear infinite',
            borderTop: '1px solid #555',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            margin: 'auto'
        }
    };

    return (
        <div
            role='search'
            ref={formContainerRef}
            style={styles.searchContainer}
        >
            <label
                id='agent-aware-search-label'
                style={styles.searchLabel}
                children='Search by item number'
            />
            <div
                role='combobox'
                aria-expanded={!!sku.skuId && isFocused}
                aria-owns='agent-aware-search-listbox'
                aria-haspopup='listbox'
                id='agent-aware-search-combobox'
                style={styles.formContainer}
            >
                {isFocused ? null : <SearchIcon />}
                <input
                    ref={searchInputRef}
                    style={styles.searchInput}
                    type='search'
                    id='search-sku-id'
                    name='search-sku-id'
                    value={searchValue}
                    aria-controls='agent-aware-search-listbox'
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    placeholder='Search by item number'
                    autoComplete='off'
                    onFocus={() => handleFocus(true)}
                />
                {isFocused && !searchValueIsEmpty ? (
                    <button
                        style={styles.resetSearchButton}
                        title='Cancel search'
                        onClick={handleResetSearch}
                    >
                        <CloseIcon />
                    </button>
                ) : null}
            </div>
            {isFocused && (sku.skuId || isError) ? (
                <ul
                    id='agent-aware-search-listbox'
                    aria-labelledby='agent-aware-search-label'
                    role='listbox'
                    style={styles.resultsContainer}
                >
                    <li
                        role='option'
                        id='agent-aware-search-result'
                        style={styles.result}
                    >
                        {isError ? (
                            <div style={styles.errorDescription}>
                                <span style={styles.boldText}>No item found</span>
                                <span>The item number does not exist. Please check the number and try again.</span>
                            </div>
                        ) : (
                            <>
                                {isLoading ? (
                                    <div style={styles.spinner}></div>
                                ) : (
                                    <>
                                        <div style={styles.resultContainer}>
                                            <img
                                                style={styles.resultImage}
                                                src={sku.skuImages?.image42 || sku.skuImages?.image250 || ''}
                                                alt={sku.primaryProduct?.brand?.displayName}
                                            />
                                            <div style={styles.resultDescription}>
                                                <span style={styles.boldText}>{sku.primaryProduct?.brand?.displayName}</span>
                                                <span>{sku.primaryProduct?.displayName}</span>
                                                <span>{sku.variationType === 'Color' ? `Color: ${sku.variationValue}` : ''}</span>
                                                <span>{sku.size ? `Size: ${sku.size}` : ''}</span>
                                                <span style={styles.boldText}>{sku.listPrice}</span>
                                            </div>
                                        </div>
                                        {sku.skuId && (
                                            <button
                                                onClick={() => addProductsToCartAndRefreshBasket()}
                                                title={`${sku.primaryProduct?.displayName} ${sku.isOutOfStock ? 'is Out of Stock' : 'Add to basket'}`}
                                                style={sku.isOutOfStock ? styles.disabledButton : styles.buttonPrimary}
                                                disabled={!!sku.isOutOfStock}
                                            >
                                                {sku.isOutOfStock ? 'Out of Stock' : 'Add'}
                                            </button>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </li>
                </ul>
            ) : null}
        </div>
    );
};

export default Search;
