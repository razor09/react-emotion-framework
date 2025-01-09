export type TypeOfCodegen = 'component' | 'mocks'

export type BoilerplateFile = 'component' | 'handlers' | 'mocks' | 'typings'

export type ValidProcessArgs = [TypeOfCodegen, ...string[]]
