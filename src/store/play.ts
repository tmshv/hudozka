import { proxy } from "valtio"

type State = {
    voice: string
}

export const state = proxy<State>({
    voice: "Milena",
})

export function setVoice(value: string) {
    state.voice = value
}
