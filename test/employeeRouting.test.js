import assert from 'node:assert/strict';
import test from 'node:test';

import { classifyEmployeeCount } from '../src/employeeRouting.js';

const cases = [
  [1, 'ONE', 'SELF_SERVICE_ONLY'],
  [2, 'TWO_TO_FIVE', 'SELF_SERVICE_OR_PERSONAL'],
  [5, 'TWO_TO_FIVE', 'SELF_SERVICE_OR_PERSONAL'],
  [6, 'SIX_TO_TWENTY', 'PERSONAL_ASSISTANCE'],
  [20, 'SIX_TO_TWENTY', 'PERSONAL_ASSISTANCE'],
  [21, 'MORE_THAN_TWENTY', 'PERSONAL_ASSISTANCE'],
  [250, 'MORE_THAN_TWENTY', 'PERSONAL_ASSISTANCE'],
];

for (const [employeeCount, employeeBand, outcome] of cases) {
  test(`classifies ${employeeCount} employee(s) as ${employeeBand}`, () => {
    assert.deepEqual(classifyEmployeeCount(employeeCount), { employeeBand, outcome });
  });
}

for (const employeeCount of [undefined, 0, -1, 1.5, '5']) {
  test(`rejects invalid employee count ${String(employeeCount)}`, () => {
    assert.deepEqual(classifyEmployeeCount(employeeCount), {
      employeeBand: null,
      outcome: 'MANUAL_REVIEW',
    });
  });
}
