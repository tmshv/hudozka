import React from "react"

function script(account) {
    return `
        if (window.location.host.indexOf('localhost') === -1) {
            (function (window, document, script, src, ga, element, m) {
                window['GoogleAnalyticsObject'] = ga;
                if (!window[ga]) {
                    window[ga] = function () {
                        (window[ga].q = window[ga].q || []).push(arguments)
                    }
                }
                window[ga].l = 1 * new Date();
                element = document.createElement(script);
                m = document.getElementsByTagName(script)[0];
                element.async = 1;
                element.src = src;
                m.parentNode.insertBefore(element, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', '${account}', 'auto');
            ga('send', 'pageview');
        }
    `
}

export const GAnalytics = (props) => (
    <script dangerouslySetInnerHTML={{ __html: script(props.account) }} />
)
