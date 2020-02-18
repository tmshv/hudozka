export const NotFound: React.FC = () => (
    <section> 
        <style jsx>{`
            section {
                margin: 1em 0;

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
                margin: 20px;
                width: 40%;
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
