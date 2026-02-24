import { Global, ThemeProvider } from '@emotion/react'
import { observer } from 'mobx-react-lite'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../../store'
import { styles, theme } from '../../theme'

export const Entry = observer(() => {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={styles} />
      <BrowserRouter>{store.project}</BrowserRouter>
    </ThemeProvider>
  )
})
