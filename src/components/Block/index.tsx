import { createElement } from 'react'

export type BlockProps = {
    style?: React.CSSProperties
    direction: 'horizontal' | 'vertical'
}

export const Block: React.FC<BlockProps> = props => {
    return (
        <div style={props.style}>
            <style jsx>{`
                div {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: baseline;
                    justify-content: flex-start;
                }
            `}</style>

            {props.children}
        </div>
    )
}

export const Spacer: React.FC<{ as?: string }> = ({ as = 'div' }) => createElement(as, {
    style: {
        flex: 1,
    }
}) 
