const { any, createSpy } = jasmine;

describe('IndexedDB', () => {
    let IndexedDB;
    let Tables;
    let QueryType;
    let ArgumentOutOfRangeException;

    beforeEach(() => {
        IndexedDB = require('utils/indexedDB/IndexedDB').default;
        Tables = require('utils/indexedDB/Tables').default;
        QueryType = require('utils/indexedDB/QueryType').default;
        ArgumentOutOfRangeException = require('exceptions').ArgumentOutOfRangeException;
    });

    it('should be defined', () => {
        expect(IndexedDB).toBeDefined();
    });

    it('should be a class', () => {
        expect(typeof IndexedDB).toBe('function');
    });

    describe('constructor', () => {
        it('should create an instance of IndexedDB', () => {
            // Arrange & Act
            const db = new IndexedDB('test');

            // Assert
            expect(db).toBeInstanceOf(IndexedDB);
        });

        it('should set the name property', () => {
            // Arrange
            const name = 'test';

            // Act
            const db = new IndexedDB(name);

            // Assert
            expect(db.name).toBe(name);
        });

        it('should set the version property', () => {
            // Arrange
            const version = 2;

            // Act
            const db = new IndexedDB('test', version);

            // Assert
            expect(db.version).toBe(version);
        });

        it('should set the connection property to null', () => {
            // Arrange & Act
            const db = new IndexedDB('test');

            // Assert
            expect(db.connection).toBeNull();
        });
    });

    describe('onQuerySuccess method', () => {
        let db;

        beforeEach(() => {
            db = new IndexedDB('test');
        });

        it('should call resolve function without agguments when event is fired for InsertOrUpdate query type', () => {
            // Arrange
            const queryType = QueryType.InsertOrUpdate;
            const queryParameters = { key: 'testKey' };
            const resolve = createSpy('resolve');
            const event = {};

            // Act
            const eventHandler = db.onQuerySuccess(queryType, resolve, queryParameters);
            eventHandler(event);

            // Assert
            expect(resolve).toHaveBeenCalledOnceWith();
        });

        it('should call resolve function without agguments when event is fired for the Delete query type', () => {
            // Arrange
            const queryType = QueryType.Delete;
            const queryParameters = { key: 'testKey' };
            const resolve = createSpy('resolve');
            const event = {};

            // Act
            const eventHandler = db.onQuerySuccess(queryType, resolve, queryParameters);
            eventHandler(event);

            // Assert
            expect(resolve).toHaveBeenCalledOnceWith();
        });

        it('should call resolve function with correct agguments when event is fired for Select query type', () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const resolve = createSpy('resolve');
            const event = { target: { result: 'asdasdasf' } };

            // Act
            const eventHandler = db.onQuerySuccess(queryType, resolve, queryParameters);
            eventHandler(event);

            // Assert
            expect(resolve).toHaveBeenCalledOnceWith(event.target.result);
        });
    });

    describe('onQueryError method', () => {
        let db;

        beforeEach(() => {
            db = new IndexedDB('test');
        });

        it('should call reject function with correct aggument when event is fired', () => {
            // Arrange
            const queryType = QueryType.InsertOrUpdate;
            const queryParameters = { key: 'testKey' };
            const resolve = createSpy('resolve');
            const event = { target: {} };

            // Act
            const eventHandler = db.onQueryError(queryType, resolve, queryParameters);
            eventHandler(event);

            // Assert
            expect(resolve).toHaveBeenCalledOnceWith(event.target);
        });
    });

    describe('openConnection method', () => {
        it('should return a Promise', () => {
            // Arrange
            const db = new IndexedDB('test');

            // Act
            const result = db.openConnection();

            // Assert
            expect(result).toBeInstanceOf(Promise);
        });

        it('should return the same Promise instance on every call', () => {
            // Arrange
            const db = new IndexedDB('test');

            // Act
            const result1 = db.openConnection();
            const result2 = db.openConnection();

            // Assert
            expect(result1).toBe(result2);
        });

        it('should call IDBFactory.open function', () => {
            // Arrange
            const db = new IndexedDB('test');
            const open = spyOn(window.indexedDB, 'open').and.returnValue({});

            // Act
            db.openConnection();

            // Assert
            expect(open).toHaveBeenCalledOnceWith(db.name, db.version);
        });

        it('should call onDBOpenError function with arguments', () => {
            // Arrange
            const db = new IndexedDB('test');
            const onDBOpenError = spyOn(db, 'onDBOpenError');

            // Act
            db.openConnection();

            // Assert
            expect(onDBOpenError).toHaveBeenCalledOnceWith(any(Function));
        });

        it('should call onDBOpenSuccess function with arguments', () => {
            // Arrange
            const db = new IndexedDB('test');
            const onDBOpenSuccess = spyOn(db, 'onDBOpenSuccess');

            // Act
            db.openConnection();

            // Assert
            expect(onDBOpenSuccess).toHaveBeenCalledOnceWith(any(Function));
        });

        it('should call onDBInitialization function with arguments', () => {
            // Arrange
            const db = new IndexedDB('test');
            const onDBInitialization = spyOn(db, 'onDBInitialization');

            // Act
            db.openConnection();

            // Assert
            expect(onDBInitialization).toHaveBeenCalledOnceWith(any(Function));
        });
    });

    describe('executeQuery method', () => {
        let db;

        beforeEach(() => {
            db = new IndexedDB('test');
        });

        it('should return a Promise', () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            spyOn(db, 'openConnection').and.callFake(() => ({ then: () => {} }));

            // Act
            const result = db.executeQuery(queryType, queryParameters);

            // Assert
            expect(result).toBeInstanceOf(Promise);
        });

        it('should return a new Promise instance on every call', () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            spyOn(db, 'openConnection').and.callFake(() => ({ then: () => {} }));

            // Act
            const result1 = db.executeQuery(queryType, queryParameters);
            const result2 = db.executeQuery(queryType, queryParameters);

            // Assert
            expect(result1).not.toBe(result2);
        });

        it('should call openConnection method', () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const openConnectionSpy = spyOn(db, 'openConnection').and.callFake(() => ({ then: () => {} }));

            // Act
            db.executeQuery(queryType, queryParameters);

            // Assert
            expect(openConnectionSpy).toHaveBeenCalledTimes(1);
        });

        it('should create transaction with readonly isolation level for select query type', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const transaction = createSpy('transaction').and.returnValue({
                objectStore: createSpy('objectStore').and.returnValue({
                    get: createSpy('get').and.returnValue({})
                })
            });
            const resolvedConnection = Promise.resolve({ transaction });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(transaction).toHaveBeenCalledOnceWith(Tables.Cache, 'readonly');
        });

        it('should create transaction with readwrite isolation level for update or insert query types', async () => {
            // Arrange
            const queryType = QueryType.InsertOrUpdate;
            const queryParameters = { key: 'testKey', value: 'testValue' };
            const transaction = createSpy('transaction').and.returnValue({
                objectStore: createSpy('objectStore').and.returnValue({
                    put: createSpy('put').and.returnValue({})
                })
            });
            const resolvedConnection = Promise.resolve({ transaction });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(transaction).toHaveBeenCalledOnceWith(Tables.Cache, 'readwrite');
        });

        it('should subscribe to transaction oncomplete event', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const transactionObject = {
                objectStore: createSpy('objectStore').and.returnValue({
                    get: createSpy('get').and.returnValue({})
                })
            };
            const resolvedConnection = Promise.resolve({ transaction: createSpy('transaction').and.returnValue(transactionObject) });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onTransactionCompleteEventHandler = () => {};
            spyOn(db, 'onTransactionComplete').and.returnValue(onTransactionCompleteEventHandler);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(transactionObject.oncomplete).toBe(onTransactionCompleteEventHandler);
        });

        it('should call onTransactionError function with arguments', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const transaction = {
                objectStore: createSpy('objectStore').and.returnValue({
                    get: createSpy('get').and.returnValue({})
                })
            };
            const connection = { transaction: createSpy('transaction').and.returnValue(transaction) };
            const resolvedConnection = Promise.resolve(connection);
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onTransactionComplete = spyOn(db, 'onTransactionComplete');

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(onTransactionComplete).toHaveBeenCalledOnceWith(connection, transaction, queryType, queryParameters.key);
        });

        it('should subscribe to transaction onerror event', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const transactionObject = {
                objectStore: createSpy('objectStore').and.returnValue({
                    get: createSpy('get').and.returnValue({})
                })
            };
            const resolvedConnection = Promise.resolve({ transaction: createSpy('transaction').and.returnValue(transactionObject) });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onTransactionErrorEventHandler = () => {};
            spyOn(db, 'onTransactionError').and.returnValue(onTransactionErrorEventHandler);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(transactionObject.onerror).toBe(onTransactionErrorEventHandler);
        });

        it('should call onTransactionError function with arguments', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const transaction = {
                objectStore: createSpy('objectStore').and.returnValue({
                    get: createSpy('get').and.returnValue({})
                })
            };
            const connection = { transaction: createSpy('transaction').and.returnValue(transaction) };
            const resolvedConnection = Promise.resolve(connection);
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onTransactionError = spyOn(db, 'onTransactionError');

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(onTransactionError).toHaveBeenCalledOnceWith(connection, transaction, queryType, queryParameters.key);
        });

        it('should retrieve default table when no specific name is provided', async () => {
            // Arrange
            const defaultTableName = Tables.Cache;
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const objectStore = createSpy('objectStore').and.returnValue({
                get: createSpy('get').and.returnValue({})
            });
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({ objectStore })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(objectStore).toHaveBeenCalledOnceWith(defaultTableName);
        });

        it('should retrieve table with specified name', async () => {
            // Arrange
            const tableName = Tables.ApiCache;
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const objectStore = createSpy('objectStore').and.returnValue({
                get: createSpy('get').and.returnValue({})
            });
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({ objectStore })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);

            // Act
            db.executeQuery(queryType, queryParameters, tableName);
            await resolvedConnection;

            // Assert
            expect(objectStore).toHaveBeenCalledOnceWith(tableName);
        });

        it('should call IDBObjectStore.get function to retrieve data from table', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const get = createSpy('get').and.returnValue({});
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({
                    objectStore: createSpy('objectStore').and.returnValue({
                        get
                    })
                })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(get).toHaveBeenCalledOnceWith(queryParameters.key);
        });

        it('should call IDBObjectStore.put function to update or add data into table', async () => {
            // Arrange
            const queryType = QueryType.InsertOrUpdate;
            const queryParameters = { key: 'testKey', value: 'testValue' };
            const put = createSpy('put').and.returnValue({});
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({
                    objectStore: createSpy('objectStore').and.returnValue({
                        put
                    })
                })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(put).toHaveBeenCalledOnceWith(queryParameters.value, queryParameters.key);
        });

        it('should call IDBObjectStore.delete function to remove data from the table', async () => {
            // Arrange
            const queryType = QueryType.Delete;
            const queryParameters = { key: 'testKey' };
            const deleteFunction = createSpy('delete').and.returnValue({});
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({
                    objectStore: createSpy('objectStore').and.returnValue({
                        delete: deleteFunction
                    })
                })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(deleteFunction).toHaveBeenCalledOnceWith(queryParameters.key);
        });

        it('should subscribe to query onsuccess event', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const query = {};
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({
                    objectStore: createSpy('objectStore').and.returnValue({
                        get: createSpy('get').and.returnValue(query)
                    })
                })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onQuerySuccessEventHandler = () => {};
            spyOn(db, 'onQuerySuccess').and.returnValue(onQuerySuccessEventHandler);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(query.onsuccess).toBe(onQuerySuccessEventHandler);
        });

        it('should call onQueryError function with arguments', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({
                    objectStore: createSpy('objectStore').and.returnValue({
                        get: createSpy('get').and.returnValue({})
                    })
                })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onQuerySuccess = spyOn(db, 'onQuerySuccess');

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(onQuerySuccess).toHaveBeenCalledOnceWith(queryType, any(Function), queryParameters.key);
        });

        it('should subscribe to query onerror event', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const query = {};
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({
                    objectStore: createSpy('objectStore').and.returnValue({
                        get: createSpy('get').and.returnValue(query)
                    })
                })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onQueryErrorEventHandler = () => {};
            spyOn(db, 'onQueryError').and.returnValue(onQueryErrorEventHandler);

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(query.onerror).toBe(onQueryErrorEventHandler);
        });

        it('should call onQueryError function with arguments', async () => {
            // Arrange
            const queryType = QueryType.Select;
            const queryParameters = { key: 'testKey' };
            const resolvedConnection = Promise.resolve({
                transaction: createSpy('transaction').and.returnValue({
                    objectStore: createSpy('objectStore').and.returnValue({
                        get: createSpy('get').and.returnValue({})
                    })
                })
            });
            spyOn(db, 'openConnection').and.returnValue(resolvedConnection);
            const onQueryError = spyOn(db, 'onQueryError');

            // Act
            db.executeQuery(queryType, queryParameters);
            await resolvedConnection;

            // Assert
            expect(onQueryError).toHaveBeenCalledOnceWith(queryType, any(Function), queryParameters.key);
        });

        it('should throw ArgumentOutOfRangeException exception when called with unsupported query type', () => {
            // Arrange
            const queryType = 'QueryType.Select';
            const queryParameters = { key: 'testKey' };

            // Act/Assert
            expect(() => db.executeQuery(queryType, queryParameters)).toThrowError(ArgumentOutOfRangeException, 'queryType');
        });
    });
});
