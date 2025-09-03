import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import urlUtils from 'utils/Url';
import Location from 'utils/Location';

import {
    Grid, Text, Divider, Link, Container, Box
} from 'components/ui';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import myListsUtils from 'utils/MyLists';

const isSharableListEnabled = myListsUtils.isSharableListEnabled();

const LINK_PROPS = {
    padding: 2,
    margin: -2,
    arrowDirection: 'left',
    arrowPosition: 'before'
};

class ListPageHeader extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            previousPageLinkText: null,
            previousPageURL: null
        };
    }

    componentDidMount() {
        const filterByParam = urlUtils.getParamValueAsSingleString('filterby');

        if (filterByParam === 'rewards') {
            this.setState({
                previousPageLinkText: 'Back to Beauty Insider',
                previousPageURL: '/profile/BeautyInsider'
            });
        }
    }

    goPreviousPage = () => {
        Location.setLocation(this.state.previousPageURL);
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/ListPageHeader/locales', 'ListPageHeader');
        const {
            noMargin, hasDivider = true, hasLink = true, children, showFavBrandSpoke = false
        } = this.props;

        const { previousPageLinkText } = this.state;

        return (
            <>
                <Container
                    hasLegacyWidth={true}
                    paddingTop={[4, 6]}
                >
                    <Grid
                        gap={3}
                        lineHeight='tight'
                    >
                        {hasLink && (
                            <div>
                                {previousPageLinkText ? (
                                    <Link
                                        onClick={this.goPreviousPage}
                                        {...LINK_PROPS}
                                        children={previousPageLinkText}
                                    />
                                ) : (
                                    !isSharableListEnabled && (
                                        <Link
                                            href='/profile/Lists'
                                            {...LINK_PROPS}
                                            children={getText('backToLists')}
                                        />
                                    )
                                )}
                            </div>
                        )}
                        <Text
                            is='h1'
                            fontSize={['xl', '2xl']}
                            textAlign='left'
                            fontFamily='serif'
                            children={children}
                        />
                        {showFavBrandSpoke && (
                            <Box
                                display={'flex'}
                                flexDirection={['column', 'row']}
                                fontSize={['sm', '14px']}
                                justifyContent='space-between'
                                backgroundColor={colors.lightBlue}
                                borderRadius={2}
                                paddingX={4}
                                paddingY={3}
                                maxWidth={410}
                            >
                                <span>{getText('lookingForFavBrands')}</span>
                                <Link
                                    color='blue'
                                    underline={true}
                                    children={getText('goToBeautyPrefs')}
                                    href='/profile/BeautyPreferences'
                                />
                            </Box>
                        )}
                    </Grid>
                </Container>
                {hasDivider && (
                    <Divider
                        thick={true}
                        marginTop={4}
                        marginBottom={noMargin || [4, 5]}
                    />
                )}
            </>
        );
    }
}

export default wrapComponent(ListPageHeader, 'ListPageHeader');
