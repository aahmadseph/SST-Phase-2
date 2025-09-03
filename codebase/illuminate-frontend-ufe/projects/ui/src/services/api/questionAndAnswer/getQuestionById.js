import apiUtil from 'utils/Api';

//https://confluence.sephora.com/wiki/display/ILLUMINATE/Bazaarvoice+APIs

function getQuestionById(questionId) {
    const bvSettings = Sephora.configurationSettings.bvApi_rwdQandA_desktop_read;
    const HOST = bvSettings.host;
    const TOKEN = bvSettings.token;
    const VERSION = bvSettings.version;

    const opts = {
        url: `https://${HOST}/data/questions.json`,
        method: 'GET',
        qsParams: {
            apiversion: VERSION,
            passkey: TOKEN,
            Filter: `Id:${questionId}`
        }
    };

    return apiUtil
        .request(opts)
        .then(response => response.json())
        .then(data => {
            const question = data?.Results?.[0]?.QuestionDetails;

            if (question) {
                data.Results[0].QuestionDetails = decodeURIComponent(question);
            }

            return data;
        })
        .catch(reason => {
            return reason;
        });
}

export default getQuestionById;
