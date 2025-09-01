import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import {
    Text, Box, Flex, Link
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import ColorIQHistory from 'components/Header/BeautyPreferences/ColorIQHistory';

class ColorIQContent extends BaseClass {
    state = {
        isColorIQHistoryOpen: false,
        desc: ''
    };

    openColorIQHistory = e => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({ isColorIQHistoryOpen: true });
    };

    closeColorIQHistory = () => {
        this.setState({ isColorIQHistoryOpen: false });
    };

    render() {
        const { colorIQ, localization } = this.props;
        const latestColorIQ = colorIQ.length && colorIQ[0];
        const showViewAll = colorIQ.length > 1;
        const colorIQdate = latestColorIQ.createDate || latestColorIQ.creationDate || '';

        return (
            <>
                <Flex
                    boxShadow='light'
                    padding={3}
                    borderRadius={2}
                    alignItems='center'
                >
                    <Box
                        size={[26, null, 36]}
                        borderRadius='full'
                        backgroundColor={latestColorIQ.hexCode}
                        flexShrink={0}
                        alignSelf='baseline'
                    />
                    <Flex
                        flexDirection='column'
                        marginLeft={2}
                        flex={1}
                    >
                        {latestColorIQ.description}
                        <Flex alignItems='spaceBetween'>
                            <Text
                                color='gray'
                                fontSize='sm'
                                marginTop='.5em'
                                children={`${localization.captured} ${colorIQdate}`}
                            />
                            {showViewAll && (
                                <Link
                                    color='blue'
                                    marginTop='auto'
                                    marginLeft='auto'
                                    fontSize='sm'
                                    onClick={this.openColorIQHistory}
                                    children={localization.viewAll}
                                />
                            )}
                        </Flex>
                    </Flex>
                </Flex>
                {showViewAll && (
                    <ColorIQHistory
                        colorIQ={colorIQ}
                        close={this.closeColorIQHistory}
                        isOpen={this.state.isColorIQHistoryOpen}
                    />
                )}
            </>
        );
    }
}

ColorIQContent.propTypes = {
    colorIQ: PropTypes.array.isRequired
};

export default wrapComponent(ColorIQContent, 'ColorIQContent', true);
