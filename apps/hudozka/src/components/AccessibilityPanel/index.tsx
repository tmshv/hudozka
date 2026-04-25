import { HiCog, HiOutlineEyeOff, HiPlay } from "react-icons/hi"
import { useSnapshot } from "valtio"
import play from "@/play"
import { state as playState, setVoice } from "@/store/play"
import {
    decreaseFontSize,
    hideImages,
    increaseFontSize,
    reset,
    setBlackOnWhite,
    setBlueOnBlue,
    setBrownOnYellow,
    setDefaultTheme,
    setGreenOnBrown,
    setLetterSpacingFour,
    setLetterSpacingOne,
    setLetterSpacingTwo,
    setLineHeightOneAndHalf,
    setLineHeightTwo,
    setLineHeightTwoAndHalf,
    setSansSerifFont,
    setSerifFont,
    setWhiteOnBlack,
    showImages,
} from "@/store/theme"
import s from "./panel.module.css"
import VoiceSelect from "./voice"

function AccessibilityPanel() {
    const p = useSnapshot(playState)

    return (
        <div className={s.viewsettings}>
            <div className={s.row}>
                <div className={s.block}>
                    <p>Размер шрифта:</p>
                    <button type="button" onClick={decreaseFontSize} title="уменьшить размер шрифта">
                        A-
                    </button>
                    <button type="button" onClick={increaseFontSize} title="увеличить размер шрифта">
                        <strong>A+</strong>
                    </button>
                </div>

                <div className={s.block}>
                    <p>Изображения:</p>
                    <button type="button" onClick={showImages}>
                        Включить
                    </button>
                    <button type="button" onClick={hideImages}>
                        Выключить
                    </button>
                </div>

                <div className={s.block}>
                    <p>Цвет сайта:</p>
                    <button
                        type="button"
                        onClick={setBlackOnWhite}
                        title="черные буквы на белом фоне"
                        style={{ color: "black", backgroundColor: "white" }}
                    >
                        Ц
                    </button>
                    <button
                        type="button"
                        onClick={setWhiteOnBlack}
                        title="белые буквы на черном фоне"
                        style={{ color: "white", backgroundColor: "black" }}
                    >
                        Ц
                    </button>
                    <button
                        type="button"
                        onClick={setBlueOnBlue}
                        title="синии буквы на голубом фоне"
                        style={{ color: "oklch(32% 24% 253deg)", backgroundColor: "oklch(84% 21% 245deg)" }}
                    >
                        Ц
                    </button>
                    <button
                        type="button"
                        onClick={setBrownOnYellow}
                        title="коричневые буквы на желтом фоне"
                        style={{ color: "oklch(41% 3% 92deg)", backgroundColor: "oklch(96% 9% 101deg)" }}
                    >
                        Ц
                    </button>
                    <button
                        type="button"
                        onClick={setGreenOnBrown}
                        title="зеленые буквы на коричневом фоне"
                        style={{ color: "oklch(85% 47% 128deg)", backgroundColor: "oklch(29% 10% 61deg)" }}
                    >
                        Ц
                    </button>
                </div>

                <div className={s.block}>
                    <p>Шрифт:</p>
                    <button type="button" onClick={setSerifFont}>
                        С засечками
                    </button>
                    <button type="button" onClick={setSansSerifFont}>
                        Без засечек
                    </button>
                </div>

                <div className={s.block}>
                    <p>Высота строк:</p>
                    <button type="button" onClick={setLineHeightOneAndHalf}>
                        1.5
                    </button>
                    <button type="button" onClick={setLineHeightTwo}>
                        2.0
                    </button>
                    <button type="button" onClick={setLineHeightTwoAndHalf}>
                        2.5
                    </button>
                </div>

                <div className={s.block}>
                    <p>Межбуквенный интервал:</p>
                    <button type="button" onClick={setLetterSpacingOne}>
                        1
                    </button>
                    <button type="button" onClick={setLetterSpacingTwo}>
                        2
                    </button>
                    <button type="button" onClick={setLetterSpacingFour}>
                        4
                    </button>
                </div>
            </div>

            <div className={s.row}>
                <button type="button" onClick={reset}>
                    <HiCog />
                    Сброс настроек
                </button>
                <button type="button" onClick={setDefaultTheme}>
                    <HiOutlineEyeOff />
                    Обычная версия
                </button>
                <button type="button" onClick={play}>
                    <HiPlay />
                    Прослушать всё
                </button>
                <VoiceSelect
                    value={p.voice}
                    onChange={event => {
                        setVoice(event.target.value)
                    }}
                />
            </div>
        </div>
    )
}

export default AccessibilityPanel
