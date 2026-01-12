const path = require('path')

module.exports = {
    rootDir: path.resolve(__dirname, '../../'),
    moduleFileExtensions: ['js', 'json', 'vue'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/test/e2e/$1',
        '^@F/(.*)$': '<rootDir>/test/e2e/flow/$1',
        '^@S/(.*)$': '<rootDir>/test/e2e/specs/$1'
    },
    transform: {
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
        '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
    },
    testPathIgnorePatterns: ['<rootDir>/test/unit'],
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupFiles: ['<rootDir>/test/e2e/setup'],
    mapCoverage: true,
    coverageDirectory: '<rootDir>/test/e2e/coverage',
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!src/main.js',
        '!**/node_modules/**'
    ]
}
