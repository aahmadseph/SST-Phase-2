/* eslint-disable class-methods-use-this */
import React from 'react';
import { colors, space } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import {
    Text, Divider, Link, Box, Grid, Button, Icon, Flex
} from 'components/ui';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import BaseClass from 'components/BaseClass';
import bazaarVoiceApi from 'services/api/thirdparty/BazaarVoiceQandA';
import Filter from 'components/ProductPage/Filters/Filter/Filter';
import filterUtils from 'utils/Filters';
import Pagination from 'components/ProductPage/Pagination/Pagination';
import Pill from 'components/Pill';
import processEvent from 'analytics/processEvent';
import Question from 'components/ProductPage/QuestionsAndAnswers/Question/Question';
import RadioFilter from 'components/ProductPage/Filters/FilterTypes/RadioFilter';
import TextInput from 'components/Inputs/TextInput/TextInput';
import UI from 'utils/UI';
import UrlUtils from 'utils/Url';
import { wrapComponent } from 'utils/framework';

const ANSWERS_SORT_TYPES = ['TotalPositiveFeedbackCount:desc', 'SubmissionTime:desc'];

const DEFAULT_ANSWERS_SORT = `${ANSWERS_SORT_TYPES[0]},${ANSWERS_SORT_TYPES[1]}`;
const PAGE_SIZE = 4;
const PRODUCT_SUBMIT_QUESTION_URL = '/submitQuestion?productId=';
const SORT_FILTER_NAME = 'sort_filter';

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/QuestionsAndAnswers/locales', 'QuestionsAndAnswers');

const redirectToSubmitQuestionPage = productId => {
    const skuId = UrlUtils.getParamsByName('skuId');
    anaUtils.setNextPageData({ linkData: 'ask a question' });

    if (skuId) {
        return UrlUtils.redirectTo(`${PRODUCT_SUBMIT_QUESTION_URL}${productId}&skuId=${skuId}`);
    } else {
        return UrlUtils.redirectTo(`${PRODUCT_SUBMIT_QUESTION_URL}${productId}`);
    }
};

const getTriggerPill = ({ isOpen, title }) => {
    return (
        <Pill
            fontSize='sm'
            isActive={isOpen}
            hasArrow={true}
        >
            {title}
        </Pill>
    );
};

class QuestionsAndAnswers extends BaseClass {
    state = {
        showMoreQuestions: false,
        sortBy: filterUtils.QUESTIONS_SORT_TYPES[1],
        totalResults: 0,
        questions: [],
        isSearchEnabled: false,
        hasSearchResults: false
    };
    inputRef = React.createRef();
    needToScroll = false;

    componentDidMount() {
        this.loadInitialQuestions();
    }

    componentDidUpdate = prevProps => {
        if (prevProps.productId !== this.props.productId) {
            this.loadInitialQuestions();
        }
    };

    loadInitialQuestions = () => {
        this.fetchData(PAGE_SIZE, this.state.sortBy.value, DEFAULT_ANSWERS_SORT);
    };

    getQuestionsToShow = () => {
        let { questions } = this.state;

        if (questions.length) {
            if (this.state.showMoreQuestions) {
                questions = questions.slice(0, 4);
            } else {
                questions = questions.slice(0, 1);
            }
        }

        return questions;
    };

    fetchData = (limit, sortQuestionBy, sortAnswerBy, currentPage = 1) => {
        const { productId } = this.props;
        const offset = (currentPage - 1) * PAGE_SIZE;
        bazaarVoiceApi
            .QuestionAnswersandStats(productId, limit, sortQuestionBy, sortAnswerBy, offset)
            // eslint-disable-next-line object-curly-newline
            .then(({ totalResults, results }) => {
                this.setState(
                    {
                        totalResults,
                        questions: results || [],
                        currentPage,
                        hasSearchResults: false
                    },
                    () => {
                        if (this.needToScroll) {
                            setTimeout(() => UI.scrollTo({ elementId: 'QandA' }));
                            this.needToScroll = false;
                        }
                    }
                );
            });
    };

    handlePageClick = pageIndex => {
        this.needToScroll = true;
        const keyword = this.inputRef.current?.getValue().trim() || '';

        // If the user has enabled search BUT hasn't entered any keyword, ignore the search and
        // just fetch the data for the selected page
        if (this.state.isSearchEnabled && keyword !== '') {
            this.handleSubmit(event, pageIndex);
        } else {
            this.fetchData(4, this.state.sortBy.value, DEFAULT_ANSWERS_SORT, pageIndex);
        }
    };

