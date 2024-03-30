import Document, { DocumentProps, Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import defaultTheme from 'styles/theme';
import createEmotionCache from 'utils/createEmotionCache';
import React, { ComponentProps, ComponentType } from 'react';
import { MyAppProps } from './_app';
import { AppType } from 'next/app';

interface MyDocumentProps extends DocumentProps {
    emotionStyleTags: React.JSX.Element[];
}

export default function MyDocument({ emotionStyleTags }: MyDocumentProps) {
    return (
        <Html
            lang="de"
            dir="ltr"
        >
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="theme-color"
                    content={defaultTheme.palette.primary.main}
                />
                <link
                    href="/inventory/fonts/stylesheet.css"
                    rel="stylesheet"
                />
                <meta
                    name="emotion-insertion-point"
                    content=""
                />
                {emotionStyleTags}
                {/* favicon section */}
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/inventory/favicons/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/inventory/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/inventory/favicons/favicon-16x16.png"
                />
                <link
                    rel="manifest"
                    href="/inventory/favicons/site.webmanifest"
                />
                <link
                    rel="mask-icon"
                    href="/inventory/favicons/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <link
                    rel="shortcut icon"
                    href="/inventory/favicons/favicon.ico"
                />
                <meta
                    name="msapplication-TileColor"
                    content="#da532c"
                />
                <meta
                    name="msapplication-config"
                    content="/inventory/favicons/browserconfig.xml"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App: ComponentType<ComponentProps<AppType> & MyAppProps>) =>
                function EnhanceApp(props) {
                    return (
                        <App
                            emotionCache={cache}
                            {...props}
                        />
                    );
                }
        });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents Emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags
    };
};
