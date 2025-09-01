import { ArgumentNullException } from 'exceptions';
import helpers from 'utils/Helpers';
import IndexedDB from 'utils/indexedDB/IndexedDB';
import QueryType from 'utils/indexedDB/QueryType';
import Tables from 'utils/indexedDB/Tables';

/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 */
class IndexedDBStorage {
    constructor(name, version) {
        this.db = new IndexedDB(name, version);
    }

    async setItem(key, value, expiry = null) {
        if (!key) {
            throw new ArgumentNullException('key');
        }

        try {
            const dto = { data: value };

            if (expiry) {
                const date = typeof expiry === 'number' ? new Date(Date.now() + expiry) : expiry;
                dto.expiry = date;
            }

            dto.updated = new Date(Date.now());
            await this.db.executeQuery(QueryType.InsertOrUpdate, { key, value: dto }, Tables.Cache);
        } catch {
            // Do nothing.
        }
    }

    async getItem(key, ignoreExpiry = false, removeExpired = false, returnDataWithExpiry = false) {
        if (!key) {
            throw new ArgumentNullException('key');
        }

        let value;

        try {
            value = await this.db.executeQuery(QueryType.Select, { key }, Tables.Cache);

            if (helpers.isObject(value)) {
                const { data = null, expiry = null } = value;
                const isExpired = Date.parse(expiry) < new Date().getTime();

                if (expiry && !ignoreExpiry && isExpired) {
                    if (removeExpired) {
                        await this.removeItem(key);
                    }

                    value = null;
                } else {
                    value = returnDataWithExpiry ? value : data;
                }
            }
        } catch {
            value = null;
        }

        return value;
    }

    async removeItem(key) {
        if (!key) {
            throw new ArgumentNullException('key');
        }

        return await this.db.executeQuery(QueryType.Delete, { key }, Tables.Cache);
    }
}

export default IndexedDBStorage;
