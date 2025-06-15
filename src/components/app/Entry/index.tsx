import { Global, ThemeProvider } from '@emotion/react'
import { observer } from 'mobx-react-lite'
import { BrowserRouter } from 'react-router-dom'
import { styles, theme } from '../../../theme'
import { StartPage } from '../StartPage'

export const Entry = observer(() => {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={styles} />
      <BrowserRouter>
        <StartPage />
      </BrowserRouter>
    </ThemeProvider>
  )
})
