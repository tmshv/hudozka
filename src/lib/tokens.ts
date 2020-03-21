import { TextToken, Token } from 'src/types'

export function joinTextTokens(tokens: TextToken[]): TextToken {
    return {
        token: 'text',
        data: tokens
            .map(x => x.data)
            .join('\n\n'),
    }
}

export function joinTokens(tokens: Token[]): Token[] {
    let buffer: TextToken[] = []
    const result: Token[] = []

    for (const token of tokens) {
        if (token.token === 'text') {
            buffer.push(token)
            continue
        }

        const compiledToken = joinTextTokens(buffer)
        buffer = []

        result.push(compiledToken)
        result.push(token)
    }

    if (buffer.length) {
        result.push(
            joinTextTokens(buffer)
        )
    }

    return result
}
