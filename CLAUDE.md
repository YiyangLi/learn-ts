# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building and Testing
- `npm test` - Run Jest tests with coverage
- `npm run lint` - Run Google TypeScript Style (gts) linter with auto-fix
- `npm run compile` - Compile TypeScript to JavaScript in `build/` directory
- `npm run clean` - Clean build artifacts
- `npm run fix` - Auto-fix linting issues

### Installation and Setup
- `npm install` - Install dependencies
- `npm link` - Create global symlink for CLI usage

### Running the Application
- `simple send` - Send messages with default configuration
- `simple send -n 10 -s` - Send 10 messages sequentially  
- `simple send -n 10 -c 2` - Send 10 messages with concurrency of 2
- `simple --help` - Show command help

## Architecture Overview

This is a TypeScript CLI application that sends HTTP messages to a pub-sub endpoint with different concurrency patterns. The application is built with a modular architecture:

### Core Components
- **CLI Layer** (`src/cli.ts`) - Entry point using yargs for command parsing and option handling
- **Main Logic** (`src/main.ts`) - Core business logic with three sending strategies:
  - Sequential: Messages sent one after another
  - Concurrent: All messages sent simultaneously 
  - Batched: Messages sent in concurrent batches with sequential execution within each batch
- **Utilities** (`src/util.ts`) - Helper functions for sequence generation, batching, and parsing
- **Logger** (`src/logger.ts`) - Winston-based logging with configurable levels

### Configuration
The application uses environment variables and `.env` files for configuration:
- `BASE_URL` - Target pub-sub endpoint (default: http://localhost:3000)
- `MESSAGE` - Default message content
- `SIZE` - Default number of messages (default: 10)
- `CONCURRENCY` - Default concurrency level (default: -1 for unlimited)
- `USE_MOCK` - Enable mock mode to only log messages without sending (default: false)
- `SLEEP_TIME` - Artificial delay between messages in milliseconds (default: 1000)
- `LOG_LEVEL` - Winston log level (default: info)

### Testing Strategy
- Uses Jest with ts-jest transformer
- Test files in `test/` directory with `.spec.ts` extension
- Nock for HTTP mocking in tests
- Coverage collection enabled with v8 provider
- Test setup file: `test/setup-test.ts`

### Build Output
- TypeScript compiles to `build/` directory
- Main entry point: `build/src/cli.js`
- Uses Google TypeScript Style (gts) configuration
- Targets ES2019 with Node.js compatibility

### Docker Support
- Dockerfile available for containerization
- Supports environment variable overrides in container
- Can run CLI commands within Docker container