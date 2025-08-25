import { decreaseFontSize, hideImages, increaseFontSize, reset, setBlackOnWhite, setBlueOnBlue, setBrownOnYellow, setDefaultTheme, setGreenOnBrown, setLetterSpacingOne, setLetterSpacingTwo, setLetterSpacingFour, setLineHeightOneAndHalf, setLineHeightTwo, setLineHeightTwoAndHalf, setSansFont, setSerifFont, setWhiteOnBlack, showImages } from "@/store/theme"
import s from "./panel.module.css"

function AccessibilityPanel() {
    return ( <div className={s.viewsettings}>
        <div className={s.row}>
            <div className={s.block}>
                <p>Размер шрифта:</p>
                <a onClick={decreaseFontSize} title="уменьшить размер шрифта">A-</a>
                <a onClick={increaseFontSize} title="увеличить размер шрифта"><strong>A+</strong></a>
            </div>

            <div className={s.block}>
                <p>Изображения:</p>
                <a onClick={showImages}>Включить</a>
                <a onClick={hideImages}>Выключить</a>
            </div>

            <div className={s.block}>
                <p>Цвет сайта:</p>
                <a onClick={setBlackOnWhite} title="черные буквы на белом фоне" style={{color: "black", backgroundColor: "white"}}>Ц</a>
                <a onClick={setWhiteOnBlack} title="белые буквы на черном фоне" style={{color: "white", backgroundColor: "black"}}>Ц</a>
                <a onClick={setBlueOnBlue} title="синии буквы на голубом фоне" style={{color: "oklch(32% 24% 253deg)", backgroundColor: "oklch(84% 21% 245deg)"}}>Ц</a>
                <a onClick={setBrownOnYellow} title="коричневые буквы на желтом фоне" style={{color: "oklch(41% 3% 92deg)", backgroundColor: "oklch(96% 9% 101deg)"}}>Ц</a>
                <a onClick={setGreenOnBrown} title="зеленые буквы на коричневом фоне" style={{color: "oklch(85% 47% 128deg)", backgroundColor: "oklch(29% 10% 61deg)"}}>Ц</a>
            </div>

            <div className={s.block}>
                <p>Шрифт:</p>
                <a onClick={setSansFont}>С засечками</a>
                <a onClick={setSerifFont}>Без засечек</a>
                {/*<a id="btn-on-braille" href="javascript:void(0)" onClick="smSetting('fontBraille', 'brailleOn')" title="только для печати">Брайля</a>*/}
                {/*<a id="btn-off-braille" href="javascript:void(0)" onClick="smSetting('fontBraille', 'brailleOff')">Обычный</a>*/}
            </div>

            <div className={s.block}>
                <p>Высота строк:</p>
                <a onClick={setLineHeightOneAndHalf}>1.5</a>
                <a onClick={setLineHeightTwo}>2.0</a>
                <a onClick={setLineHeightTwoAndHalf}>2.5</a>
            </div>

            <div className={s.block}>
                <p>Межбуквенный интервал:</p>
                <a onClick={setLetterSpacingOne}>1</a>
                <a onClick={setLetterSpacingTwo}>2</a>
                <a onClick={setLetterSpacingFour}>4</a>
            </div>
        </div>

        <div className={s.row}>
            <a onClick={reset}><i className="fa fa-cog fa-fw"></i>Сброс настроек</a>
            {/*<a id="mobile-version" href="?mobile=1"><i className="fa fa-mobile fa-fw"></i> Мобильная версия</a>*/}
            <a onClick={setDefaultTheme}><i className="fa fa-eye-slash fa-fw"></i>Обычная версия</a>
            {/*<a id="_playlist" href="javascript:void(0)" onClick="playSound('all', this);"><i className="fa fa-play fa-fw"></i>Прослушать всё</a>*/}
        </div>
    </div>
    )
}

export default AccessibilityPanel
