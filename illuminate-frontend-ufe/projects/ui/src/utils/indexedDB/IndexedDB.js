import { ArgumentOutOfRangeException } from 'exceptions';
import { isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import QueryType from 'utils/indexedDB/QueryType';
import Tables from 'utils/indexedDB/Tables';

const LocalOrQAEnvironment = isUfeEnvQA || isUfeEnvLocal;
const SUPPORTED_QUERY_TYPES = new Set(Object.values(QueryType));

/**
 * IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
 */
class IndexedDB {
    constructor(name, version = 1) {
        this.name = name;
        this.version = version;
        this.connection = null;
    }

    onDBOpenSuccess = resolve => event => {
        if (LocalOrQAEnvironment) {
            Sephora.logger.verbose('[IndexedDB] [onDBOpenSuccess]');
        }

        const db = event.target.result;
        resolve(db);
    };

    onDBOpenError = reject => event => {
        if (LocalOrQAEnvironment) {
            Sephora.logger.verbose(`[IndexedDB] [onDBOpenSuccess] Error code: ${event.target.errorCode}`);
        }

        this.connection = null;
        reject(event);
    };

    onDBInitialization = reject => event => {
        try {
            if (LocalOrQAEnvironment) {
                Sephora.logger.verbose('[IndexedDB] [onDBInitialization]');
            }

            const db = event.target.result;
            db.onerror = this.onDBOpenError(reject);
            db.createObjectStore(Tables.ApiCache);
            // it's impossible to use indexes as we store not structured data.
            // db.createObjectStore(Tables.ApiCache).createIndex('name', 'path', { unique: true });
            db.createObjectStore(Tables.Cache);
        } catch (error) {
            reject(error);
        }
    };

    onTransactionComplete = (_connection, _transaction, queryType, key) => _event => {
        if (LocalOrQAEnvironment) {
            Sephora.logger.verbose(`[IndexedDB] [onTransactionComplete] [${queryType}] Key: ${key}`);
        }
    };

    onTransactionError = (_connection, transaction, queryType, key) => _event => {
        if (LocalOrQAEnvironment) {
            Sephora.logger.verbose(`[IndexedDB] [onTransactionError] [${queryType}] Key: ${key}, Transanction error: ${transaction.error}`);
        }

        this.connection = null;
    };

    onQuerySuccess = (queryType, resolve, key) => event => {
        if (LocalOrQAEnvironment) {
            Sephora.logger.verbose(`[IndexedDB] [onQuerySuccess] [${queryType}] Key: ${key}`);
        }

        if (queryType === QueryType.InsertOrUpdate || queryType === QueryType.Delete) {
            resolve();
        } else if (queryType === QueryType.Select) {
            resolve(event.target.result);
        }
    };

    onQueryError = (queryType, reject, key) => event => {
        if (LocalOrQAEnvironment) {
            Sephora.logger.verbose(`[IndexedDB] [onQueryError] [${queryType}]  Key: ${key}, Error code: ${event.target.errorCode}`);
        }

        this.connection = null;
        reject(event.target);
    };

    openConnection() {
        if (!this.connection) {
            this.connection = new Promise((resolve, reject) => {
                const dbOpenRequest = window.indexedDB.open(this.name, this.version);
                dbOpenRequest.onerror = this.onDBOpenError(reject);
                dbOpenRequest.onsuccess = this.onDBOpenSuccess(resolve);
                dbOpenRequest.onupgradeneeded = this.onDBInitialization(reject);
            });
        }

        return this.connection;
    }

    closeConnection() {
        if (this.connection) {
            return this.connection
                .then(connection => {
                    try {
                        connection.close();

                        if (LocalOrQAEnvironment) {
                            Sephora.logger.verbose('[IndexedDB] Connection closed manually');
                        }
                    } catch (err) {
                        if (LocalOrQAEnvironment) {
                            Sephora.logger.verbose(`[IndexedDB] Error closing connection: ${err.message}`);
                        }
                    }
                })
                .catch(err => {
                    if (LocalOrQAEnvironment) {
                        Sephora.logger.verbose(`[IndexedDB] Error accessing connection for closing: ${err.message}`);
                    }
                })
                .finally(() => {
                    this.connection = null;
                });
        }

        return Promise.resolve();
    }

    executeQuery(queryType, { key, value }, tableName = Tables.Cache) {
        if (!SUPPORTED_QUERY_TYPES.has(queryType)) {
            throw new ArgumentOutOfRangeException('queryType');
        }

        return new Promise((resolve, reject) => {
            this.openConnection().then(connection => {
                try {
                    const isolationLevel = queryType === QueryType.Select ? 'readonly' : 'readwrite';

                    const transaction = connection.transaction(tableName, isolationLevel);
                    transaction.oncomplete = this.onTransactionComplete(connection, transaction, queryType, key);
                    transaction.onerror = this.onTransactionError(connection, transaction, queryType, key);

                    const table = transaction.objectStore(tableName);
                    let query;

                    if (queryType === QueryType.InsertOrUpdate) {
                        query = table.put(value, key);
                    } else if (queryType === QueryType.Select) {
                        query = table.get(key);
                    } else if (queryType === QueryType.Delete) {
                        query = table.delete(key);
                    }

                    query.onsuccess = this.onQuerySuccess(queryType, resolve, key);
                    query.onerror = this.onQueryError(queryType, reject, key);
                } catch (exception) {
                    Sephora.logger.error(exception);
                    this.connection = null;
                    reject(exception);
                }

                return connection;
            });
        });
    }
}

export default IndexedDB;
