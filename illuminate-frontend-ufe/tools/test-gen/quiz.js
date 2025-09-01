const inquirer = require('inquirer');
const compQuestion = {
    type: 'input',
    name: 'comp',
    message: "What's your file name? (hit ENTER for all-modified)"
};
const methodQuestion = {
    type: 'input',
    name: 'method',
    message: "What's your method name? (hit ENTER for all)"
};
let callback = null;

function execute(predefinedCompName) {
    const firstQuestionPromise = predefinedCompName ? Promise.resolve({ comp: predefinedCompName }) : inquirer.prompt(compQuestion);

    firstQuestionPromise.then(compAnswer => {
        if (compAnswer.comp) {
            if (compAnswer.comp.indexOf('.c.js') === -1 && compAnswer.comp.indexOf('.jsx') === -1 && compAnswer.comp.indexOf('.js') === -1) {
                console.log(
                    'Please specify an extension of your file as part of the name ' + '(.c.js / .jsx / .js), so we can select a proper file.'
                );
                execute();
            } else {
                inquirer.prompt(methodQuestion).then(methodAnswer => {
                    callback(compAnswer.comp, methodAnswer.method);
                });
            }
        } else {
            console.log('TODO: cover all the modified code');
            execute();
        }
    });
}

function error(message, predefinedCompName) {
    console.log(message);
    execute.apply(predefinedCompName);
}

function errorReport(message) {
    error(message + ' Please directly contact Aleksei Punov and send him ' + 'your file name to support your issue.');

    return { message };
}

function initializeCallback(cb) {
    callback = cb;
}

const Quiz = {
    initializeCallback,
    execute,
    error,
    errorReport
};

module.exports = Quiz;
