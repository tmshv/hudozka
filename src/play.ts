import { state } from "./store/play";


function play() {
    const synth = window.speechSynthesis;

    const a = document.querySelector("article")
    if (!a || !a.textContent) {
        return
    }

    const u = new SpeechSynthesisUtterance(a.textContent)
    const voice = synth.getVoices().find((v) => v.name === state.voice);
    if (voice) {
        u.voice = voice
    }
    synth.speak(u)
}

export default play
