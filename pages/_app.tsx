import App from 'next/app'

export default class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props

        return (
            <>
                <style global jsx>{`
                    @media (max-width: 31.25em) {
                        :root {
                            --smaller-font-size: 0.9rem;
                            --normal-font-size: 1rem;
                            --bigger-font-size: 1.1rem;
                            --big-font-size: 1.3rem;
                            --biggest-font-size: 2rem;

                            --font-size-h1: 1.5rem;
                            --font-size-h2: 1.5rem;
                            --font-size-h3: 1.25rem;

                            --content-thin: 90%;
                            --content-wide: 90%;
                        }
                    }

                    .noscroll { 
                        overflow: hidden;
                    }

                    #__next {
                        height: 100%;
                    }
                `}</style>

                <Component {...pageProps} />
            </>
        )
    }
}
