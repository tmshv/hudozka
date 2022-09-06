import "rc-tooltip/assets/bootstrap_white.css"
import s from "./signature.module.css"

import { Sign } from "@/types"
import { FiShield } from "react-icons/fi"
import Tooltip from "rc-tooltip"

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
        <Tooltip overlayClassName={"hudozka"} placement="left" trigger={["hover", "click"]} overlay={content}>
            <FiShield className={s.secure} size={20} />
        </Tooltip>
    )
}
