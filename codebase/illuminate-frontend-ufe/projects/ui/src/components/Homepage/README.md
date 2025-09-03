# Adding a class to html tag for recognized user to show a skeleton until p13n data is available

-   To improve personalization user experience for recognized users: Added a class to the html tag names `isRecognized` when page loads and the user is recognized (signed in but session expired)
-   In main.headScript.js file we added a function to add the class when user is recognized.

```js
var addRecognizedUserFlag = function () {
    document.documentElement.classList.add('isRecognized');
};

if (Sephora.Util.getCurrentUser().isRecognized) {
    addRecognizedUserFlag();
}
```

-   In Banner.f.jsx component we use this class to show a skeleton til p13n personalization data is available. In case the user is not recognized we should show the default server side rendered content.

```js
const RECOGNIZED_CLASS = '.isRecognized &';

{
    text && (
        <TextWrapComp
            {...(isMultiLink && LinkProps)}
            flexDirection='column'
            justifyContent={largeMediaPlacement ? [textJustify, getTextJustify(largeMediaPlacement)] : textJustify}
            lineHeight={isContained || 'tight'}
            paddingY={4}
            paddingX={isContained ? ['container', 5, 6] : [4, null, 5]}
            flex={1}
        >
            <RichText
                content={text}
                style={[styles.copy, isBannerList && styles.copyBannerList, showSkeleton && { [RECOGNIZED_CLASS]: SKELETON_COPY }]}
                linkColor={color}
            />
        </TextWrapComp>
    );
}
```
