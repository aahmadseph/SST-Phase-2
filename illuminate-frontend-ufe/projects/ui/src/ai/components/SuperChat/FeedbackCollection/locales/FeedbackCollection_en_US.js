const resources = {
    thanksMessage: 'Thanks for your feedback!',
    submit: 'Submit',
    close: 'close'
};

export default function getResource(label) {
    return resources[label];
}
