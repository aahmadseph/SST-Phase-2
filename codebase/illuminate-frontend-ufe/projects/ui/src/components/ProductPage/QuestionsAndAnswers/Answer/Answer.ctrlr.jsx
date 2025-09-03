import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Feedback from 'components/ProductPage/Feedback/Feedback';
import {
    colors, fontSizes, lineHeights, radii, space
} from 'style/config';
import {
    Grid, Text, Flex, Link, Box
} from 'components/ui';
import dateUtils from 'utils/Date';
import languageLocale from 'utils/LanguageLocale';
import feedbackUtils from 'utils/Feedback';
import filterUtils from 'utils/Filters';
import { DebouncedResize } from 'constants/events';

const getText = languageLocale.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

class Answer extends BaseClass {
    state = {
        hasOverflow: false,
        showMore: false
    };

    textRef = React.createRef();

    handleResize = () => {
        if (!this.state.showMore) {
            const desc = this.textRef.current;
            this.setState({
                hasOverflow: desc.scrollHeight > desc.offsetHeight
            });
        }
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    toggleReadMore = () => {
        const currentScroll = window.scrollY;
        this.setState({ showMore: !this.state.showMore }, () => {
            window.scroll(0, currentScroll);
        });
    };

    render() {
        const {
            answerId,
            answerText,
            submissionTime,
            totalNegativeFeedbackCount,
            totalPositiveFeedbackCount,
            userNickname,
            badgesOrder,
            badges = {},
            answerLink,
            moreAnswersLink
        } = this.props;

        const { showMore } = this.state;

        const processPostedDate = postedDate => dateUtils.formatSocialDate(postedDate, true);
        const getPostedBy = nickName => (nickName ? getText('postedBy', [nickName]) : '');

        return (
            <Grid
                marginTop={3}
                columns='1.5em 1fr'
                gap={null}
                data-at={Sephora.debug.dataAt('answers_section')}
            >
                <Text
                    aria-label={getText('answer')}
                    fontWeight='medium'
                    children='A:'
                />
                <div>
                    <Text
                        ref={this.textRef}
                        is='div'
                        numberOfLines={showMore ? null : 4}
                        lineHeight='relaxed'
                        children={answerText}
                    />
                    {this.state.hasOverflow && (
                        <Link
                            padding={2}
                            margin={-2}
                            onClick={this.toggleReadMore}
                            color='blue'
                            children={!showMore ? getText('readMore') : getText('readLess')}
                        />
                    )}
                    <Flex
                        flexWrap='wrap'
                        alignItems='center'
                        marginBottom={3}
                    >
                        <Text
                            is='p'
                            fontSize={['sm', 'base']}
                            width={['100%', 'auto']}
                            marginRight={[null, 2]}
                            color='gray'
                        >
                            {`${getText('answered')} ${processPostedDate(submissionTime)} ${getPostedBy(userNickname)}`}
                        </Text>
                        {filterUtils.isVerifiedPurchaser(badgesOrder) && (
                            <Text
                                fontSize={['sm', 'base']}
                                marginRight={2}
                                color='green'
                            >
                                {getText('verifiedPurchase')}
                            </Text>
                        )}
                        {(badges.StaffContextBadge || badges.staffContextBadge) && (
                            <span
                                css={styles.badge}
                                children={getText('sephoraEmployee')}
                            />
                        )}
                        {(badges.IncentivizedReviewBadge || badges.incentivizedReview) && (
                            <span
                                css={styles.badge}
                                children={getText('receivedFreeProduct')}
                            />
                        )}
                    </Flex>
                    <Flex
                        alignItems='center'
                        justifyContent={['flex-end', 'flex-start']}
                    >
                        {moreAnswersLink && <Box marginRight={['auto', 5]}>{moreAnswersLink}</Box>}
                        <Feedback
                            positiveCount={totalPositiveFeedbackCount}
                            negativeCount={totalNegativeFeedbackCount}
                            onVote={isPositive => feedbackUtils.handleVote(feedbackUtils.FEEDBACK_CONTENT_TYPES.ANSWER, answerId, isPositive)}
                        />
                    </Flex>
                    {answerLink}
                </div>
            </Grid>
        );
    }
}

const styles = {
    badge: {
        display: 'inline-block',
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.tight,
        padding: '3px 6px',
        backgroundColor: colors.lightBlue,
        borderRadius: radii[2],
        maxWidth: '100%',
        marginRight: space[2]
    }
};

export default wrapComponent(Answer, 'Answer', true);
