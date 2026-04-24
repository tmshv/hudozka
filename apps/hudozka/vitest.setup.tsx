import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

vi.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, ...props }: any) => (
        <a href={href} {...props}>{children}</a>
    ),
}))
