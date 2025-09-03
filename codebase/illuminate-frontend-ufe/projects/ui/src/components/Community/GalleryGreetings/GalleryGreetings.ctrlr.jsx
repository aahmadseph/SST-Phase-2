import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Flex, Text, Link } from 'components/ui';
import { colors } from 'style/config';

import Pill from 'components/Pill';
import Location from 'utils/Location';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import urlUtils from 'utils/Url';

const { getLink } = urlUtils;

class GalleryGreetings extends BaseClass {
    state = {
        displayGreetingsBox: false
    };

    componentDidMount() {
        const greetingsCookie = Storage.local.getItem(LOCAL_STORAGE.GALLERY_GREETINGS_DISPLAYED);

        if (!this.state.displayGreetingsBox && !greetingsCookie) {
            this.setState({ displayGreetingsBox: true });
        }
    }

    dissmissGalleryGreeting = e => {
        e.preventDefault();
        Storage.local.setItem(LOCAL_STORAGE.GALLERY_GREETINGS_DISPLAYED, true);
        this.setState({ displayGreetingsBox: false });
    };

    render() {
        const {
            title, link, boxTitle, boxDescription, boxLink, boxCTA
        } = this.props.localization;

        return (
            <Flex
                width='100%'
                flexDirection='column'
                paddingY='20px'
                data-at={Sephora.debug.dataAt('gallery_greetings')}
            >
                <Flex
                    justifyContent='space-between'
                    paddingX={2}
                    paddingBottom={4}
                    alignItems='center'
                >
                    <Text
                        is='h2'
                        fontWeight='bold'
                        fontSize={['lg', 'xl']}
                        lineHeight='22px'
                        children={title}
                    />

                    <Link
                        color='blue'
                        onClick={e => {
                            Location.navigateTo(e, getLink('/community/gallery/mygallery'));
                        }}
                        children={link}
                    />
                </Flex>

                {this.state.displayGreetingsBox && (
                    <Flex
                        flexDirection='column'
                        padding={4}
                        backgroundColor={colors.nearWhite}
                        justifyContent='space-between'
                    >
                        <Text
                            is='h4'
                            fontWeight='bold'
                            fontSize='sm'
                            lineHeight='base'
                            children={boxTitle}
                        />

                        <Text
                            is='p'
                            fontSize='sm'
                            lineHeight='base'
                        >
                            {boxDescription}{' '}
                            <Link
                                fontSize='sm'
                                lineHeight='base'
                                color='blue'
                                href='https://community.sephora.com/t5/Trending-at-Sephora/New-to-Community-Here-are-3-Steps-to-Get-Started/m-p/5194212#M88231'
                                children={boxLink}
                            />
                        </Text>

                        <Pill
                            isActive={true}
                            backgroundColor={colors.white}
                            color={colors.black}
                            border={`1px solid ${colors.black}`}
                            width='72px'
                            minHeight='24px'
                            marginTop={4}
                            fontSize='sm'
                            onClick={this.dissmissGalleryGreeting}
                            children={boxCTA}
                        />
                    </Flex>
                )}
            </Flex>
        );
    }
}

export default wrapComponent(GalleryGreetings, 'GalleryGreetings', true);
