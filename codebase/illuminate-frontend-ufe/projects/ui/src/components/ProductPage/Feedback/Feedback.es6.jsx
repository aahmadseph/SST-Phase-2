import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { colors } from 'style/config';
import { Icon, Flex } from 'components/ui';

import languageLocale from 'utils/LanguageLocale';

const getText = languageLocale.getLocaleResourceFile('components/ProductPage/Feedback/locales', 'Feedback');
const SPACING = '.7em';

class Feedback extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isVoted: false
        };
    }

    handleVote = isDown => {
        if (!this.state.isLoading) {
            this.setState({ isVoted: true });
        }

        this.props.onVote(!isDown);
    };

    renderVoteButton(count, isDown) {
        return (
            <button
                onClick={() => this.handleVote(isDown)}
                key={isDown ? 'unhelpfulLink' : 'helpfulLink'}
                css={{
                    padding: SPACING,
                    margin: `-${SPACING}`,
                    '.no-touch &:hover': {
                        color: colors.black
                    }
                }}
            >
                <svg
                    viewBox='0 0 14 10'
                    fill='currentColor'
                    css={{
                        width: '1em',
                        height: '.72em',
                        marginRight: '.4em',
                        transform: isDown ? 'rotate(180deg)' : null
                    }}
                >
                    <path d='M6.6.7l-6 8a.5.5 0 00.4.8h12a.5.5 0 00.4-.8l-6-8a.5.5 0 00-.8 0zM7 1.833L12 8.5H2l5-6.667z' />
                </svg>
                <span key={isDown ? 'unhelpfulNumber' : 'helpfulNumber'}>{`(${count})`}</span>
            </button>
        );
    }

    render() {
        const { positiveCount = 0, negativeCount = 0 } = this.props;

        const { isVoted } = this.state;

        return (
            <Flex
                alignItems='center'
                color='gray'
                fontSize={['sm', 'base']}
                lineHeight='tight'
            >
                {isVoted ? (
                    <React.Fragment>
                        <Icon
                            name='checkmark'
                            size='.9em'
                            color='green'
                            marginRight='.5em'
                        />
                        <span key='thanksText'>{getText('thanks')}</span>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <span
                            key='helpfullText'
                            css={{ marginRight: SPACING }}
                            children={getText('helpful')}
                        />
                        {this.renderVoteButton(positiveCount)}
                        <span
                            key='separator'
                            css={{ margin: `0 ${SPACING}` }}
                            children='|'
                        />
                        {this.renderVoteButton(negativeCount, true)}
                    </React.Fragment>
                )}
            </Flex>
        );
    }
}

export default wrapComponent(Feedback, 'Feedback');
