import { css, Theme } from '@emotion/react'

export const theme: Theme = {
  color: {
    white: '#eeeeee',
    black: '#111111',
  },
}

export const styles = css`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: ${theme.color.white};
    color: ${theme.color.black};
    font-family: Arial, Helvetica, sans-serif;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }
`
