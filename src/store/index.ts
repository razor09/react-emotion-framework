import { makeAutoObservable } from 'mobx'

class Store {
  public readonly project = 'React Emotion Framework'
}

const factory = new Store()

export const store = makeAutoObservable(factory)
