import React, { useEffect, useMemo, useRef, useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import journeyDefinition from '../schema/2026-08-03-contact-us-journey-definition-draft.json';

const copy = {
  'contact.account.heading': 'Let’s get you to the right place',
  'contact.account.description': 'First, tell us whether you already use MyPuratos.',
  'contact.account.hasAccount': 'Do you have a MyPuratos account?',
  'contact.customerStatus.heading': 'How do you know Puratos?',
  'contact.customerStatus.question': 'Choose the option that best describes you',
  'contact.customerStatus.existing': 'I am already a Puratos customer',
  'contact.customerStatus.new': 'I am new to Puratos',
  'contact.intent.heading': 'What would you like to do?',
  'contact.intent.question': 'Select your main reason for contacting us',
  'contact.intent.buyProducts': 'I want to buy Puratos products',
  'contact.intent.becomeDistributor': 'I want to become a distributor',
  'contact.intent.homeBaker': 'I am a home baker looking for products',
  'contact.buyProfile.heading': 'Tell us a little about your business',
  'contact.company.businessType': 'Business type',
  'contact.company.employeeBand': 'How many people work in your company?',
  'contact.company.storeCountBand': 'How many stores do you operate?',
  'contact.serviceChoice.question': 'How would you like to continue?',
  'contact.serviceChoice.webshop': 'Register and buy through MyPuratos',
  'contact.serviceChoice.personalSupport': 'Request personal support',
  'contact.personalSupport.heading': 'Request personal support',
  'contact.person.firstName': 'First name',
  'contact.person.lastName': 'Last name',
  'contact.person.email': 'Business email',
  'contact.person.phone': 'Phone number',
  'contact.company.name': 'Company name',
  'contact.company.vatNumber': 'Belgian VAT number',
  'contact.request.message': 'How can we help?',
  'contact.privacy.accept': 'I have read and accept the privacy notice',
  'contact.marketing.email.optional': 'Send me useful product news and inspiration by email',
  'contact.distributor.heading': 'Apply to become a distributor',
  'contact.distributor.coverage': 'What area do you cover?',
  'contact.distributor.regionalCoverage': 'Describe the region you cover',
  'contact.distributor.currentActivities': 'Tell us about your current distribution activities',
  'contact.authenticated.heading': 'How can we help today?',
  'contact.authenticated.action': 'Choose an option',
  'contact.action.faq': 'Consult frequently asked questions',
  'contact.action.aiAssistant': 'Talk to the AI assistant',
  'contact.action.callCustomerCare': 'Call Customer Care',
  'contact.action.sendQuestion': 'Send your question',
  'contact.request.category': 'What is your question about?',
  'contact.request.orderReference': 'Select an order or invoice',
  'contact.confirmation.heading': 'Your request has been received',
  'contact.confirmation.description': 'We have saved your request and will route it to the right Puratos team.',
  'contact.review.heading': 'We’ll review this request',
  'contact.review.description': 'A Puratos specialist will check the details and determine the right next step.',
};

const valueLabels = {
  true: 'Yes',
  false: 'No',
  ARTISAN: 'Artisan bakery',
  INDUSTRY: 'Industrial producer',
  HORECA: 'Hospitality / food service',
  CHOCOLATIER: 'Chocolatier',
  BAKERY_CHAIN: 'Bakery chain',
  OTHER: 'Other',
  ONE: '1 person',
  TWO_TO_FIVE: '2–5 people',
  SIX_TO_TWENTY: '6–20 people',
  MORE_THAN_TWENTY: 'More than 20',
  NATIONAL: 'National',
  REGIONAL: 'Regional',
  GENERAL_QUESTION: 'A general question',
  ORDER_OR_DELIVERY: 'An order or delivery',
  COMPLAINT: 'A complaint or product concern',
};

const storeCountLabels = {
  ONE: '1 store',
  TWO_TO_FIVE: '2–5 stores',
  SIX_TO_TWENTY: '6–20 stores',
  MORE_THAN_TWENTY: 'More than 20 stores',
};

const destinationLabels = {
  MYPURATOS_LOGIN: 'MyPuratos sign-in',
  MYPURATOS_EXISTING_CUSTOMER_REGISTRATION: 'Existing-customer account activation',
  MYPURATOS_NEW_CUSTOMER_REGISTRATION: 'New-customer MyPuratos registration',
  WEBSHOP: 'MyPuratos webshop',
  DISTRIBUTOR_FINDER: 'Puratos distributor finder',
};

const actionLabels = {
  OPEN_FAQ: ['Frequently asked questions', 'The customer would open the market’s approved FAQ experience.'],
  OPEN_AI_ASSISTANT: ['AI assistant', 'The existing Puratos assistant opens with the Contact Us context.'],
  CALL_CUSTOMER_CARE: ['Customer Care', 'The approved telephone number and opening hours are resolved for this market.'],
};

const label = (value) => copy[value] || valueLabels[String(value)] || value;
const optionLabel = (id, value) => (
  id?.includes('storeCountBand') ? storeCountLabels[String(value)] || value : label(value)
);

const localizeSchema = (value) => {
  if (Array.isArray(value)) return value.map(localizeSchema);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (key === 'title' && typeof item === 'string') return [key, label(item)];
      return [key, localizeSchema(item)];
    }),
  );
};

