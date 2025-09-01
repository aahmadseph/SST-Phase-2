import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import GalleryGridMasonry from 'components/Community/GalleryGridMasonry';
import {
    Flex, Text, Link, Icon
} from 'components/ui';
import mediaUtils from 'utils/Media';
import debounceUtils from 'utils/Debounce';
import TextInput from 'components/Inputs/TextInput/TextInput';
import {
    forms, space, screenReaderOnlyStyle, colors, breakpoints, mediaQueries
} from 'style/config';
import pixleeUtils from 'utils/pixlee';
import languageLocale from 'utils/LanguageLocale';
import UI from 'utils/UI';
const SEARCH_ICON_SIZE = 16;
const SEARCH_ICON_INDENT = space[3];
const DEBOUNCE_BLUR = 200;

const { debounce: Debounce } = debounceUtils;
const { getApprovedContentFromAlbum, getSearchResults } = pixleeUtils;
const { Media } = mediaUtils;
const { isFrench } = languageLocale;

class ExploreGallery extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            value: '',
            galleryItems: null,
            pageNumber: 1,
            displayShowMoreButton: true,
            showSkeleton: true,
            showSearchResults: false,
            showingResultsFor: '',
            openPixleeUploader: false
        };
    }

    componentDidMount() {
        this.getPhotosFromAlbum();
    }

    getPhotosFromAlbum = () => {
        const options = {
            page: this.state.pageNumber,
            photosPerPage: 30
        };

        if (this.state.showSearchResults) {
            this.retrieveSearchResults(this.state.value, options);
        } else {
            getApprovedContentFromAlbum(Sephora.configurationSettings.exploreGalleryAlbumId, options).then(data => {
                if (data) {
                    this.setState(
                        prevState => {
                            return {
                                galleryItems: prevState.galleryItems ? [...prevState.galleryItems, ...data.data] : data.data,
                                pageNumber: prevState.pageNumber + 1,
                                displayShowMoreButton: data.next,
                                showSkeleton: false
                            };
                        },
                        () => {
                            this.props.setGalleryGridItems(this.state.galleryItems);
                        }
                    );
                }
            });
        }
    };

    retrieveSearchResults = searchTerm => {
        const options = {
            page: this.state.pageNumber,
            photosPerPage: 30
        };
        const results = getSearchResults(Sephora.configurationSettings.exploreGalleryAlbumId, searchTerm, options);
        const photos = [];
        let hasNextPage = false;
        results.then(data => {
            if (data) {
                data.forEach(item => {
                    if (item.next) {
                        hasNextPage = true;
                    }

                    if (item.data?.length > 0) {
                        photos.push(...item.data);
                    }
                });
                const galleryItems = Object.values(
                    photos.reduce((acc, curr) => {
                        acc[curr.id] = curr;

                        return acc;
                    }, {})
                );
                this.setState(
                    prevState => {
                        return {
                            galleryItems: prevState.pageNumber === 1 ? galleryItems : [...prevState.galleryItems, ...galleryItems],
                            pageNumber: prevState.pageNumber + 1,
                            showSearchResults: true,
                            showSkeleton: false,
                            displayShowMoreButton: hasNextPage,
                            showingResultsFor: searchTerm
                        };
                    },
                    () => {
                        this.props.setGalleryGridItems(this.state.galleryItems);
                    }
                );
            }
        });
    };

    loadMorePhotos = () => {
        this.getPhotosFromAlbum();
    };

    handleFocus = () => {
        this.setState({
            focus: true
        });
    };

    handleCancelClick = () => {
        const { showSearchResults } = this.state;
        this.setState(
            {
                value: '',
                showSearchResults: false,
                pageNumber: 1
            },
            () => {
                if (showSearchResults) {
                    this.setState(
                        {
                            galleryItems: null,
                            showSkeleton: true
                        },
                        () => {
                            this.getPhotosFromAlbum();
                        }
                    );
                }
            }
        );
    };

    handleClearClick = () => {
        this.setState(
            {
                value: ''
            },
            () => {
                this.handleBlur();
            }
        );
    };

    blur = () => {
        this.setState({
            focus: false
        });
    };

    handleSearchSubmit = e => {
        e && e.preventDefault();
        const searchTerm = this.state.value.trim();

        if (searchTerm === '') {
            return;
        }

        this.setState(
            {
                showSkeleton: true,
                pageNumber: 1
            },
            () => {
                let elementId = '';

                if (window?.matchMedia(breakpoints.lgMin).matches) {
                    elementId = 'search-form-gallery-large';
                } else {
                    elementId = 'search-form-gallery-small';
                }

                UI.scrollTo({ elementId });

                this.retrieveSearchResults(searchTerm);
            }
        );
    };

    handleBlur = Debounce(this.blur, DEBOUNCE_BLUR);

    renderSearch = () => {
        const { searchTitle, cancel } = this.props.localization;
        const showCancelBtn = this.state.value.length > 0;

        return (
            <div css={styles.root}>
                <form
                    role='search'
                    css={styles.form}
                    onSubmit={e => this.handleSearchSubmit(e)}
                >
                    <label
                        htmlFor='gallery_search_input'
                        id='gallery_search_label'
                        css={screenReaderOnlyStyle}
                        children={searchTitle}
                    />
                    <div
                        css={styles.wrapper}
                        role='combobox'
                        aria-owns='gallery_search_listbox'
                        aria-haspopup='listbox'
                        id='gallery_search_combobox'
                    >
                        <TextInput
                            type='search'
                            autoOff={true}
                            name='keyword'
                            aria-autocomplete='list'
                            aria-controls='gallery_search_listbox'
                            id='gallery_search_input'
                            maxLength={70}
                            placeholder={searchTitle}
                            isSmall={true}
                            indent={SEARCH_ICON_SIZE + SEARCH_ICON_INDENT + space[2]}
                            marginBottom={null}
                            contentAfter={
                                showCancelBtn && (
                                    <button
                                        data-at={Sephora.debug.dataAt('search_clear_btn')}
                                        type='button'
                                        css={styles.clearButton}
                                        onClick={this.handleClearClick}
                                    >
                                        <Icon
                                            name='x'
                                            size={8}
                                        />
                                    </button>
                                )
                            }
                            onChange={e => {
                                this.setState({
                                    value: e.target.value
                                });
                            }}
                            value={this.state.value}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onClick={this.handleFocus}
                        />
                        <Icon
                            name='search'
                            size={SEARCH_ICON_SIZE}
                            color='gray'
                            css={styles.searchIcon}
                        />
                    </div>
                    {showCancelBtn && (
                        <Link
                            data-at={Sephora.debug.dataAt('search_cancel_btn')}
                            color='blue'
                            marginLeft={5}
                            paddingY={1}
                            onClick={this.handleCancelClick}
                            children={cancel}
                        />
                    )}
                </form>
            </div>
        );
    };

    renderResultsText = () => {
        const { resultsFor } = this.props.localization;

        return (
            <Text
                is='p'
                lineHeight='tight'
                color='gray'
                fontSize='base'
                data-at={Sephora.debug.dataAt('number_of_products')}
                css={{
                    paddingLeft: '8px',
                    marginBottom: '16px',
                    [mediaQueries.lg]: {
                        marginBottom: '25px'
                    }
                }}
            >
                {this.state.galleryItems?.length}
                {resultsFor}
                <Text
                    is='span'
                    color='black'
                    fontWeight='bold'
                    children={isFrench() ? `« ${this.state.showingResultsFor} »` : `“${this.state.showingResultsFor}”. `}
                />
                <Link
                    is='span'
                    color='blue'
                    children='Clear all'
                    onClick={this.handleCancelClick}
                    css={{
                        cursor: 'pointer'
                    }}
                />
            </Text>
        );
    };

    render() {
        const { explore, uploadToGallery } = this.props.localization;

        return (
            <Flex
                flexDirection='column'
                paddingY='20px'
                id='search-form-gallery-large'
            >
                <Flex
                    paddingX={2}
                    justifyContent='space-between'
                    css={styles.header}
                >
                    <Flex css={styles.titleSearch}>
                        <Text
                            is='h3'
                            fontWeight='bold'
                            fontSize='md'
                            lineHeight='20px'
                        >
                            {explore}
                        </Text>
                        <Media
                            greaterThan='md'
                            css={styles.searchLGUI}
                        >
                            {this.renderSearch()}
                        </Media>
                    </Flex>
                    <Link
                        color='blue'
                        onClick={this.props.togglePixleeUploader}
                    >
                        {uploadToGallery}
                    </Link>
                </Flex>
                <Media
                    lessThan='lg'
                    css={styles.searchSMUI}
                >
                    <div
                        id='search-form-gallery-small'
                        css={{ paddingTop: '7px' }}
                    >
                        {this.renderSearch()}
                    </div>
                </Media>
                {this.state.showSearchResults && this.renderResultsText()}
                <GalleryGridMasonry
                    showSkeleton={this.state.showSkeleton}
                    showMoreButton={this.state.displayShowMoreButton}
                    loadMorePhotos={this.loadMorePhotos}
                    galleryItems={this.props.galleryItems}
                />
            </Flex>
        );
    }
}

