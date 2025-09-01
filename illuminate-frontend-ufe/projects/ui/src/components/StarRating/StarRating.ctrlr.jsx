/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass/BaseClass';
import { colors, screenReaderOnlyStyle } from 'style/config';

const GAP = 0.167;
const RATING_SCALE = 5;

const { wrapComponent } = FrameworkUtils;

class StarRating extends BaseClass {
    state = {
        rating: this.props.rating !== undefined ? this.props.rating : 0
    };

    static defaultProps = {
        size: 12
    };

    componentDidMount() {}

    starClick = starClicked => {
        this.setState({ rating: starClicked }, () => {
            this.props.starClick && this.props.starClick(starClicked);
        });
    };

    getRating = () => {
        return this.state.rating;
    };

    validateError = () => {
        const error = this.props.validate ? this.props.validate(this.state.value) : null;

        this.setState({ error: error });

        return error;
    };

    renderStars = reverse => {
        const rating = this.state.rating;
        const stars = [];
        const { isYellow } = this.props;

        for (let i = 0; i < RATING_SCALE; i++) {
            const starStyle = {
                display: 'inline-block',
                backgroundImage: `url(/img/ufe/icons/star${reverse ? '-outline' : ''}${isYellow ? '-yellow' : ''}.svg)`,
                backgroundSize: 'cover',
                width: '1em',
                height: '1em',
                marginLeft: i > 0 ? `${GAP}em` : null
            };
            const n = reverse ? RATING_SCALE - i : i + 1;
            stars.push(
                this.props.isEditable && !reverse ? (
                    <label
                        key={i}
                        data-at={rating >= n ? Sephora.debug.dataAt('selected-star') : null}
                        css={[
                            {
                                cursor: 'pointer',
                                '> span': {
                                    opacity: 0,
                                    transition: 'opacity .2s'
                                },
                                '.no-touch &:hover ~ * > span': { opacity: 0 }
                            },
                            rating >= n && {
                                '> span': { opacity: 1 }
                            }
                        ]}
                    >
                        <input
                            type='radio'
                            name='starRating'
                            css={{
                                position: 'absolute',
                                opacity: 0,
                                ':focus + *': {
                                    opacity: 1
                                }
                            }}
                            checked={rating === n}
                            onChange={() => this.starClick(n)}
                        />
                        <span
                            css={starStyle}
                            aria-label={`${n} star${n === 1 ? '' : 's'}`}
                        />
                    </label>
                ) : (
                    <span
                        key={i}
                        css={starStyle}
                    />
                )
            );
        }

        return stars;
    };

    render() {
        const {
            rating, isEditable, size, isCentered, legend
        } = this.props;

        const starWidth = rating > RATING_SCALE ? RATING_SCALE : rating < 0 ? 0 : rating;
        const roundedRating = Math.round(rating * 2) / 2;

        const RootComp = isEditable ? 'fieldset' : 'span';

        return (
            <RootComp
                aria-label={isEditable ? null : `${roundedRating > 0 ? roundedRating : 'No'} star${roundedRating === 1 ? '' : 's'}`}
                css={[
                    {
                        display: 'block',
                        color: colors.black,
                        fontSize: size,
                        width: `calc(${RATING_SCALE}em + ${(RATING_SCALE - 1) * GAP}em)`,
                        height: '1em',
                        position: 'relative',
                        overflow: 'hidden',
                        lineHeight: 0,
                        textAlign: 'left'
                    },
                    isCentered && {
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    },
                    isEditable && {
                        cursor: 'pointer'
                    }
                ]}
            >
                {isEditable && legend && (
                    <legend
                        css={screenReaderOnlyStyle}
                        children={legend}
                    />
                )}
                <span aria-hidden={isEditable ? true : null}>{this.renderStars(true)}</span>
                <span
                    data-at={Sephora.debug.dataAt('star_rating_style')}
                    css={[
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        },
                        isEditable
                            ? {
                                display: 'flex',
                                '.no-touch &:hover * > span': {
                                    opacity: 1
                                }
                            }
                            : {
                                opacity: 1
                            }
                    ]}
                    style={
                        !isEditable
                            ? {
                                width: (starWidth / 5) * 100 + '%'
                            }
                            : null
                    }
                >
                    {this.renderStars()}
                </span>
            </RootComp>
        );
    }
}

StarRating.propTypes = {
    rating: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    legend: PropTypes.string,
    isCentered: PropTypes.bool
};

export default wrapComponent(StarRating, 'StarRating');
