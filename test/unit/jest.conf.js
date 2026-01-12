const path = require('path')

module.exports = {
    rootDir: path.resolve(__dirname, '../../'),
    moduleFileExtensions: ['js', 'json', 'vue'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@V/(.*)$': '<rootDir>/src/view/$1',
        '^@C/(.*)$': '<rootDir>/src/components/$1',
        '^@API/(.*)$': '<rootDir>/src/api/$1',
        '^@API': '<rootDir>/src/api',
        '^@UTIL/(.*)$': '<rootDir>/src/util/$1',
        '^@UTIL': '<rootDir>/src/util',
        '^@E/(.*)$': '<rootDir>/src/components/element-ui/$1'
        // '^@CSS/(.*)$': '<rootDir>/css/$1'
    },
    globals: {
        _M: true
    },
    transform: {
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
        '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
    },
    testPathIgnorePatterns: ['<rootDir>/test/e2e'],
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupFiles: ['<rootDir>/test/unit/setup'],
    mapCoverage: true,
    coverageDirectory: '<rootDir>/test/unit/coverage',
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!src/main.js',
        '!**/node_modules/**'
    ]
}
