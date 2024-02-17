module.exports = {
    rootDir: './src',
    transform: {'^.+\\.ts?$': 'ts-jest'},
    testEnvironment: 'node',
    testRegex: '.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    setupFiles: ["<rootDir>/test/setup-tests.ts"],
}
