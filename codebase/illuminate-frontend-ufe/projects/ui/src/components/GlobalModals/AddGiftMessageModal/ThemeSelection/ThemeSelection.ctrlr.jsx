import BaseClass from 'components/BaseClass';
import Carousel from 'components/Carousel';
import Pill from 'components/Pill';
import {
    Box, Divider, Flex, Image
} from 'components/ui';
import PropTypes from 'prop-types';
import React from 'react';
import {
    colors, mediaQueries, radii, space
} from 'style/config';
import MediaUtils from 'utils/Media';
import { wrapComponent } from 'utils/framework';

const { Media } = MediaUtils;

class ThemeSelection extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            selectedTheme: null,
            previewUrl: '',
            currentThemesList: [],
            finalThemes: [],
            selectedThemeFilter: ''
        };
    }

    scrollRef = React.createRef();

    componentDidMount() {
        const {
            languageThemes, currentLanguage, selectedSid, selectedImageUrl, themeFilter
        } = this.props;

        if (currentLanguage.length > 0) {
            const genericThemesData = languageThemes?.find(language => language.sid === currentLanguage)?.themes || [];
            const allThemesFilterData = this.allThemes(genericThemesData);
            const finalThemes = [allThemesFilterData, ...genericThemesData];
            const themes = themeFilter?.length ? finalThemes?.find(theme => theme.title === themeFilter)?.media : finalThemes[0]?.media;

            this.setState(
                {
                    finalThemes: finalThemes,
                    selectedTheme: selectedSid || themes[0]?.sid,
                    previewUrl: selectedImageUrl || themes[0]?.src,
                    currentThemesList: themes,
                    selectedThemeFilter: themeFilter || finalThemes[0]?.title
                },
                () => {
                    if (this.scrollRef.current) {
                        this.scrollRef.current.scrollLeft = 0;
                    }

                    this.props.setPropertiesFromThemeSelection(
                        this.state.previewUrl,
                        this.state.selectedTheme,
                        this.state.selectedThemeFilter,
                        this.state.altText
                    );
                }
            );
        }
    }

    componentDidUpdate(prevProps) {
        const { currentLanguage } = this.props;

        if (prevProps.currentLanguage !== currentLanguage) {
            this.setThemeTilesList();
        }
    }

    setThemeTilesList = () => {
        const {
            languageThemes, currentLanguage, selectedSid, selectedImageUrl, isEditMessage, themeFilter
        } = this.props;
        const genericThemesData = languageThemes?.find(language => language.sid === currentLanguage)?.themes || [];
        const allThemesFilterData = this.allThemes(genericThemesData);
        const finalThemes = [allThemesFilterData, ...genericThemesData];
        const themes = isEditMessage && themeFilter?.length ? finalThemes?.find(theme => theme.title === themeFilter)?.media : finalThemes[0]?.media;

        const isSelectedImageUrlAvailableInTheTheme = genericThemesData.some(item => {
            if (item.media) {
                return item.media.some(mediaItem => mediaItem.src.includes(selectedImageUrl));
            }

            return false;
        });

        const altText = this.getSelectedThemeAlt(themes, selectedSid);

        if (themes?.length) {
            this.setState(
                {
                    finalThemes: finalThemes,
                    selectedTheme: isEditMessage ? selectedSid : themes[0]?.sid,
                    altText: isEditMessage ? altText : themes[0]?.altText,
                    previewUrl: isEditMessage && isSelectedImageUrlAvailableInTheTheme ? selectedImageUrl : themes[0]?.src,
                    currentThemesList: themes,
                    selectedThemeFilter: isEditMessage && themeFilter?.length ? themeFilter : finalThemes[0]?.title
                },
                () => {
                    if (this.scrollRef.current) {
                        this.scrollRef.current.scrollLeft = 0;
                    }

                    this.props.setPropertiesFromThemeSelection(
                        this.state.previewUrl,
                        this.state.selectedTheme,
                        this.state.selectedThemeFilter,
                        this.state.altText
                    );
                }
            );
        }
    };

    selectTheme = theme => () => {
        if (this.state.selectedTheme !== theme.sid) {
            this.setState(
                {
                    selectedTheme: theme.sid,
                    previewUrl: theme.src,
                    altText: theme.altText
                },
                () => {
                    this.props.setPropertiesFromThemeSelection(
                        this.state.previewUrl,
                        this.state.selectedTheme,
                        this.state.selectedThemeFilter,
                        this.state.altText
                    );
                }
            );
        }
    };

    selectThemeFilter = filterTitle => {
        if (this.state.selectedThemeFilter !== filterTitle) {
            const themes = this.state.finalThemes?.find(theme => theme.title === filterTitle)?.media;

            if (themes.length) {
                this.setState(
                    {
                        selectedTheme: themes[0]?.sid,
                        previewUrl: themes[0]?.src,
                        currentThemesList: themes,
                        selectedThemeFilter: filterTitle,
                        altText: themes[0].altText
                    },
                    () => {
                        this.props.setPropertiesFromThemeSelection(
                            this.state.previewUrl,
                            this.state.selectedTheme,
                            this.state.selectedThemeFilter,
                            this.state.altText
                        );
                    }
                );
            }
        }
    };

    allThemes = themes => {
        const allThemes = themes?.reduce((accumulator, value) => accumulator.concat(value?.media), []);

        return { title: this.props.allThemeTitle, media: allThemes };
    };

    getPillTitle = (title, total) => {
        return `${title} (${total})`;
    };

    getSelectedThemeAlt = (currentThemesList, selectedTheme) => {
        if (!currentThemesList?.length) {
            return '';
        }

        const currentTheme = currentThemesList.find(theme => theme.sid === selectedTheme);

        return currentTheme?.altText || '';
    };

    handlePillClick = title => () => this.selectThemeFilter(title);

    render() {
        const {
            selectedTheme, previewUrl, currentThemesList, finalThemes, selectedThemeFilter
        } = this.state;

        return (
            <Box>
                <Divider marginTop={4} />
                <>
                    {finalThemes?.length ? (
                        <Flex
                            ref={this.scrollRef}
                            marginBottom={[0, 4]}
                            marginX={[-4, -1]}
                            paddingX={[4, 0]}
                            paddingY={4}
                            css={{
                                whiteSpace: 'nowrap',
                                overflow: 'auto',
                                scrollBehavior: 'smooth',
                                overscrollBehaviorX: 'none',
                                scrollSnapType: 'x mandatory',
                                scrollPaddingLeft: space[5],
                                '& > *': {
                                    scrollSnapAlign: 'start',
                                    cursor: 'pointer'
                                },
                                [mediaQueries.xsMax]: {
                                    scrollPaddingLeft: space[4],
                                    scrollbarWidth: 'none', // Firefox, Chrome, Edge
                                    '&::-webkit-scrollbar': {
                                        display: 'none' // Safari
                                    }
                                }
                            }}
                        >
                            {(finalThemes?.length ? finalThemes : []).map((option, index) => (
                                <Pill
                                    aria-label={this.getPillTitle(option.title, option.media?.length)}
                                    aria-pressed={option.title === selectedThemeFilter}
                                    key={index.toString()}
                                    isActive={option.title === selectedThemeFilter}
                                    marginX={1}
                                    onClick={this.handlePillClick(option.title)}
                                    children={this.getPillTitle(option.title, option.media?.length)}
                                    fontSize='sm'
                                    minWidth={'auto'}
                                    isThemeSelection={true}
                                    css={styles.focusVisible}
                                />
                            ))}
                        </Flex>
                    ) : null}
                </>

                <Media at='xs'>
                    <Divider marginBottom={4} />
                </Media>

                <Box
                    paddingX={[5, 8]}
                    marginX={[5, 0]}
                    marginBottom={4}
                    maxHeight={446}
                    maxWidth={446}
                >
                    <Image
                        disableLazyLoad={true}
                        src={previewUrl}
                        border={`1px solid ${colors.midGray}`}
                        borderRadius={2}
                        width='100%'
                        height='100%'
                        alt={this.getSelectedThemeAlt(currentThemesList, selectedTheme)}
                    />
                </Box>
                <Box
                    marginRight={-5}
                    marginLeft={[-4, -5]}
                    css={{
                        [mediaQueries.xsMax]: { position: 'absolute', bottom: space[1], right: space[5], left: space[3] }
                    }}
                >
                    {currentThemesList?.length ? (
                        <Carousel
                            isLoading={false}
                            gap={2}
                            itemWidth={'60px'}
                            showArrowOnHover={true}
                            scrollPadding={(4, 5)}
                            selectedThemeFilter={`${this.props.currentLanguage}-${selectedThemeFilter}`}
                            items={currentThemesList.map(theme => (
                                <Box
                                    onClick={this.selectTheme(theme)}
                                    aria-pressed={selectedTheme === theme.sid}
                                    css={[
                                        styles.giftImageBox,
                                        selectedTheme === theme.sid ? styles.selectedTheme : styles.unselectedTheme,
                                        { ...styles.focusVisible }
                                    ]}
                                >
                                    <Image
                                        alt={theme.altText}
                                        disableLazyLoad={true}
                                        borderRadius={2}
                                        src={theme.src}
                                        width='100%'
                                        height='100%'
                                    />
                                </Box>
                            ))}
                        />
                    ) : null}
                </Box>
            </Box>
        );
    }
}

const styles = {
    giftImageBox: {
        width: '60px',
        height: '75px',
        borderRadius: radii[2],
        border: `1px solid ${colors.midGray}`
    },
    selectedTheme: {
        borderColor: colors.black
    },
    unselectedTheme: {
        borderColor: colors.midGray
    },
    focusVisible: {
        '&:focus-visible': {
            outline: '2px solid #0066cc',
            outlineOffset: '2px'
        }
    }
};

ThemeSelection.propTypes = {
    languageThemes: PropTypes.array.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    selectedSid: PropTypes.string.isRequired,
    selectedImageUrl: PropTypes.string.isRequired,
    themeFilter: PropTypes.string.isRequired
};

export default wrapComponent(ThemeSelection, 'ThemeSelection', true);
