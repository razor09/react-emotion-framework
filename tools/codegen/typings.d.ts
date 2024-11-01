export type TypeOfCodegen = 'component' | 'mocks' | 'store'

export type TypeOfFile = TypeOfCodegen | 'model' | 'index'

export type ValidProcessArgs = [TypeOfCodegen, ...string[]]
