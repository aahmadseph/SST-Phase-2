/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Text, Box, Divider } from 'components/ui';

import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import Pill from 'components/Pill';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/Sentiments/locales', 'Sentiments');
let sentiments;

class Sentiments extends BaseClass {
    constructor(props) {
        super(props);
        store.setAndWatch(
            { 'page.product': 'product' },
            this,
            data => {
                sentiments = data.product.sentiments || [];
            },
            store.STATE_STRATEGIES.DIRECT_INIT
        );
    }

    render() {
        const isActive = false; // TODO when sentiments is clickable story is played

        return (
            <div data-at={Sephora.debug.dataAt('most_mentioned_section')}>
                {Array.isArray(sentiments) && sentiments.length > 0 && (
                    <>
                        <Text
                            is='h3'
                            fontSize={['sm', 'base']}
                            marginTop={[6, 0]}
                            marginBottom='.5em'
                            data-at={Sephora.debug.dataAt('most_mentioned_section_title')}
                            children={getText('mostMention')}
                        />
                        <Box marginTop={[-2, -3]}>
                            {sentiments.map((item, index) => (
                                <Pill
                                    key={index.toString()}
                                    isActive={isActive}
                                    fontSize={['sm', 'base']}
                                    marginRight={2}
                                    marginTop={[2, 3]}
                                    css={{ textTransform: 'lowercase' }}
                                    data-at={Sephora.debug.dataAt('sentiment_pill_label')}
                                >
                                    <span>
                                        <b>{item.sentiment}</b>{' '}
                                        <span
                                            data-at={Sephora.debug.dataAt('sentiment_phrase_count')}
                                            children={`(${item.count})`}
                                        />
                                    </span>
                                </Pill>
                            ))}
                        </Box>
                        <Divider
                            display={[null, 'none']}
                            marginTop={4}
                        />
                    </>
                )}
            </div>
        );
    }
}

export default wrapComponent(Sentiments, 'Sentiments', true);
