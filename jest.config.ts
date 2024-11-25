import type { Config } from 'jest'
import nextJest from 'next/jest'

// Create the Jest config using Next.js-specific setup
const createJestConfig = nextJest({
  dir: './',  // This points to the root of your Next.js project
})

// Custom Jest configuration
const config: Config = {
  coverageProvider: 'v8',  // Use V8 for code coverage
  testEnvironment: 'jest-environment-jsdom',  // Explicitly use jest-environment-jsdom
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],  // Uncomment to add setup file if needed
}

// Export the final config
export default createJestConfig(config)
