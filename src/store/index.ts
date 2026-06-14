import { makeAutoObservable } from 'mobx'

class Store {
  public readonly project = 'React Emotion Framework'
}

const target = new Store()

export const store = makeAutoObservable(target)
