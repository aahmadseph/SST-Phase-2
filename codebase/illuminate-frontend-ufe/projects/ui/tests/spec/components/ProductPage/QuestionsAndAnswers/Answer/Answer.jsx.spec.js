// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');
// const Answer = require('components/ProductPage/QuestionsAndAnswers/Answer/Answer').default;
// const languageLocale = require('utils/LanguageLocale').default;
// const dateUtils = require('utils/Date').default;

// describe('<Answer />', () => {
//     let wrapper;
//     let component;
//     let props;

//     beforeEach(() => {
//         props = {
//             answerText: 'This is my answer',
//             UserNickname: 'John',
//             totalNegativeFeedbackCount: 5,
//             totalPositiveFeedbackCount: 2,
//             userNickname: 'userName',
//             submissionTime: '2020-10-01T22:38:40.000+00:00',
//             badges: {
//                 IncentivizedReviewBadge: true,
//                 StaffContextBadge: true
//             },
//             badgesOrder: ['VerifiedPurchaser']
//         };
//         wrapper = shallow(<Answer {...props} />, { disableLifecycleMethods: true });
//         component = wrapper.instance();
//     });

//     it('should render correctly answer summary', () => {
//         // Act
//         const answerSummary = wrapper.findWhere(n => n.name() === 'Text' && n.text() === 'This is my answer');
//         // Assert
//         expect(answerSummary.length).toBe(1);
//     });

//     it('should render Feedback', () => {
//         //Act
//         const feedback = wrapper.find('Feedback');
//         // Assert
//         expect(feedback.exists()).toBeTruthy();
//     });

//     it('should render answer submission time and user nickName', () => {
//         const postedDate = dateUtils.formatSocialDate(props.submissionTime, true);
//         //Act
//         const answerSubmission = wrapper.findWhere(n => n.name() === 'Text' && n.text() === `Answered ${postedDate} by ${props.userNickname}`);
//         // Assert
//         expect(answerSubmission.exists()).toBeTrue();
//     });

//     it('should render is Verified Purchaser if badge is present', () => {
//         //Act
//         const isVerified = wrapper.findWhere(n => n.name() === 'Text' && n.text() === 'Verified Purchase');
//         // Assert
//         expect(isVerified.exists()).toBeTrue();
//     });

//     it('should render is Sephora Employee if badge is present', () => {
//         //Act
//         const sephoraEmployee = wrapper.findWhere(n => n.name() === 'span' && n.text() === 'Sephora Employee');
//         // Assert
//         expect(sephoraEmployee.exists()).toBeTrue();
//     });

//     it('should render is Sephora Employee if badge is present', () => {
//         //Act
//         const receivenFreeProduct = wrapper.findWhere(n => n.name() === 'span' && n.text() === 'Received free product');
//         // Assert
//         expect(receivenFreeProduct.exists()).toBeTrue();
//     });

//     describe('toggleReadMore()', () => {
//         it('should change showMore state value to true', () => {
//             //Act
//             component.toggleReadMore();
//             // Assert
//             expect(component.state.showMore).toBeTrue();
//         });
//     });
// });
