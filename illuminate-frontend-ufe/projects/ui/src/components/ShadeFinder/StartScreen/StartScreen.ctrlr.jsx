import React from 'react';
import store from 'store/Store';
import MediaUtils from 'utils/Media';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import wizardActions from 'actions/WizardActions';
import LanguageLocale from 'utils/LanguageLocale';
import { breakpoints, buttons, space } from 'style/config';
import StickyFooter from 'components/StickyFooter/StickyFooter';
import {
    Box, Flex, Text, Button, Image
} from 'components/ui';

const { Media } = MediaUtils;
const { wrapComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocale;

class StartScreen extends BaseClass {
    nextPage = () => {
        store.dispatch(wizardActions.goToNextPage());
    };

    render() {
        const getText = getLocaleResourceFile('components/ShadeFinder/StartScreen/locales', 'StartScreen');
        const { isMultiShadeFinder } = this.props;
        const action = (
            <Button
                variant='secondary'
                width={['100%', 'auto']}
                minWidth={[null, '20em']}
                onClick={this.nextPage}
            >
                {getText('getStarted')}
            </Button>
        );

        return (
            <Flex
                position='absolute'
                top={0}
                right={0}
                left={0}
                bottom={[space[2] * 2 + buttons.HEIGHT, 0]}
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                textAlign='center'
                paddingX={6}
            >
                <picture
                    css={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <source
                        media={breakpoints.xsMax}
                        srcSet='/img/ufe/shade-finder/modal-bg-m.jpg'
                    />
                    <Image
                        src='/img/ufe/shade-finder/modal-bg-d.jpg'
                        size='100%'
                        css={{ objectFit: 'cover' }}
                    />
                </picture>
                <div css={{ position: 'relative' }}>
                    <Text
                        is='h1'
                        fontSize={['2xl', '3xl']}
                        fontFamily='serif'
                        lineHeight='tight'
                        marginBottom='.25em'
                    >
                        {getText('options')}
                    </Text>
                    <Text
                        is='p'
                        fontSize='md'
                        maxWidth='24em'
                        marginX='auto'
                    >
                        {isMultiShadeFinder ? getText('startMultiShadeFinder') : getText('start')}
                    </Text>
                    <Media greaterThan='xs'>
                        <Box marginTop={6}>{action}</Box>
                    </Media>
                    <Media at='xs'>
                        <StickyFooter accountForBottomNav={false}>{action}</StickyFooter>
                    </Media>
                </div>
            </Flex>
        );
    }
}

export default wrapComponent(StartScreen, 'StartScreen');
