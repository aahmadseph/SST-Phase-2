import fs from 'fs';
import path from 'path';

const AL_BASEURL = 'https://reactor.adobe.io';
const AL_AUTHURL = 'https://ims-na1.adobelogin.com/ims/token/v3';

const AL_PROPERTYID = 'PR28bc45fcba184e70b64b2f0cf7fe70f8';
const AL_APIKEY = '363e66b77f5943459ffb59bf8b805269';
const AL_ORGID = 'F6281253512D2BB50A490D45@AdobeOrg';
const AL_SECRET = process.env.ADOBE_LAUNCH_SECRET;

const AL_BACKUP_PATH = path.resolve('../adobe-launch/adobeLaunchBackup');

const getAccessToken = async () => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            // eslint-disable-next-line camelcase
            grant_type: 'client_credentials',
            // eslint-disable-next-line camelcase
            client_id: AL_APIKEY,
            // eslint-disable-next-line camelcase
            client_secret: AL_SECRET,
            scope: 'AdobeID,openid,read_organizations,additional_info.job_function,additional_info.projectedProductContext,additional_info.roles'
        })
    };

    const response = await fetch(AL_AUTHURL, options);

    if (!response.ok) {
        // eslint-disable-next-line no-console
        console.log(`Error while authenticating. Status: ${response.status}`);

        return '';
    }

    const data = await response.json();

    return data?.access_token || '';
};

const requestOptions = alAccessToken => {
    return {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.api+json;revision=1',
            'Content-Type': 'application/vnd.api+json',
            'X-Api-Key': AL_APIKEY,
            'X-Gw-Ims-Org-Id': AL_ORGID,
            Authorization: alAccessToken
        }
    };
};

// Back up recursive functions
// ------------------------------------------------------------------------

/*
 * Configuration for the objects to be backed up.
 * Each object has the following properties:
 * - folder: the folder where the object will be saved.
 * - serviceUrl: the service URL to fetch the objects.
 * - childObject: the child object configuration.
 * The child object has the following properties:
 *   - folder: the folder where the child object will be saved.
 *   - serviceUrl: the service URL to fetch the child objects.
 *   - createFolder: if the folder should be created.
 *   - serviceUrlSufix: the sufix to be added to the service URL.
 *
 * As an example, this is the structure that will be created:
 * - extensions
 *   - [extensionId] / [extensionId].json
 * - dataElements
 *   - [dataElementId] / [dataElementId].json
 * - rules
 *   - [ruleId] / [ruleId].json
 *   - [ruleId] / components / [componentId].json
 */
const alObjectsConfiguration = [
    {
        folder: 'extensions',
        serviceUrl: `${AL_BASEURL}/properties/${AL_PROPERTYID}/extensions`
    },
    {
        folder: 'dataElements',
        serviceUrl: `${AL_BASEURL}/properties/${AL_PROPERTYID}/data_elements`
    },
    {
        folder: 'rules',
        serviceUrl: `${AL_BASEURL}/properties/${AL_PROPERTYID}/rules`,
        childObject: {
            folder: 'components',
            serviceUrl: `${AL_BASEURL}/rules`,
            serviceUrlSufix: 'rule_components',
            createFolder: false
        }
    }
];

// Pulls Objects from Adobe Launch
const getObjects = async (pageNumber = 1, configObject) => {
    const { serviceUrl, alAccessToken } = configObject;
    const options = requestOptions(alAccessToken);
    const url = `${serviceUrl}?page[number]=${pageNumber}`;

    try {
        const response = await fetch(url, options);
        const objects = await response.json();

        return objects;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);

        return [];
    }
};

const processObjects = async (alObjects, configObject) => {
    const { folder, childObject, alAccessToken, createFolder = true } = configObject;

    for await (const alObject of alObjects) {
        const contextBaseFolder = createFolder ? `${folder}/${alObject.id}` : folder;
        const folderName = `${AL_BACKUP_PATH}/${contextBaseFolder}`;

        if (!fs.existsSync(folderName) && createFolder) {
            // Creates the folder for the rule.
            fs.mkdirSync(folderName);
        }

        const objectJsonString = JSON.stringify(alObject, null, 2);

        // Creates the rule JSON file.
        fs.writeFileSync(`${folderName}/${alObject.id}.json`, objectJsonString, 'utf8');

        if (childObject) {
            const childContextFolder = `${contextBaseFolder}/${childObject.folder}`;
            const childContextFolderToCreate = `${AL_BACKUP_PATH}/${childContextFolder}`;

            if (!fs.existsSync(childContextFolderToCreate)) {
                // Creates the folder for the rule.
                fs.mkdirSync(childContextFolderToCreate);
            }

            const childServiceUrl = `${childObject.serviceUrl}/${alObject.id}/${childObject.serviceUrlSufix}`;

            const childConfigObject = {
                alAccessToken,
                createFolder: childObject.createFolder,
                serviceUrl: childServiceUrl,
                folder: childContextFolder
            };

            await recursiveObjectProcessing(1, childConfigObject);
        }
    }
};

const recursiveObjectProcessing = async (page = null, configObject) => {
    if (!page) {
        return;
    }

    const alObjects = await getObjects(page, configObject);

    await processObjects(alObjects?.data || [], configObject);

    const meta = alObjects?.meta || {};
    const nextPage = meta?.pagination?.next_page;

    await recursiveObjectProcessing(nextPage, configObject);
};

const initializeFolderStructure = () => {
    if (!fs.existsSync(AL_BACKUP_PATH)) {
        // Creates the folder for the rule.
        fs.mkdirSync(AL_BACKUP_PATH);
    }

    for (const configObject of alObjectsConfiguration) {
        const folderName = `${AL_BACKUP_PATH}/${configObject.folder}`;

        if (!fs.existsSync(folderName)) {
            // Creates the folder for the rule.
            fs.mkdirSync(folderName);
        }
    }
};

// Main Backup Process
// ------------------------------------------------------------------------

async function proceedWithBackup() {
    // Authenticates with Adobe to extract the access token
    const alAccessToken = await getAccessToken();

    if (alAccessToken === '') {
        return;
    }

    initializeFolderStructure();

    // Starts the backup process.
    for await (const configObject of alObjectsConfiguration) {
        configObject['alAccessToken'] = alAccessToken;

        await recursiveObjectProcessing(1, configObject);
    }
}

await proceedWithBackup();
