// Custom code appended to VisitorAPI.js
window.dispatchEvent(new CustomEvent('VisitorAPILoaded', { detail: {} }));

if (
    typeof Sephora !== 'undefined' &&
    Sephora.Util &&
    Sephora.Util.InflatorComps &&
    Sephora.Util.InflatorComps.services &&
    Sephora.Util.InflatorComps.services.loadEvents
) {
    Sephora.Util.InflatorComps.services.loadEvents.VisitorAPILoaded = true;

    if (Sephora.Util.Perf) {
        Sephora.Util.Perf.report('VisitorAPI Loaded');
    }
}
