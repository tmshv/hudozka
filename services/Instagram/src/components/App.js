import React from 'react';

export default class App extends React.Component{
    handleClick(event){

    }

    render(){
        return (
            <div>
                <h1>Панель управления инстаграмом художки</h1>
                <p>Чтобы управлять, вы должны быть <a href="https://instagram.com/hudozka">hudozka</a></p>

                <a href="/auth" onClick={this.handleClick.bind(this)}>Войти</a>
            </div>
        )
    }
}
