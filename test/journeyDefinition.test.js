import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const definitionPath = new URL('../schema/2026-08-28-contact-us-journey-definition-draft.json', import.meta.url);
const definition = JSON.parse(await readFile(definitionPath, 'utf8'));
const profileNode = definition.nodes.find(({ id }) => id === 'buy_products_profile');
const decisionNode = definition.nodes.find(({ id }) => id === 'service_model_decision');

test('buy-products profile captures an exact positive integer', () => {
  assert.deepEqual(profileNode.schema.properties.employeeCount, {
    type: 'integer',
    title: 'contact.company.employeeCount',
    minimum: 1,
  });
  assert.equal(profileNode.schema.properties.employeeBand, undefined);
  assert.ok(profileNode.schema.required.includes('employeeCount'));
});

test('service-model decision binds the exact count to a versioned server rule set', () => {
  assert.equal(decisionNode.inputBindings.employeeCount, 'buy_products_profile.employeeCount');
  assert.equal(decisionNode.ruleSetKey, 'SERVICE_MODEL_BY_EMPLOYEE_COUNT');
  assert.equal(decisionNode.ruleSetVersion, 'BE-0005-2026-08-28-01');
});
