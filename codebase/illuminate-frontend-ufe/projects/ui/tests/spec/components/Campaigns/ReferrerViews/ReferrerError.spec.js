/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const ReferrerError = require('components/Campaigns/Referrer/ReferrerViews/ReferrerError').default;

describe('Referrer Error component', () => {
    let wrapper;
    const errors = {
        ERR_CAMP_REF_CMP_NOT_STARTED: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'Sorry, the promotion you entered has not started.'
            }
        ],
        ERR_CAMP_REF_INVALID_COUNTRY: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'This promotion is not available for this country.'
            }
        ],
        ERR_CAMP_REF_CMP_EXPIRED: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'Sorry, the promotion you entered has expired.'
            }
        ],
        ERR_CE_CMP_NOT_FOUND: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'This promotion does not exist.'
            }
        ],
        CUSTOM_ALREADY_BI: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'This promotion is not available to existing Beauty Insider members.'
            }
        ],
        CUSTOM_BI_DOWN: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'Beauty Insider is temporarily unavailable.'
            },
            {
                dataAt: 'promo_error_message_second_line',
                error: 'We’re working on getting it back online. Please try again later. In the meantime, explore our site for inspiration.'
            }
        ],
        CUSTOM_ADVOCACY_DOWN: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'Oops! The service is temporarily unavailable.'
            },
            {
                dataAt: 'promo_error_message_second_line',
                error: 'We’re working on getting it back online. Please try again later. In the meantime, explore our site for inspiration.'
            }
        ],
        // ERR_CAMP_REF_MAX_COUNT_RCHD: [
        //     {
        //         dataAt: 'promo_error_message_first_line',
        //         error: 'Oops! Something went wrong.'
        //     },
        //     {
        //         dataAt: 'promo_error_message_second_line',
        //         error: 'Please reach out to the person who sent you the link.'
        //     }
        // ],
        MADE_UP: [
            {
                dataAt: 'promo_error_message_first_line',
                error: 'Oops! The service is temporarily unavailable.'
            },
            {
                dataAt: 'promo_error_message_second_line',
                error: 'We’re working on getting it back online. Please try again later. In the meantime, explore our site for inspiration.'
            }
        ]
    };

    for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
            it(`should display the correct error message for ${key}`, () => {
                const props = { errors: { errorCode: key } };
                wrapper = shallow(<ReferrerError {...props} />);
                const errorGroup = errors[key];
                errorGroup.forEach(({ dataAt, error }) => {
                    const errorText = wrapper
                        .findWhere(n => n.prop('data-at') === dataAt)
                        .children()
                        .text();
                    expect(errorText).toEqual(error);
                });
            });
        }
    }
});
