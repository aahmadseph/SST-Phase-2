import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Text, Link, Button
} from 'components/ui';

const SDUBanner = ({
    title,
    text,
    boldText,
    boldTextDayTrial,
    ending,
    linkText,
    isBannerVisible,
    skuTrialPeriod,
    renderSDULandingPage,
    showButtonCta,
    tryNowForFreeText,
    ...props
}) => {
    if (!title || !isBannerVisible) {
        return null;
    }

    return (
        <Box
            paddingX={3}
            paddingY={2}
            borderRadius={2}
            borderWidth={1}
            borderColor='lightGray'
            backgroundColor='white'
            {...props}
        >
            <Text
                is='h2'
                color='red'
                fontWeight='bold'
                children={title}
            />
            <Text
                is='p'
                fontSize='sm'
            >
                {text}
                <strong>
                    {' '}
                    {boldText}
                    {skuTrialPeriod ? ` ${skuTrialPeriod}` : ending ? ' ' : ''}
                    {boldTextDayTrial}
                </strong>
                {ending}
                {ending ? ' ' : '. '}
                {showButtonCta && (
                    <div>
                        <Button
                            size='xs'
                            variant='secondary'
                            onClick={renderSDULandingPage}
                            children={tryNowForFreeText}
                            marginTop='8px'
                        />
                    </div>
                )}
                {!showButtonCta && (
                    <Link
                        color='blue'
                        underline={true}
                        onClick={renderSDULandingPage}
                    >
                        {linkText}
                    </Link>
                )}
            </Text>
        </Box>
    );
};

SDUBanner.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    boldText: PropTypes.string.isRequired,
    ending: PropTypes.string,
    linkText: PropTypes.string.isRequired,
    isBannerVisible: PropTypes.bool.isRequired
};

SDUBanner.defaultProps = {
    ending: ''
};

export default wrapFunctionalComponent(SDUBanner, 'SDUBanner');
