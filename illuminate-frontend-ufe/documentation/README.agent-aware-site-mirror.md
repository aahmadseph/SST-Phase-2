In the Agent Aware Site, also called Mirror or AAS there is a Sephora.isAgent

The purpose of using Sephora.isAgent is when code needs to be added that is specific to the Agent Aware Site.

We do not want this code in the regular production site, ever as this can create security holes that hackers WILL exploit

Using Sephora.isAgent:

100% WRONG:

    const isMirrorTrainingEnv = Sephora.isAgent && urlUtils.isSiteTraining();
    const replenishmentPath = isMirrorTrainingEnv ? '/replenishment-training/profiles/' : '/replenishment/profiles/';

As this compiles to this:

    const isMirrorTrainingEnv = false && 0;
    const replenishmentPath = isMirrorTrainingEnv ? '/replenishment-training/profiles/' : '/replenishment/profiles/';

This defeats the purpose of using Sephora.isAgent

100% CORRECT:

    const replenishmentPath = Sephora.isAgent && urlUtils.isSiteTraining() ? '/replenishment-training/profiles/' : '/replenishment/profiles/';

As this compiles to this:

const replenishmentPath = false ? 0 : '/replenishment/profiles/';

All code should be in format of

    if (Sephora.isAgent) {
        // add your agent aware code in UFE here
    } else {
        // any none agent aware code in UFE here
    }

Failing to do things this way opens the door to security holes and potential security breaches
