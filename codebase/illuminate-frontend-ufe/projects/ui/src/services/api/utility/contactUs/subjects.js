import ufeApi from 'services/api/ufeApi';
import helpersUtils from 'utils/Helpers';
import languageLocaleUtils from 'utils/LanguageLocale';
import { CHANNELS } from 'constants/Channels';

const { fixArrayResponse } = helpersUtils;
const { getCurrentCountry, getCurrentLanguageLocale } = languageLocaleUtils;

// https://jira.sephora.com/browse/ATGD-33

const mapDataToFormSubjectsShape = ({ data } = {}) => {
    return data.map(subject => ({
        ...subject,
        label: subject.subject,
        value: subject.subject
    }));
};

function subjects(token) {
    const channel = CHANNELS.RWD;
    const country = getCurrentCountry();
    const locale = getCurrentLanguageLocale();
    const url = `/gway/v1/dotcom/util/subjects?channel=${channel}&country=${country}&locale=${locale}`;

    const options = {
        method: 'GET',
        headers: {
            authorization: `Bearer ${token}`
        }
    };

    return ufeApi.makeRequest(url, options).then(response => {
        const data = fixArrayResponse(response);

        return data.errorCode || data.errors ? Promise.reject(data) : mapDataToFormSubjectsShape(data);
    });
}

export default subjects;