const nodeMap = Object.fromEntries(journeyDefinition.nodes.map((node) => [node.id, node]));
const localizedNodeMap = Object.fromEntries(
  journeyDefinition.nodes.map((node) => [
    node.id,
    node.schema ? { ...node, schema: localizeSchema(node.schema) } : node,
  ]),
);

function ChevronRight({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeft({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RotateIcon({ size = 17 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PuratosMark() {
  return (
    <div className="brand-lockup" aria-label="Puratos">
      <span className="brand-symbol" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-name">Puratos</span>
    </div>
  );
}

function optionList(options, schema) {
  if (options?.enumOptions?.length) return options.enumOptions;
  if (schema?.type === 'boolean') {
    return [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];
  }
  return (schema?.enum || []).map((value) => ({ label: value, value }));
}

function PuratosRadio({ id, value, onChange, options, schema, disabled, readonly }) {
  const choices = optionList(options, schema);
  return (
    <div className="choice-list" id={id}>
      {choices.map((choice) => {
        const selected = value === choice.value;
        return (
          <label className={`choice-row ${selected ? 'is-selected' : ''}`} key={String(choice.value)}>
            <input
              type="radio"
              name={id}
              value={String(choice.value)}
              checked={selected}
              disabled={disabled || readonly}
              onChange={() => onChange(choice.value)}
            />
            <span className="choice-indicator" aria-hidden="true" />
            <span>{optionLabel(id, choice.label)}</span>
          </label>
        );
      })}
    </div>
  );
}

function PuratosSelect({ id, value, onChange, options, schema, disabled, readonly, placeholder }) {
  const choices = optionList(options, schema);
  return (
    <div className="select-wrap">
      <select
        id={id}
        value={value ?? ''}
        disabled={disabled || readonly}
        onChange={(event) => onChange(event.target.value || undefined)}
      >
        <option value="">{placeholder || 'Select an option'}</option>
        {choices.map((choice) => (
          <option value={choice.value} key={String(choice.value)}>
            {optionLabel(id, choice.label)}
          </option>
        ))}
      </select>
      <span className="select-chevron" aria-hidden="true">⌄</span>
    </div>
  );
}

function PuratosText({ id, value, onChange, onBlur, onFocus, disabled, readonly, placeholder, schema }) {
  return (
    <input
      className="text-control"
      id={id}
      value={value ?? ''}
      type={schema?.format === 'email' ? 'email' : 'text'}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder || ''}
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur?.(id, event.target.value)}
      onFocus={(event) => onFocus?.(id, event.target.value)}
    />
  );
}

function PuratosPhone(props) {
  return <PuratosText {...props} placeholder="+32 4XX XX XX XX" />;
}

function PuratosTextArea({ id, value, onChange, onBlur, onFocus, disabled, readonly, placeholder }) {
  return (
    <textarea
      className="text-control text-area"
      id={id}
      value={value ?? ''}
      disabled={disabled}
      readOnly={readonly}
      placeholder={placeholder || 'Add any useful context for our team'}
      rows={5}
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur?.(id, event.target.value)}
      onFocus={(event) => onFocus?.(id, event.target.value)}
    />
  );
}

function PuratosCheckbox({ id, value, onChange, disabled, readonly, schema }) {
  return (
    <label className={`checkbox-row ${value ? 'is-selected' : ''}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={Boolean(value)}
        disabled={disabled || readonly}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="checkbox-indicator" aria-hidden="true">
        {value && <CheckIcon size={14} />}
      </span>
      <span>{schema?.title}</span>
    </label>
  );
}

const sampleOrders = [
  { id: '4500123401', date: '30 Jul 2026', description: 'Bakery ingredients · 8 items' },
  { id: '4500119824', date: '18 Jul 2026', description: 'Chocolate & fillings · 4 items' },
  { id: '4500116042', date: '03 Jul 2026', description: 'Patisserie mixes · 6 items' },
];

function PuratosCommerceReferenceLookup({ formData, onChange }) {
  const selected = formData?.referenceId || formData?.referenceType;
  const choose = (referenceType, referenceId) => onChange({ referenceType, ...(referenceId ? { referenceId } : {}) });
  return (
    <div className="order-lookup">
      <div className="lookup-search">
        <span aria-hidden="true">⌕</span>
        <input aria-label="Search orders" placeholder="Search recent orders" />
      </div>
      <div className="order-list">
        {sampleOrders.map((order) => (
          <button
            className={`order-row ${selected === order.id ? 'is-selected' : ''}`}
            type="button"
            key={order.id}
            onClick={() => choose('ORDER', order.id)}
          >
            <span className="order-radio" aria-hidden="true" />
            <span>
              <strong>Order {order.id}</strong>
              <small>{order.description}</small>
            </span>
            <time>{order.date}</time>
          </button>
        ))}
      </div>
      <div className="lookup-fallbacks">
        <button type="button" className={selected === 'NOT_LISTED' ? 'is-active' : ''} onClick={() => choose('NOT_LISTED')}>
          My order is not listed
        </button>
        <button type="button" className={selected === 'UNKNOWN' ? 'is-active' : ''} onClick={() => choose('UNKNOWN')}>
          I don’t know the order
        </button>
      </div>
    </div>
  );
}

function FieldTemplate(props) {
  const { id, classNames, label: fieldLabel, help, required, description, errors, children, hidden, uiSchema } = props;
  if (hidden) return children;
  const checkbox = uiSchema?.['ui:widget'] === 'PuratosCheckbox';
  return (
    <div className={`${classNames || ''} field-shell ${checkbox ? 'field-shell--checkbox' : ''}`}>
      {!checkbox && fieldLabel && (
        <label className="field-label" htmlFor={id}>
          {fieldLabel}
          {required && <span className="required-dot" aria-label="required">●</span>}
        </label>
      )}
      {description}
      {children}
      {errors}
      {help}
    </div>
  );
}

function ErrorListTemplate({ errors }) {
  if (!errors?.length) return null;
  return (
    <div className="error-summary" role="alert">
      <strong>Please check the highlighted information.</strong>
      <span>{errors[0]?.message}</span>
    </div>
  );
}

const widgets = {
  PuratosRadio,
  PuratosSelect,
  PuratosText,
  PuratosTextArea,
  PuratosPhone,
  PuratosCheckbox,
};

const fields = { PuratosCommerceReferenceLookup };

const templates = { FieldTemplate, ErrorListTemplate };

function getValue(data, path) {
  return path?.split('.').reduce((value, key) => value?.[key], data);
}

function matches(when, data) {
  if (!when || when.operator === 'VALID' || when.operator === 'ALWAYS') return true;
  if (when.operator === 'EQ') return getValue(data, when.answerPath) === when.value;
  return false;
}

function resolveHeading(node) {
  if (node.contentKeys?.heading) return label(node.contentKeys.heading);
  if (node.type === 'SERVER_DECISION') return 'OutSystems routing decision';
  if (node.type === 'REDIRECT') return 'Continue in the right Puratos service';
  if (node.id === 'submit_contact_request') return 'Submit the request';
  if (node.id === 'service_model_choice') return 'Choose how you would like to continue';
  if (node.id === 'authenticated_request') return 'Send your question';
  return node.id.replaceAll('_', ' ');
}

function nodeTypeLabel(type) {
  return {
    FORM: 'RJSF form',
    SERVER_DECISION: 'Server decision',
    ACTION: 'Action',
    REDIRECT: 'Handoff',
    TERMINAL: 'Outcome',
  }[type] || type;
}

function Inspector({ node, open, onClose }) {
  const [tab, setTab] = useState('schema');
  const [copied, setCopied] = useState(false);
  useEffect(() => setTab(node.schema ? 'schema' : 'node'), [node.id, node.schema]);
  const values = {
    schema: node.schema || { message: 'This node has no JSON Schema.' },
    uiSchema: node.uiSchema || { message: 'This node has no RJSF uiSchema.' },
    node,
  };
  const currentValue = values[tab];
  const copyJson = async () => {
    await navigator.clipboard?.writeText(JSON.stringify(currentValue, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <aside className={`inspector ${open ? 'is-open' : ''}`} aria-label="Schema inspector">
      <div className="inspector-heading">
        <div>
          <span className="eyebrow">Definition inspector</span>
          <strong>{node.id}</strong>
        </div>
        <button className="icon-button inspector-close" type="button" onClick={onClose} aria-label="Close inspector">×</button>
      </div>
      <div className="inspector-meta">
        <span>{nodeTypeLabel(node.type)}</span>
        <span>draft-07</span>
      </div>
      <div className="inspector-tabs" role="tablist" aria-label="Definition view">
        <button className={tab === 'schema' ? 'is-active' : ''} type="button" onClick={() => setTab('schema')}>Schema</button>
        <button className={tab === 'uiSchema' ? 'is-active' : ''} type="button" onClick={() => setTab('uiSchema')}>UI schema</button>
        <button className={tab === 'node' ? 'is-active' : ''} type="button" onClick={() => setTab('node')}>Node</button>
      </div>
      <div className="code-toolbar">
        <span>{tab === 'uiSchema' ? 'ui-schema.json' : `${tab}.json`}</span>
        <button type="button" onClick={copyJson}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre className="code-view"><code>{JSON.stringify(currentValue, null, 2)}</code></pre>
      <div className="inspector-note">
        <span className="status-dot" />
        OutSystems validates this definition and returns the authoritative next node.
      </div>
    </aside>
  );
}

function JourneySidebar({ current, history, mode, onModeChange, onRestart }) {
  const visibleHistory = [...history, current.id].slice(-5);
  return (
    <aside className="journey-sidebar">
      <PuratosMark />
      <div className="sidebar-title">
        <span className="eyebrow">Contact Us prototype</span>
        <h1>Schema-driven journey</h1>
        <p>AEM experience · OutSystems decisions</p>
      </div>

      <div className="mode-switch" role="group" aria-label="Customer context">
        <button type="button" className={mode === 'anonymous' ? 'is-active' : ''} onClick={() => onModeChange('anonymous')}>Anonymous</button>
        <button type="button" className={mode === 'authenticated' ? 'is-active' : ''} onClick={() => onModeChange('authenticated')}>Signed in</button>
      </div>

      <nav className="journey-progress" aria-label="Journey progress">
        <span className="eyebrow">Current path</span>
        <ol>
          {visibleHistory.map((id, index) => {
            const item = nodeMap[id];
            const active = id === current.id && index === visibleHistory.length - 1;
            return (
              <li className={active ? 'is-active' : 'is-complete'} key={`${id}-${index}`}>
                <span className="progress-marker">{active ? index + 1 : <CheckIcon size={13} />}</span>
                <span>
                  <strong>{resolveHeading(item)}</strong>
                  <small>{nodeTypeLabel(item.type)}</small>
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="configuration-block">
        <span className="eyebrow">Resolved configuration</span>
        <dl>
          <div><dt>Market</dt><dd>Belgium · 0005</dd></div>
          <div><dt>State</dt><dd><span className="pilot-dot" /> Pilot</dd></div>
          <div><dt>Definition</dt><dd>08-03-01</dd></div>
        </dl>
      </div>

      <button className="reset-button" type="button" onClick={onRestart}><RotateIcon /> Restart journey</button>
    </aside>
  );
}

function ServerBoundary() {
  return (
    <div className="server-boundary">
      <span className="server-icon" aria-hidden="true">OS</span>
      <span><strong>Server-authoritative step</strong> AEM sends the answers; OutSystems validates and selects the next node.</span>
    </div>
  );
}

function FormNode({ node, formData, onChange, onSubmit, formRef }) {
  return (
    <>
      {node.trustedContext && (
        <div className="trusted-context">
          <div className="avatar">HM</div>
          <div><span>Signed in as</span><strong>Hector Maldonado · Puratos Belgium</strong></div>
          <span className="verified-badge"><CheckIcon size={14} /> Verified context</span>
        </div>
      )}
      <Form
        key={node.id}
        ref={formRef}
        schema={node.schema}
        uiSchema={node.uiSchema}
        formData={formData}
        validator={validator}
        widgets={widgets}
        fields={fields}
        templates={templates}
        showErrorList="top"
        noHtml5Validate
        experimental_defaultFormStateBehavior={{
          // Consent is represented as `const: true` for validation, but must
          // never be inferred as the customer's choice by the renderer.
          constAsDefaults: 'never',
          emptyObjectFields: 'skipEmptyDefaults',
        }}
        onChange={({ formData: nextData }) => onChange(nextData)}
        onSubmit={({ formData: submittedData }) => onSubmit(submittedData)}
        transformErrors={(errors) => errors.map((error) => ({ ...error, message: error.message?.replace('must', 'Please') }))}
      />
    </>
  );
}

function DecisionNode({ node, answers, result, onEvaluate, onContinue }) {
  const profile = answers.buy_products_profile || {};
  const resultLabels = {
    SELF_SERVICE_ONLY: ['Self-service recommended', 'This profile is best served through MyPuratos registration and the webshop.'],
    SELF_SERVICE_OR_PERSONAL: ['Two suitable routes', 'Offer MyPuratos self-service or a personal conversation with a sales representative.'],
    PERSONAL_ASSISTANCE: ['Personal assistance recommended', 'Route this prospect to a sales representative for follow-up.'],
  };
  return (
    <div className="decision-workspace">
      <div className="decision-inputs">
        <span>Inputs available to the decision</span>
        <div><small>Business type</small><strong>{label(profile.businessType || '—')}</strong></div>
        <div><small>Employee band</small><strong>{label(profile.employeeBand || '—')}</strong></div>
        <div><small>Market</small><strong>Belgium · sales org 0005</strong></div>
      </div>
      <div className={`decision-result ${result ? 'is-resolved' : ''}`}>
        {!result ? (
          <>
            <span className="decision-orbit" aria-hidden="true"><i /><i /><i /></span>
            <strong>Waiting for server evaluation</strong>
            <p>The browser cannot choose the route. This button simulates the OutSystems step-evaluation response.</p>
            <button className="primary-button" type="button" onClick={onEvaluate}>Simulate OutSystems decision <ChevronRight /></button>
          </>
        ) : (
          <>
            <span className="success-seal"><CheckIcon size={24} /></span>
            <span className="eyebrow">Decision returned</span>
            <h3>{resultLabels[result.outcome]?.[0]}</h3>
            <p>{resultLabels[result.outcome]?.[1]}</p>
            <code>{result.outcome}</code>
            <button className="primary-button" type="button" onClick={onContinue}>Continue to returned node <ChevronRight /></button>
          </>
        )}
      </div>
    </div>
  );
}

function ActionNode({ node, processing, onAction, answers, completed }) {
  if (node.id === 'submit_contact_request') {
    const request = answers.personal_support_request || answers.distributor_application || answers.authenticated_request || {};
    return (
      <div className="submission-review">
        <div className="review-status"><span className="status-dot" /> Ready for durable intake</div>
        <dl>
          <div><dt>Request type</dt><dd>{nodeMap[Object.keys(answers).find((id) => nodeMap[id]?.requestType)]?.requestType || 'Customer request'}</dd></div>
          <div><dt>Customer context</dt><dd>{request.companyName || 'Authenticated MyPuratos account'}</dd></div>
          <div><dt>Definition</dt><dd>{journeyDefinition.manifest.definitionVersion}</dd></div>
          <div><dt>Target</dt><dd>OutSystems durable Contact Intake</dd></div>
        </dl>
        <ServerBoundary />
        <button className="primary-button" type="button" disabled={processing} onClick={onAction}>
          {processing ? <><span className="spinner" /> Accepting request…</> : <>Submit to OutSystems <ChevronRight /></>}
        </button>
      </div>
    );
  }
  const [title, description] = actionLabels[node.actionKey] || ['Puratos service', 'This action opens the configured market service.'];
  return (
    <div className="handoff-view">
      <span className={`handoff-glyph ${completed ? 'is-complete' : ''}`} aria-hidden="true">{completed ? <CheckIcon size={30} /> : '↗'}</span>
      <span className="eyebrow">Configured action</span>
      <h3>{completed ? 'Action simulated' : title}</h3>
      <p>{completed ? `${title} would now open using the resolved market configuration.` : description}</p>
      <code>{node.actionKey}</code>
      {!completed && <button className="primary-button" type="button" onClick={onAction}>Simulate action <ChevronRight /></button>}
    </div>
  );
}

function RedirectNode({ node, redirected, onRedirect }) {
  const destination = destinationLabels[node.destinationKey] || node.destinationKey;
  return (
    <div className="handoff-view">
      <span className={`handoff-glyph ${redirected ? 'is-complete' : ''}`} aria-hidden="true">{redirected ? <CheckIcon size={30} /> : '↗'}</span>
      <span className="eyebrow">Protected handoff</span>
      <h3>{redirected ? 'Handoff simulated' : destination}</h3>
      <p>{node.preserveJourney ? 'The opaque journey ID is preserved so the customer can return after sign-in or registration.' : 'The visitor continues to the approved external Puratos destination.'}</p>
      <code>{node.destinationKey}</code>
      {!redirected && <button className="primary-button" type="button" onClick={onRedirect}>Simulate redirect <ChevronRight /></button>}
    </div>
  );
}

function TerminalNode({ node, onRestart }) {
  return (
    <div className="terminal-view">
      <span className="terminal-mark"><CheckIcon size={34} /></span>
      <span className="eyebrow">Journey outcome</span>
      <h3>{resolveHeading(node)}</h3>
      <p>{label(node.contentKeys?.description)}</p>
      <div className="reference-number">Reference <strong>CR-2026-00001234</strong></div>
      <button className="secondary-button" type="button" onClick={onRestart}><RotateIcon /> Start another journey</button>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState('anonymous');
  const [currentId, setCurrentId] = useState(journeyDefinition.manifest.entryNodeId);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [formData, setFormData] = useState({});
  const [decisionResult, setDecisionResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const formRef = useRef(null);

  const current = localizedNodeMap[currentId];
  const originalCurrent = nodeMap[currentId];
  const canGoBack = history.length > 0;

  useEffect(() => {
    setFormData(answers[currentId] || {});
    setDecisionResult(null);
    setRedirected(false);
  }, [currentId]);

  const navigate = (nextId) => {
    if (!nextId || !nodeMap[nextId]) return;
    setHistory((items) => [...items, currentId]);
    setCurrentId(nextId);
  };

  const restart = (nextMode = mode) => {
    setMode(nextMode);
    setHistory([]);
    setAnswers({});
    setFormData({});
    setDecisionResult(null);
    setProcessing(false);
    setRedirected(false);
    setCurrentId(nextMode === 'authenticated' ? 'authenticated_options' : journeyDefinition.manifest.entryNodeId);
  };

  const goBack = () => {
    if (!history.length) return;
    const items = [...history];
    const previous = items.pop();
    setHistory(items);
    setCurrentId(previous);
  };

  const submitForm = (submittedData) => {
    setAnswers((all) => ({ ...all, [currentId]: submittedData }));
    const transition = current.transitions?.find((item) => matches(item.when, submittedData));
    if (transition) navigate(transition.nextNodeId);
  };

  const evaluateDecision = () => {
    const employeeBand = answers.buy_products_profile?.employeeBand;
    const outcome = employeeBand === 'ONE'
      ? 'SELF_SERVICE_ONLY'
      : employeeBand === 'TWO_TO_FIVE'
        ? 'SELF_SERVICE_OR_PERSONAL'
        : 'PERSONAL_ASSISTANCE';
    setDecisionResult({ outcome, nextId: current.allowedOutcomes[outcome] });
  };

  const runAction = async () => {
    if (current.id === 'submit_contact_request') {
      setProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 850));
      setProcessing(false);
      navigate(current.onSuccessNodeId);
      return;
    }
    setRedirected(true);
  };

  const primaryAction = current.type === 'FORM' ? (
    <button className="primary-button" type="button" onClick={() => formRef.current?.submit()}>
      Continue <ChevronRight />
    </button>
  ) : null;

  const nodeContent = useMemo(() => {
    if (current.type === 'FORM') {
      return <FormNode node={current} formData={formData} onChange={setFormData} onSubmit={submitForm} formRef={formRef} />;
    }
    if (current.type === 'SERVER_DECISION') {
      return <DecisionNode node={current} answers={answers} result={decisionResult} onEvaluate={evaluateDecision} onContinue={() => navigate(decisionResult?.nextId)} />;
    }
    if (current.type === 'ACTION') {
      return <ActionNode node={current} answers={answers} processing={processing} completed={redirected} onAction={runAction} />;
    }
    if (current.type === 'REDIRECT') {
      return <RedirectNode node={current} redirected={redirected} onRedirect={() => setRedirected(true)} />;
    }
    return <TerminalNode node={current} onRestart={() => restart()} />;
  }, [current, formData, answers, decisionResult, processing, redirected]);

  return (
    <div className="app-shell">
      <JourneySidebar current={current} history={history} mode={mode} onModeChange={restart} onRestart={() => restart()} />

      <main className="workspace">
        <header className="workspace-header">
          <div className="mobile-brand"><PuratosMark /></div>
          <div className="runtime-status">
            <span className="status-dot" />
            Definition loaded
            <code>{journeyDefinition.manifest.definitionVersion}</code>
          </div>
          <button
            className="mobile-mode-button"
            type="button"
            onClick={() => restart(mode === 'anonymous' ? 'authenticated' : 'anonymous')}
          >
            {mode === 'anonymous' ? 'Anonymous' : 'Signed in'}
          </button>
          <button className="inspector-button" type="button" onClick={() => setInspectorOpen(true)}><CodeIcon /> Inspect schema</button>
        </header>

        <section className="form-stage" aria-live="polite">
          <div className="stage-meta">
            <span className={`node-type node-type--${current.type.toLowerCase()}`}>{nodeTypeLabel(current.type)}</span>
            <span>Node {String(history.length + 1).padStart(2, '0')}</span>
          </div>
          <div className="stage-heading" key={`heading-${current.id}`}>
            <h2>{resolveHeading(current)}</h2>
            {current.contentKeys?.description && <p>{label(current.contentKeys.description)}</p>}
            {current.type === 'FORM' && !current.contentKeys?.description && (
              <p>Fields and conditions are rendered from the market-resolved definition.</p>
            )}
          </div>

          <div className="node-content" key={current.id}>{nodeContent}</div>

          {(primaryAction || canGoBack) && (
            <footer className="stage-actions">
              <button className="back-button" type="button" disabled={!canGoBack} onClick={goBack}><ArrowLeft /> Back</button>
              {primaryAction}
            </footer>
          )}
        </section>

        <footer className="workspace-footer">
          <span>Architecture prototype · Not connected to production systems</span>
          <span>RJSF 5.24.13 · JSON Schema draft-07</span>
        </footer>
      </main>

      <Inspector node={originalCurrent} open={inspectorOpen} onClose={() => setInspectorOpen(false)} />
      {inspectorOpen && <button className="inspector-scrim" type="button" aria-label="Close schema inspector" onClick={() => setInspectorOpen(false)} />}
    </div>
  );
}
