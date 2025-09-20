/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^(\\.{1,2}/.*)\\.js$': '$1' // fix típico ESM para imports relativos que terminan en .js
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // quítalo si NO usas jest-dom
  testMatch: ['**/?(*.)+(test|spec).(ts|tsx)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};


