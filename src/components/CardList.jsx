import React from 'react'

export const CardList = props => (
    <div className="CardList">
        <style jsx>{`
            .CardList {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                justify-content: space-between;
            }
        `}</style>

        {props.items.map(
            (item, index) => props.renderItem(item, index)
        )}
    </div>
)
