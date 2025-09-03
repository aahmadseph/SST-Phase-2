import StandaloneClient from '#server/framework/services/redis/createStandaloneClient.mjs';
import ClusterClient from '#server/framework/services/redis/createClusterClient.mjs';
import {
    REDIS_CONNECTION_POOL_SIZE
} from '#server/config/envRouterConfig.mjs';

class ConnectionPool {

    constructor(options) {

        this.index = 0;
        this.max = REDIS_CONNECTION_POOL_SIZE;
        this.pool = [];

        if (options.clusterMode) {
            for (let i = 0; i < REDIS_CONNECTION_POOL_SIZE; i++) {
                this.pool.push(new ClusterClient(options));
            }
        } else {
            for (let i = 0; i < REDIS_CONNECTION_POOL_SIZE; i++) {
                this.pool.push(new StandaloneClient(options));
            }
        }
    }

    getConnection() {
        let connection = this.pool[this.index];

        if (this.index >= this.max) {
            this.index = 0;
            connection = this.pool[this.index];
        }

        this.index++;

        return connection;
    }
}

export default ConnectionPool;
