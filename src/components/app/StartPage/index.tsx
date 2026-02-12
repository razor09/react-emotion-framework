import { observer } from 'mobx-react-lite'
import { store } from '../../../store'

export const StartPage = observer(() => {
  return <div>{store.project}</div>
})
