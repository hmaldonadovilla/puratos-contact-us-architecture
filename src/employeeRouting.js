export const EMPLOYEE_ROUTING_RULES = Object.freeze([
  { minimum: 1, maximum: 1, employeeBand: 'ONE', outcome: 'SELF_SERVICE_ONLY' },
  { minimum: 2, maximum: 5, employeeBand: 'TWO_TO_FIVE', outcome: 'SELF_SERVICE_OR_PERSONAL' },
  { minimum: 6, maximum: 20, employeeBand: 'SIX_TO_TWENTY', outcome: 'PERSONAL_ASSISTANCE' },
  { minimum: 21, maximum: Number.POSITIVE_INFINITY, employeeBand: 'MORE_THAN_TWENTY', outcome: 'PERSONAL_ASSISTANCE' },
]);

export function classifyEmployeeCount(employeeCount) {
  if (!Number.isInteger(employeeCount) || employeeCount < 1) {
    return { employeeBand: null, outcome: 'MANUAL_REVIEW' };
  }

  const rule = EMPLOYEE_ROUTING_RULES.find(
    ({ minimum, maximum }) => employeeCount >= minimum && employeeCount <= maximum,
  );

  return rule
    ? { employeeBand: rule.employeeBand, outcome: rule.outcome }
    : { employeeBand: null, outcome: 'MANUAL_REVIEW' };
}
