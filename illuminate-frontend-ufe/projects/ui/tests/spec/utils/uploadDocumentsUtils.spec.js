import UploadDocumentsUtils from 'utils/taxExemption/uploadDocumentsUtils';

describe('Upload Documents Utils', () => {
    describe('validateStep function', () => {
        it('returns isValid false if data uploadDocuments contains no elements', () => {
            const data = {
                uploadDocuments: [],
                freightForwarder: 'test',
                validateFreightForwarder: false
            };
            const { isValid, errors } = UploadDocumentsUtils.validateStep(data);

            expect(isValid).toBe(false);
            expect(errors).toEqual({ invalidFile: 'The file could not be uploaded. Please check the file size.' });
        });

        it('returns isValid true if data uploadDocuments contains no element and freight forwarder is true', () => {
            const data = {
                uploadDocuments: [],
                freightForwarder: 'test',
                validateFreightForwarder: true
            };
            const { isValid } = UploadDocumentsUtils.validateStep(data);

            expect(isValid).toBe(true);
        });

        it('returns isValid false if freightForwarder is missing and validateFreightForwarder is true', () => {
            const data = {
                uploadDocuments: [new File([''], 'test.jpg', { type: 'image/jpeg' })],
                freightForwarder: undefined,
                validateFreightForwarder: true
            };

            const { isValid, errors } = UploadDocumentsUtils.validateStep(data);

            expect(isValid).toBe(false);
            expect(errors).toEqual({ missingFreightForwarder: 'Please select one of the following' });
        });

        it('returns isValid true if uploadDocuments and freightForwarder are present', () => {
            const data = {
                uploadDocuments: [new File([''], 'test.jpg', { type: 'image/jpeg' })],
                freightForwarder: 'test',
                validateFreightForwarder: true
            };

            const { isValid } = UploadDocumentsUtils.validateStep(data);

            expect(isValid).toBe(true);
        });

        it('ignores uploadDocuments check if validateFreightForwarder is true', () => {
            const data = {
                uploadDocuments: [],
                freightForwarder: 'test',
                validateFreightForwarder: true
            };

            const { errors } = UploadDocumentsUtils.validateStep(data);

            expect(errors.invalidFile).toBe(undefined);
        });

        it('ignores freightForwarder check if validateFreightForwarder is false', () => {
            const data = {
                uploadDocuments: [new File([''], 'test.jpg', { type: 'image/jpeg' })],
                freightForwarder: undefined,
                validateFreightForwarder: false
            };

            const { isValid } = UploadDocumentsUtils.validateStep(data);

            expect(isValid).toBe(true);
        });
    });

    describe('validateFileChange function', () => {
        it('returns isValid false if file is not provided', () => {
            const { isValid, errors } = UploadDocumentsUtils.validateFileChange(undefined, [new File([''], 'test.jpg', { type: 'image/jpeg' })]);
            expect(isValid).toBe(false);
            expect(errors).toEqual({ invalidFile: 'The file could not be uploaded. Please check the file size.' });
        });

        it('returns isValid false if files array is greater than allowed max files', () => {
            const { isValid, errors } = UploadDocumentsUtils.validateFileChange(
                new File([''], 'test.jpg', { type: 'image/jpeg' }),
                Array(4).fill(new File([''], 'test.jpg', { type: 'image/jpeg' }))
            );
            expect(isValid).toBe(false);
            expect(errors).toEqual({ invalidFile: 'The file could not be uploaded. Please check the file size.' });
        });

        it('returns isValid true when all parameters are correct', () => {
            const { isValid, newFiles } = UploadDocumentsUtils.validateFileChange(new File([''], 'test.jpg', { type: 'image/jpeg' }), [
                new File([''], 'test.jpg', { type: 'image/jpeg' })
            ]);
            expect(isValid).toBe(true);
            expect(newFiles.length).toBe(2);
        });
    });
});
