function getLessOfTillMidnightOrDefault(defaultExpiry, delay, zoneOffsetInHours) {
    const today = new Date();
    const std = new Date(today.getFullYear(), 0, 1);
    const locaToPSTShift = zoneOffsetInHours * 60 - std.getTimezoneOffset();
    const pstLocal = new Date(today.getTime() - locaToPSTShift * 60 * 1000);

    const pstNextMidnight = new Date(pstLocal.getTime());
    pstNextMidnight.setHours(24, 0, 0, 0);

    const timeLeft = pstNextMidnight.getTime() + delay - pstLocal.getTime();
    const expiry = timeLeft > 0 && timeLeft < defaultExpiry ? timeLeft + pstLocal.getSeconds() * 1000 : defaultExpiry;

    return expiry;
}

export default { getLessOfTillMidnightOrDefault };
