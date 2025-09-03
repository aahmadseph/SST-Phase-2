import os from 'node:os';

export default function () {

    const cpus = os.cpus();

    const cpuUsage = {
        count: cpus.length,
        user: 0,
        system: 0,
        nice: 0,
        idle: 0,
        irq: 0
    };

    for (let i = 0, end = cpus.length; i < end; i++) {
        const times = cpus[i].times;

        cpuUsage.user += times.user;
        cpuUsage.system += times.sys;
        cpuUsage.nice += times.nice;
        cpuUsage.idle += times.idle;
        cpuUsage.irq += times.irq;
    }

    const total = cpuUsage.user +
        cpuUsage.system +
        cpuUsage.nice +
        cpuUsage.idle +
        cpuUsage.irq;

    cpuUsage.user = ((cpuUsage.user / total) * 100).toFixed(2);
    cpuUsage.system = ((cpuUsage.user / total) * 100).toFixed(2);
    cpuUsage.nice = ((cpuUsage.user / total) * 100).toFixed(2);
    cpuUsage.idle = ((cpuUsage.user / total) * 100).toFixed(2);
    cpuUsage.irq = ((cpuUsage.user / total) * 100).toFixed(2);

    return cpuUsage;
}
