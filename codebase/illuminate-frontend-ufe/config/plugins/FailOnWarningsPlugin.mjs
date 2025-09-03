/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import chalk from 'chalk';

class FailOnWarningsPlugin {
    constructor(options) {
        this.name = 'FailOnWarningsPlugin';
        this.options = options || {};
    }

    apply(compiler) {
        if (!this.options.isomorphic || this.options.test) {
            return;
        }

        compiler.hooks.thisCompilation.tap('FailOnWarningPlugin', compilation => {
            compilation.hooks.seal.tap('FailOnWarningPlugin', () => {
                if (compilation.warnings.length) {
                    compilation.warnings.forEach(warning => {
                        console.error(
                            chalk.red(`
ERROR in ${warning.module.resource} line: ${warning.loc.start.line}
${warning.name}: ${warning.message || warning}
`)
                        );
                    });

                    process.exit(1);
                }
            });
        });
    }
}

export default FailOnWarningsPlugin;