    applySortSelection = (filtersToApply = {}) => {
        const sortSelected = filterUtils.QUESTIONS_SORT_TYPES.find(filter => filter.value === filtersToApply[SORT_FILTER_NAME][0]);

        this.setState({ sortBy: sortSelected }, () => {
            this.fetchData(PAGE_SIZE, sortSelected.value, DEFAULT_ANSWERS_SORT);

            const actionLink = 'questions&answers:sort selection';
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    selectedFilter: 'questions&answers:' + sortSelected.key.split('_').join(' '),
                    actionInfo: actionLink,
                    linkName: actionLink
                }
            });
        });
    };

    showMore = () => {
        const currentScroll = window.scrollY;
        this.setState({ showMoreQuestions: !this.state.showMoreQuestions }, () => {
            if (!this.state.showMoreQuestions) {
                UI.scrollTo({ elementId: 'QandA' });
            } else {
                window.scroll(0, currentScroll);
            }

            const actionLink = 'questions&answers:show more';
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo: actionLink,
                    linkName: actionLink
                }
            });
        });
    };

    handleSubmit = (e, currentPage = 1) => {
        const { productId } = this.props;
        e && e.preventDefault();
        this.needToScroll = true;
        const keyword = this.inputRef.current.getValue().trim();

        if (keyword === '') {
            return;
        }

        const page = currentPage;
        const offset = (page - 1) * PAGE_SIZE;
        bazaarVoiceApi
            .searchQuestionsAnswers(productId, 4, keyword, offset)
            // eslint-disable-next-line object-curly-newline
            .then(({ totalResults, results }) => {
                this.setState(
                    {
                        totalResults,
                        questions: results || [],
                        currentPage,
                        hasSearchResults: true
                    },
                    () => {
                        if (this.needToScroll) {
                            setTimeout(() => UI.scrollTo({ elementId: 'QandA' }));
                            this.needToScroll = false;
                        }

                        const actionLink = 'questions&answers:search';
                        const eventType = totalResults > 0 ? anaConsts.Event.EVENT_58 : anaConsts.Event.EVENT_59;
                        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                            data: {
                                eventStrings: eventType,
                                searchAnswersKeyword: keyword,
                                actionInfo: actionLink,
                                linkName: actionLink
                            }
                        });
                    }
                );
            });
    };

    getSearchSortSection = () => {
        const { isSearchEnabled, sortBy, hasSearchResults } = this.state;

        if (isSearchEnabled) {
            return (
                <Grid
                    is='form'
                    gap={[5, null, 2]}
                    columns={['1fr auto', null, 1]}
                    marginRight={[null, null, 5]}
                    onSubmit={this.handleSubmit}
                >
                    <TextInput
                        type='search'
                        autoOff={true}
                        name='keyword'
                        id='qa_search_input'
                        maxLength={70}
                        placeholder={getText('searchKeyword')}
                        ref={this.inputRef}
                        isSmall={true}
                        marginBottom={null}
                        value={(this.inputRef.current && this.inputRef.current.getValue()) || ''}
                        contentAfter={
                            <button
                                css={styles.clearButton}
                                type='button'
                                data-at={Sephora.debug.dataAt('qa_search_icon_cross')}
                                onClick={() => {
                                    this.inputRef.current.empty();
                                    this.inputRef.current.focus();
                                }}
                            >
                                <Icon
                                    name='x'
                                    size={8}
                                />
                            </button>
                        }
                    />
                    <Link
                        color='blue'
                        padding={2}
                        margin={-2}
                        data-at={Sephora.debug.dataAt('qa_search_cancel')}
                        onClick={() => {
                            this.setState({ isSearchEnabled: false });

                            if (hasSearchResults) {
                                this.setState({ hasSearchResults: false });
                                this.loadInitialQuestions();
                            }
                        }}
                        children={getText('cancel')}
                    />
                </Grid>
            );
        } else {
            return (
                <Flex>
                    <Pill
                        aria-label={getText('searchAriaLabel')}
                        fontSize='md'
                        paddingX={null}
                        width={36}
                        marginRight='.375em'
                        onClick={() =>
                            this.setState(
                                {
                                    isSearchEnabled: true
                                },
                                () => {
                                    this.inputRef.current.focus();
                                }
                            )
                        }
                    >
                        <Icon
                            name='search'
                            size='1em'
                        />
                    </Pill>
                    <Filter
                        id='questions_answers_filter_sort'
                        dropDownDataAt={'sorting_option_list'}
                        sortBtnDataAt={'sort'}
                        key={SORT_FILTER_NAME}
                        name={SORT_FILTER_NAME}
                        isSingleSelection={true}
                        title={getText('sort')}
                        applyFilters={this.applySortSelection}
                        selected={[sortBy.value]}
                        trigger={getTriggerPill}
                        content={props => {
                            return filterUtils.QUESTIONS_SORT_TYPES.map(filter => {
                                const label = getText(filter.name);
                                const { onClick, isSelected } = props;

                                return (
                                    <RadioFilter
                                        key={filter.key}
                                        label={label}
                                        value={filter.value}
                                        onClick={onClick}
                                        isSelected={isSelected(filter.value)}
                                    />
                                );
                            });
                        }}
                    />
                </Flex>
            );
        }
    };

    render() {
        const { productId, skuId } = this.props;

        const {
            showMoreQuestions, totalResults, questions, currentPage, sortBy, hasSearchResults
        } = this.state;

        const hasResults = totalResults > 0;
        const totalPages = Math.ceil(totalResults / PAGE_SIZE);
        const maxPages = 999;

        const totalBreadcrumb = totalResults > 999 ? `${Math.floor(totalResults / 1000)}k` : totalResults;
        const breadcrumbFromPosition = (currentPage - 1) * PAGE_SIZE + 1;
        const breadcrumbToPosition = PAGE_SIZE * currentPage > totalResults ? totalResults : PAGE_SIZE * currentPage;

        return (
            <Box paddingBottom={hasResults ? [6, 8] : [4, 5]}>
                <Divider />
                <Grid
                    gap={1}
                    lineHeight='tight'
                    columns={['1fr auto', 1]}
                    alignItems='baseline'
                >
                    <Text
                        is='h2'
                        marginTop='1em'
                        fontSize={['md', 'lg']}
                        fontWeight='bold'
                        data-at={Sephora.debug.dataAt('questions_answers_section')}
                        children={`${getText('qAndATitle')} (${totalResults})`}
                    />
                    <div>
                        <Link
                            padding={2}
                            margin={-2}
                            color='blue'
                            onClick={() => redirectToSubmitQuestionPage(productId)}
                            data-at={Sephora.debug.dataAt('question_ask_link')}
                            children={getText('askAQuestionLink')}
                        />
                    </div>
                </Grid>
                {(hasResults || hasSearchResults) && (
                    <Grid
                        columns={[null, null, '212px 1fr']}
                        marginTop={4}
                        gap={[5, null, 0]}
                        alignItems='flex-start'
                    >
                        {this.getSearchSortSection()}
                        <Box maxWidth={718}>
                            <Text
                                is='h3'
                                fontWeight='bold'
                                data-at={hasSearchResults && !hasResults ? Sephora.debug.dataAt('qa_no_results_message') : null}
                                marginBottom={1}
                                paddingY={hasResults || '.5em'}
                                children={
                                    hasSearchResults
                                        ? hasResults
                                            ? getText(totalResults === 1 ? 'searchKeywordResult' : 'searchKeywordResults', [
                                                totalResults,
                                                this.inputRef.current.getValue()
                                            ])
                                            : getText('sorryNoSearchResults', [this.inputRef.current.getValue()])
                                        : getText(sortBy.name)
                                }
                            />
                            {totalPages > 1 && showMoreQuestions && (
                                <Text
                                    data-at={Sephora.debug.dataAt('viewing_questions_count_label')}
                                    is='p'
                                    fontSize='sm'
                                    lineHeight='tight'
                                    color='gray'
                                    marginBottom={1}
                                    children={getText('fromTo', [breadcrumbFromPosition, breadcrumbToPosition, totalBreadcrumb])}
                                />
                            )}
                            {this.getQuestionsToShow().map((item, index) => (
                                <React.Fragment key={item.questionId}>
                                    {index > 0 && (
                                        <Divider
                                            marginY={4}
                                            marginX={[-2, 0]}
                                        />
                                    )}
                                    <Question
                                        productId={productId}
                                        skuId={skuId}
                                        {...item}
                                    />
                                </React.Fragment>
                            ))}
                            {totalPages > 1 && showMoreQuestions && (
                                <Pagination
                                    marginTop={6}
                                    totalPages={totalPages > maxPages ? maxPages : totalPages}
                                    currentPage={currentPage}
                                    scrollElementId='QandA'
                                    handlePageClick={this.handlePageClick}
                                />
                            )}
                            {questions.length > 1 && (
                                <Button
                                    data-at={Sephora.debug.dataAt('show_more_question_answer')}
                                    variant='secondary'
                                    marginTop={6}
                                    minWidth='18.5em'
                                    onClick={this.showMore}
                                >
                                    {!showMoreQuestions ? getText('showMoreQandA') : getText('showLess')}
                                </Button>
                            )}
                        </Box>
                    </Grid>
                )}
            </Box>
        );
    }
}

const styles = {
    clearButton: {
        color: colors.white,
        backgroundColor: colors.gray,
        lineHeight: 0,
        borderRadius: 99999,
        width: 16,
        height: 16,
        marginRight: space[2],
        alignSelf: 'center',
        textAlign: 'center',
        '.no-touch &:hover': {
            backgroundColor: colors.black
        }
    }
};

export default wrapComponent(QuestionsAndAnswers, 'QuestionsAndAnswers', true);
