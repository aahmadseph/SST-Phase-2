/* eslint-disable class-methods-use-this */
import fs from 'fs';
import path from 'path';

const CHUNKS_DEPENDENCIES_DIR = path.resolve('./src/config/chunkDependencies');

class ChunkFilesPlugin {
    constructor(options) {
        if (!options) {
            throw new Error('Argument "options" is required.');
        }

        if (typeof options !== 'object') {
            throw new Error('Argument "options" must be an object.');
        }

        this.name = 'ChunkFilesPlugin';
        this.options = options || {};
    }

    apply(compiler) {
        if (this.options.isomorphic || this.options.test) {
            return;
        }

        compiler.hooks.emit.tapAsync(this.name, (compilation, callback) => {
            const chunkFilesMap = {};

            compilation.chunks.forEach(chunk => {
                const chunkName = chunk.name || chunk.id;
                const files = Array.from(compilation.chunkGraph.getChunkModules(chunk))
                    .map(module => module.resource)
                    .filter(resource => resource && resource.startsWith(path.resolve('./src')))
                    .map(resource => path.relative(process.cwd(), resource))
                    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

                if (files.length > 0) {
                    chunkFilesMap[chunkName] = files;
                }
            });

            fs.mkdirSync(CHUNKS_DEPENDENCIES_DIR, { recursive: true });

            Object.entries(chunkFilesMap).forEach(([chunkName, files]) => {
                const outputPath = path.resolve(CHUNKS_DEPENDENCIES_DIR, `${chunkName}.txt`);
                fs.writeFileSync(outputPath, files.join('\n'));
            });

            callback();
        });
    }
}

export default ChunkFilesPlugin;
