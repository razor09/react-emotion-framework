export type ThemeColorName = 'white' | 'black'

export type ThemeColor = Record<ThemeColorName, string>

declare module '@emotion/react' {
  export interface Theme {
    color: ThemeColor
  }
}
