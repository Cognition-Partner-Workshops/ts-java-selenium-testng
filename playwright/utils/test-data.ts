/**
 * TestData utility - equivalent of GetTestData.get() in Katalon.
 *
 * Reads values from environment variables or a JSON config file.
 * Set the env var TEST_DATA_FILE to point at a JSON file, or provide
 * individual env vars (URL, USERNAME, PASSWORD, LAST_NAME, ACCOUNT_STATUS).
 */

import * as fs from 'fs';
import * as path from 'path';

export interface TestDataMap {
  URL: string;
  UserName: string;
  Password: string;
  LastName?: string;
  AccountStatus?: string;
  [key: string]: string | undefined;
}

let cachedData: TestDataMap | null = null;

function loadFromFile(): TestDataMap | null {
  const filePath = process.env.TEST_DATA_FILE;
  if (!filePath) return null;

  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.warn(`Test data file not found: ${resolved}`);
    return null;
  }

  const raw = fs.readFileSync(resolved, 'utf-8');
  return JSON.parse(raw) as TestDataMap;
}

function loadTestData(): TestDataMap {
  if (cachedData) return cachedData;

  const fileData = loadFromFile();
  if (fileData) {
    cachedData = fileData;
    return cachedData;
  }

  // Fall back to environment variables
  cachedData = {
    URL: process.env.URL || process.env.BASE_URL || '',
    UserName: process.env.USERNAME || '',
    Password: process.env.PASSWORD || '',
    LastName: process.env.LAST_NAME || '',
    AccountStatus: process.env.ACCOUNT_STATUS || '',
  };
  return cachedData;
}

/**
 * Retrieve a test-data value by key (mirrors GetTestData.get(key)).
 */
export function getTestData(key: keyof TestDataMap): string {
  const data = loadTestData();
  return data[key] ?? '';
}

/**
 * Return the full test-data map.
 */
export function getAllTestData(): TestDataMap {
  return loadTestData();
}
