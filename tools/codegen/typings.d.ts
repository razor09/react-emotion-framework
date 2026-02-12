export type TypeOfCodegen = 'component' | 'mocks'

export type BoilerplateFile = TypeOfCodegen | 'handlers' | 'typings'

export type ProcessArgs = [TypeOfCodegen, ...string[]]
