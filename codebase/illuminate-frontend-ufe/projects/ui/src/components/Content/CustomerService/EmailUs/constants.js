import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Content/CustomerService/EmailUs/locales', 'constants');

// Important! Do not translate the value attribute.
const subjectOptions = [
    {
        code: '001',
        label: getText('orderInfo'),
        value: 'Order Information'
    },
    {
        code: '002',
        label: getText('productInfo'),
        value: 'Product Information'
    },
    {
        code: '003',
        label: getText('beautyInsider'),
        value: 'Beauty Insider'
    },
    {
        code: '004',
        label: getText('passwordReset'),
        value: 'Password Reset'
    },
    {
        code: '005',
        label: getText('askBeautyAdviser'),
        value: 'Ask a Beauty Adviser'
    },
    {
        code: '006',
        label: getText('retailStoreInfo'),
        value: 'Retail Store Information'
    },
    {
        code: '007',
        label: getText('websiteFeedback'),
        value: 'Website Feedback'
    },
    {
        code: '008',
        label: getText('complimentComplaint'),
        value: 'Compliment or Complaint'
    },
    {
        code: '009',
        label: getText('general'),
        value: 'General Feedback or Question'
    },
    {
        code: '010',
        label: getText('ratingsReviews'),
        value: 'Ratings and Reviews'
    }
];

const maxLength = { commentText: 1000 };

export {
    subjectOptions, maxLength
};
