import Head from 'next/head'
import { useEffect } from 'react'
import { Html } from '../Html'
import { getCode } from './lib'

export type GosuslugiProps = {}

export const Gosuslugi: React.FC<GosuslugiProps> = () => {
    useEffect(() => {
        const code = getCode()
        try {
            document.head.innerHTML = document.head.innerHTML + code
            console.log('Gosuslugi injected')
        } catch (error) {
            console.log('Failed to inject Gosuslugi')
        }
    })

    return (
        <div id='js-show-iframe-wrapper'>
            <div className='pos-banner-fluid bf-23'>
                <div className='bf-23__decor'>
                    <div className='bf-23__logo-wrap'>
                        <img
                            className='bf-23__logo'
                            src='https://pos.gosuslugi.ru/bin/banner-fluid/gosuslugi-logo-blue.svg'
                            alt='Госуслуги'
                        />
                        <div className='bf-23__slogan'>Решаем вместе</div >
                    </div>
                </div>
                <div className='bf-23__content'>
                    <div className='bf-23__text'>
                        Есть предложения по организации учебного процесса или знаете, как сделать школу лучше?
                    </div>

                    <div className='bf-23__bottom-wrap'>
                        <div className='bf-23__btn-wrap'>
                            {/* <!-- pos-banner-btn_2 не удалять; другие классы не добавлять --> */}
                            <button
                                className='pos-banner-btn_2'
                                type='button'
                            >Написать о проблеме
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
