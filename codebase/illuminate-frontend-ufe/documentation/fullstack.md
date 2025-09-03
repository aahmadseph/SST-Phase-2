# Table of contents

-   [Tech Stack](#tech-stack)
-   [Local Dev Environment Setup](./environment.md)
-   [Branching Strategy](#branching-strategy)
-   [Commonly Used QA Environments](#commonly-used-qa-environments)
-   [Merge Request Rules](#merge-request-rules)
-   [Support Channel](#support-channel)
-   [Tech Talks](#tech-talks)

# Tech Stack

React  
Redux  
Node JS  
GraphQL  
Karma + Jasmine (Unit Tests)

# Local Dev Environment Setup

You can find detailed explanation [here](./environment.md).

# Branching Strategy

-   'dev' branch  
    For current sprint production releases.  
    Future sprint feature releases with kill switch stories implemented and QA verfied within the sprint.

-   'master' branch  
    For production releases.  
    Dev branch will be merged to master last day of each sprint.  
    Any QA regression bug fixes can goto master branch directly. However, make sure your changes from master branch are also merged to dev branch.

During holiday freeze period, there would be changes in the branch merging strategies. Please follow UFE channels for branch merge notifications. More details [here](https://confluence.sephora.com/wiki/display/FEE/UFE+Branching+Strategy)

# Commonly Used QA Environments

QA3 - https://qa3.sephora.com/ - Generally deployed with 'master' ufe branch  
QA4 - https://qa4.sephora.com/ - Generally deployed with 'dev' ufe branch

Note:

-   The branch deployments in those QA environments can change temporarily if anyone wants to test other features. Check with QA team to know which branch is deployed if you do not see your changes on those environments.
-   Alternatively, you can also test it yourself from your browser console tab by typing 'Sephora.buildInfo' and press enter. Look for GIT_BRANCH in the output.

# Merge Request Rules

-   MR title should have JIRA number and description.

```sh
Format: [JIRA-number]: description
Example: [ECSC-5382]: Apply tax address to Canada First Nation Members
```

MRs should be posted for reviews in 'Git' channel
https://teams.microsoft.com/l/channel/19%3A6a288ae9dd704df4a2d638a62e1460ba%40thread.skype/Git?groupId=86f31526-f9f0-4ae5-b7e1-4673b0cc5236&tenantId=7d1f4f5f-8f63-48d8-86e1-8b8f63f16bae

# Support Channel

For any technical issues or guidance from UFE team / architects, you can post your queries in the below teams channel:

https://teams.microsoft.com/l/channel/19%3Aaffffadfa7c847d68a0463295f218f17%40thread.skype/Code%20Talk?groupId=86f31526-f9f0-4ae5-b7e1-4673b0cc5236&tenantId=7d1f4f5f-8f63-48d8-86e1-8b8f63f16bae

# Tech Talks

-   [Sprint calender](https://confluence.sephora.com/wiki/display/ILLUMINATE/2025+Sprint+Calendar)
-   [UFE Code Jenkins Build](https://jenkins.lipstack.sephoraus.com/view/frontend/job/github-code-build-ufe/)
-   [Jenkins Auto Merge Jobs](https://jenkins.lipstack.sephoraus.com/view/merge/)
-   [UFE code file folder structure, MVVM](https://sephora.zoom.us/rec/play/YlSJh-ysJmgAW3RXQq_WDgge909PGmm1Lv75zUDMMBUmzO_IDMvu65Z7FQJ5rEyH1qFFXKoVev6uPden.bGD3xljks60aIOSu?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fsephora.zoom.us%2Frec%2Fshare%2FNB1j1l0AuJnspJ2MkXCnfUpYeTR_0xYGuJw2aPP6YthtGXdN9wgjg1zX67MtnF8C.qimFnu21TEghfLU_)
    Passcode: 7+=C8OgU
-   [Woody](https://sephora.zoom.us/rec/play/EIZFBOeRZHmjK-ruiJ1cXkCuFr2NIf0e_nto7OkSX6d9LZVhRGGBYR0abpzT8Tyttc12l2zNB1gcyhI-.J8e1imA9m6i5IjP1?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fsephora.zoom.us%2Frec%2Fshare%2FFkrD6XHUCtLwF0MJ5BQzEj8ZqgRwaZKqmDOPhGWCC6G7svPvmicr-TfzlxkHnQTf.wJM-LWSvfrlq938o)
    Passcode: K!9XYPj2

Additional tech talks can be found [here](https://confluence.sephora.com/wiki/display/FEE/UFE+Team+Notes)