const styles = {
    header: {
        marginBottom: '9px',
        alignItems: 'center',
        [mediaQueries.lg]: {
            marginBottom: '25px'
        }
    },
    titleSearch: {
        alignItems: 'center'
    },
    searchLGUI: {
        flex: '1',
        paddingX: '24px'
    },
    searchSMUI: {
        paddingX: '8px',
        paddingBottom: '16px'
    },
    form: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        margin: '0 8px',
        [mediaQueries.lg]: {
            margin: '0 24px'
        }
    },
    wrapper: {
        position: 'relative',
        width: '274px',
        [mediaQueries.lg]: {
            width: '304px'
        }
    },
    searchIcon: {
        position: 'absolute',
        top: (forms.HEIGHT_SM - SEARCH_ICON_SIZE) / 2,
        left: SEARCH_ICON_INDENT,
        pointerEvents: 'none'
    },
    clearButton: {
        color: colors.white,
        backgroundColor: colors.gray,
        lineHeight: 0,
        borderRadius: 99999,
        width: 16,
        height: 16,
        textAlign: 'center',
        marginRight: space[2],
        alignSelf: 'center',
        '.no-touch &:hover': {
            backgroundColor: colors.black
        }
    },
    root: {
        position: 'relative'
    }
};

export default wrapComponent(ExploreGallery, 'ExploreGallery', true);
