import { isUfeEnvLocal } from 'utils/Env';

class Logger {
    constructor() {
        if (typeof window !== 'undefined') {
            this._logger = window.console;
        } else {
            this._logger = Sephora.logger;
        }

        this.isVerbose = isUfeEnvLocal;
        this.isInfo = true;
        this.isWarn = true;
        this.isError = true;
    }

    verbose() {
        if (this.isVerbose) {
            this._logger.debug(...arguments);
        }
    }

    info() {
        if (this.isInfo) {
            this._logger.info(...arguments);
        }
    }

    warn() {
        if (this.isWarn) {
            this._logger.warn(...arguments);
        }
    }

    error() {
        if (this.isError) {
            this._logger.error(...arguments);
        }
    }

    dump() {
        this._logger.trace(...arguments);
    }
}

Sephora.logger = new Logger();
