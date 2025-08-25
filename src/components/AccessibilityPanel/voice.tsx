function useVoices() {
    return window.speechSynthesis
        .getVoices()
        .map(v => {
            return {
                name: `${v.name} (${v.lang})`,
                value: v.name,
            }
        })
}

export type VoiceSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

function VoiceSelect(props: VoiceSelectProps) {
    const voices = useVoices()
    return (
        <select {...props}>
            {voices.map(voice => (
                <option key={voice.value} value={voice.value}>
                    {voice.name}
                </option>
            ))}
        </select>
    )
}

export default VoiceSelect
