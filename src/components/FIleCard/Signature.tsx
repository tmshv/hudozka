import s from "./signature.module.css"

import { Sign } from "@/types"
import { HiOutlineShieldCheck } from "react-icons/hi"

import * as Tooltip from "@radix-ui/react-tooltip"

export type SignatureProps = Sign
export const Signature: React.FC<SignatureProps> = props => {
    const content = (
        <ul className={s.signature}>
            <li>Дата и время подписания: {props.date}</li>
            <li>ФИО подписавшего документ: {props.person}</li>
            <li>Должность: {props.position}</li>
            <li>Уникальный программный ключ: {props.signature}</li>
        </ul>
    )

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger className={s.tooltipTrigger}>
                    <HiOutlineShieldCheck className={s.secure} size={20} />
                </Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content className={s.tooltip}>
                        {content}
                        <Tooltip.Arrow className={s.tooltipArrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )
}
