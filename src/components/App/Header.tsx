export const Header: React.FC = props => (
    <header>
        <style jsx>{`
            .navigation {
                width: 100%;
                background-color: white;
            }

            .navigation__body {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        `}</style>

        <div className="navigation">
            <div className="navigation__body">
                {props.children}
            </div>
        </div>
    </header>
)
