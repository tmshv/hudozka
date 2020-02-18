export const NotFound: React.FC = () => (
    <section> 
        <style jsx>{`
            section {
                margin-top: var(--size-l);
                margin-bottom: var(--size-l);

                text-align: center;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            h1 {
                font-size: 16pt;
                font-weight: normal;
            }

            img {
                margin-top: var(--size-m);
                margin-bottom: var(--size-m);
                max-width: 400px;
            }
        `}</style>
        
        <div>
            <h1>Страница не найдена.</h1>
            <img src="/static/graphics/skull.jpg" />
        </div>

        <div><a href="/">На главную</a></div>
    </section>
)
