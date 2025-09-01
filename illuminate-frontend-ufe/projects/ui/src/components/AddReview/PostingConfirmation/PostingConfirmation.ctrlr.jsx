/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Container, Box, Text, Button, Divider
} from 'components/ui';
import AddReviewTitle from 'components/AddReview/AddReviewTitle/AddReviewTitle';

import UrlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';

class PostingConfirmation extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            submissionErrors: props.submissionErrors
        };
    }

    componentWillReceiveProps(updatedProps) {
        this.setState(updatedProps);
    }

    continueClickHandler = () => {
        UrlUtils.redirectTo(this.props.productURL);
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/AddReview/PostingConfirmation/locales', 'PostingConfirmation');
        const hasErrors = this.state.submissionErrors && this.state.submissionErrors instanceof Array;

        return (
            <Container hasLegacyWidth={true}>
                <AddReviewTitle children={hasErrors ? getText('submissionError') : getText('thankYou')} />
                {hasErrors ? (
                    <div>
                        <div>{getText('somethingWentWrongError')}</div>
                    </div>
                ) : null}
                <Box
                    maxWidth={528}
                    marginX='auto'
                >
                    {!hasErrors && (
                        <Text
                            is='p'
                            textAlign='center'
                        >
                            {getText('reviewsPostMessage')}
                        </Text>
                    )}
                    <Divider marginY={5} />
                    <Box textAlign='center'>
                        <Button
                            variant='secondary'
                            onClick={this.continueClickHandler}
                            children={getText('continueShopping')}
                            hasMinWidth={true}
                        />
                    </Box>
                </Box>
            </Container>
        );
    }
}

export default wrapComponent(PostingConfirmation, 'PostingConfirmation', true);
