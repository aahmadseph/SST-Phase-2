function TaskQueue() {
    let queue = [];
    let isRunning = false;

    function count() {
        return queue.length;
    }

    function clear() {
        if (count()) {
            queue = [];
        }
    }

    function add(promise, taskId = null, replace = true) {
        return new Promise((resolve, reject) => {
            const id = taskId || Math.random();
            const taskData = {
                id,
                promise,
                resolve,
                reject
            };

            if (replace && taskId) {
                const taskIdx = queue.findIndex(task => task.id === taskId);

                if (taskIdx >= 0) {
                    queue[taskIdx] = taskData;
                } else {
                    queue.push(taskData);
                }
            } else {
                queue.push(taskData);
            }
        });
    }

    function remove(taskId) {
        const taskIdx = queue.findIndex(task => task.id === taskId);
        queue.splice(taskIdx, 1);
    }

    function getIds() {
        const ids = queue.map(task => task.id);

        return ids;
    }

    function internalRun() {
        if (isRunning) {
            return Promise.resolve();
        }

        const nextTask = queue.shift();

        if (!nextTask) {
            return Promise.resolve();
        }

        try {
            isRunning = true;

            return nextTask
                .promise()
                .then(value => {
                    isRunning = false;
                    nextTask.resolve(value);

                    return internalRun();
                })
                .catch(err => {
                    isRunning = false;
                    nextTask.reject(err);

                    return internalRun();
                });
        } catch (err) {
            return nextTask.reject(err);
        }
    }

    function run() {
        return new Promise(resolve => {
            resolve(internalRun());
        });
    }

    return {
        add,
        remove,
        run,
        count,
        clear,
        getIds
    };
}

export default { createTaskQueue: TaskQueue };
