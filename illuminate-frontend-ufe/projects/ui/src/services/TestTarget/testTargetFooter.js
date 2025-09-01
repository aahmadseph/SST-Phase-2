// Custom code appended to at.js
window.dispatchEvent(new CustomEvent('TestTargetLoaded', { detail: {} }));

if (
    typeof Sephora !== 'undefined' &&
    Sephora.Util &&
    Sephora.Util.InflatorComps &&
    Sephora.Util.InflatorComps.services &&
    Sephora.Util.InflatorComps.services.loadEvents
) {
    Sephora.Util.InflatorComps.services.loadEvents.TestTargetLoaded = true;

    if (Sephora.Util.Perf) {
        Sephora.Util.Perf.report('TestTarget Loaded');
    }
}
