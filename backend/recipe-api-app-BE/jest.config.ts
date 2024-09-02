/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(scss|sass|css)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/fileTransformer.js',
      '(.+)\\.js': '$1'
    },
    // globals: {
    //   "ts-jest": {
    //     tsconfig: "tsconfig.jest.json"
    //   }
    // },
    testTimeout: 20000,
    transform: {
      '^.+\\.ts?$': ['ts-jest', {
        tsconfig: "tsconfig.jest.json"
      }]
    },
    extensionsToTreatAsEsm: ['.ts']
  };
  