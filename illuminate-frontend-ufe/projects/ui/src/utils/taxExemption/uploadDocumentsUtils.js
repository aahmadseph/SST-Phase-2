import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

const MAX_FILES_ALLOWED = 3;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/img', 'application/pdf'];

const validateStep = data => {
    const errors = {};

    if (!data.uploadDocuments.length && !data.validateFreightForwarder) {
        errors.invalidFile = getText('invalidFile');
    }

    if (!data.freightForwarder && data.validateFreightForwarder) {
        errors.missingFreightForwarder = getText('missingFreightForwarder');
    }

    const isValid = Object.keys(errors).length === 0;

    return { isValid, errors };
};

const validateFileChange = (file, files) => {
    let isValid = true;
    let errors = null;
    const newFiles = [...files];

    if (!file || newFiles.length >= MAX_FILES_ALLOWED) {
        isValid = false;
        errors = { invalidFile: getText('invalidFile') };

        return { isValid, errors, newSize: 0, newFiles };
    }

    const currentFileTotalSize = newFiles.reduce((total, currentFile) => total + currentFile?.size, 0);
    const newSize = currentFileTotalSize + (file?.size || 0);

    if (newSize > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(file.type)) {
        isValid = false;
        errors = { invalidFile: getText('invalidFile') };
    } else {
        newFiles.push(file);
    }

    return { isValid, errors, newSize, newFiles };
};

export default {
    validateStep,
    validateFileChange,
    MAX_FILES_ALLOWED,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES
};
