#!/usr/bin/env node

/**
 * Script to help migrate tests to a consistent colocated structure
 * Run with: node scripts/migrate-tests.js --dry-run
 * Run actual migration: node scripts/migrate-tests.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRY_RUN = process.argv.includes('--dry-run');
const SRC_DIR = path.join(__dirname, '../packages/usetemporal/src');

// Test files that should be in __tests__/integration/
const INTEGRATION_TESTS = [
  'exports.test.ts',
  'integration.test.ts' // calendar integration test
];

// Test files that should move to composables/
const COMPOSABLE_TESTS = [
  'reactivity.test.ts'
];

// Test files that are regression tests
const REGRESSION_TESTS = [
  'regression.test.ts'
];

// Test files that should stay in test/ (utilities)
const TEST_UTILITIES = [
  'run-adapter-compliance.test.ts'
];

// Calendar tests that should be colocated
const CALENDAR_TESTS = {
  'stableMonth.test.ts': 'calendar/stableMonth.test.ts',
  'stableYear.test.ts': 'calendar/stableYear.test.ts'
};

async function findTestFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && !entry.name.includes('node_modules')) {
      files.push(...await findTestFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.ts.skip'))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function determineNewLocation(testFile) {
  const relativePath = path.relative(SRC_DIR, testFile);
  const fileName = path.basename(testFile);
  const dirName = path.dirname(testFile);

  // Test utilities should stay in test/
  if (TEST_UTILITIES.includes(fileName)) {
    return testFile; // Already in right place
  }

  // Check if it's a composable test
  if (COMPOSABLE_TESTS.includes(fileName)) {
    return path.join(SRC_DIR, 'composables', fileName);
  }

  // Check if it's an integration test
  if (INTEGRATION_TESTS.includes(fileName)) {
    return path.join(SRC_DIR, '__tests__/integration', fileName);
  }

  // Check if it's a regression test
  if (REGRESSION_TESTS.includes(fileName)) {
    return path.join(SRC_DIR, '__tests__/regression', fileName);
  }

  // Check if it's a calendar test
  if (CALENDAR_TESTS[fileName]) {
    return path.join(SRC_DIR, CALENDAR_TESTS[fileName]);
  }

  // Handle .skip files in __tests__ - move to integration
  if (fileName.endsWith('.test.ts.skip') && testFile.includes('__tests__')) {
    return path.join(SRC_DIR, '__tests__/integration', fileName);
  }

  // Check if it's in a __tests__ folder
  if (testFile.includes('__tests__')) {
    // Move it next to the source file
    const sourceFileName = fileName.replace('.test.ts', '.ts').replace('.test.ts.skip', '.ts');
    const parentDir = path.dirname(dirName);

    // Look for the source file
    const possibleSourceFile = path.join(parentDir, sourceFileName);
    try {
      await fs.access(possibleSourceFile);
      return path.join(parentDir, fileName);
    } catch {
      // If no source file found, keep in current location
      console.warn(`⚠️  No source file found for ${fileName}, keeping in place`);
      return testFile;
    }
  }

  // Already in the right place (colocated)
  return testFile;
}

async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function moveFile(from, to) {
  if (from === to) {
    return false;
  }
  
  console.log(`Moving: ${path.relative(SRC_DIR, from)}`);
  console.log(`    To: ${path.relative(SRC_DIR, to)}`);
  
  if (!DRY_RUN) {
    await ensureDirectoryExists(to);
    await fs.rename(from, to);
  }
  
  return true;
}

async function cleanupEmptyDirectories(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  // Recursively clean subdirectories first
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);
      await cleanupEmptyDirectories(subDir);
    }
  }

  // Check if directory is empty
  const remainingEntries = await fs.readdir(dir);
  const dirName = path.basename(dir);

  // Don't remove integration/ or regression/ directories even if empty
  if (dirName === 'integration' || dirName === 'regression') {
    return;
  }

  if (remainingEntries.length === 0 && dir.includes('__tests__')) {
    console.log(`Removing empty directory: ${path.relative(SRC_DIR, dir)}`);
    if (!DRY_RUN) {
      await fs.rmdir(dir);
    }
  }
}

async function main() {
  console.log(DRY_RUN ? '🏃 DRY RUN MODE\n' : '🚀 MIGRATION MODE\n');
  
  try {
    // Find all test files
    const testFiles = await findTestFiles(SRC_DIR);
    console.log(`Found ${testFiles.length} test files\n`);
    
    // Determine new locations and move files
    let movedCount = 0;
    for (const testFile of testFiles) {
      const newLocation = await determineNewLocation(testFile);
      if (await moveFile(testFile, newLocation)) {
        movedCount++;
      }
    }
    
    console.log(`\n✅ ${movedCount} files ${DRY_RUN ? 'would be' : 'were'} moved`);
    
    // Cleanup empty __tests__ directories
    if (!DRY_RUN) {
      console.log('\nCleaning up empty directories...');
      await cleanupEmptyDirectories(SRC_DIR);
    }
    
    console.log('\n📝 Next steps:');
    console.log('1. Run tests to ensure nothing broke');
    console.log('2. Update any import paths if needed');
    console.log('3. Commit the changes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();