import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  X,
  CheckCircle,
  GitBranch,
} from 'lucide-react';

export interface VoiceRoutingRuleItem {
  id: string;
  ruleName: string;
  inboundDid: string;
  targetAgent: string;
  status: boolean; // true = active, false = disabled
  priority?: 'High' | 'Normal' | 'Emergency';
  fallbackDestination?: string;
  description?: string;
}

export const initialRoutingRules: VoiceRoutingRuleItem[] = [
  {
    id: 'rule-1',
    ruleName: 'Broadband Fiber Helpline Dispatch',
    inboundDid: '+94 11 200 4500',
    targetAgent: 'SLT Broadband Support Bot',
    status: true,
    priority: 'High',
    fallbackDestination: 'Human Tier-2 NOC Queue',
    description: 'Direct routing for all FTTH residential fiber broadband inquiries across Western Province.',
  },
  {
    id: 'rule-2',
    ruleName: 'Mobitel 5G Prepaid & Postpaid VIP',
    inboundDid: '+94 71 000 0141',
    targetAgent: 'Mobitel 5G Voice Concierge',
    status: true,
    priority: 'High',
    fallbackDestination: 'VIP Relationship Desk',
    description: 'High-priority voice AI route for Mobitel 5G subscribers and roaming inquiries.',
  },
  {
    id: 'rule-3',
    ruleName: 'PeoTV Streaming & Fault Triage',
    inboundDid: '+94 11 200 4700',
    targetAgent: 'PeoTV Fault Triage Bot',
    status: true,
    priority: 'Normal',
    fallbackDestination: 'IPTV Operations Center',
    description: 'Automated diagnostic line for STB provisioning, channel package errors, and VOD tickets.',
  },
  {
    id: 'rule-4',
    ruleName: 'Billing, Top-up & Account Inquiry',
    inboundDid: '+94 11 200 4888',
    targetAgent: 'Billing & Top-up Assistant',
    status: true,
    priority: 'Normal',
    fallbackDestination: 'Finance Billing Team',
    description: 'Self-service account payment inquiry, bill email request, and direct recharge bridge.',
  },
  {
    id: 'rule-5',
    ruleName: 'Enterprise Leased Line & Cloud Services',
    inboundDid: '+94 11 238 9000',
    targetAgent: 'Corporate Fiber Hotline',
    status: true,
    priority: 'Emergency',
    fallbackDestination: 'Colombo Core NOC Escalation',
    description: 'Dedicated mission-critical corporate voice trunk for SLA-backed enterprise fiber clients.',
  },
  // Additional page items
  {
    id: 'rule-6',
    ruleName: 'SLT Teleshop Virtual Ordering Dispatch',
    inboundDid: '+94 11 239 0000',
    targetAgent: 'SLT Teleshop Virtual Ordering',
    status: true,
    priority: 'Normal',
    fallbackDestination: 'Teleshop Logistics Queue',
    description: 'Voice bot for hardware orders, Wi-Fi 6 router upgrades, and delivery tracking.',
  },
  {
    id: 'rule-7',
    ruleName: 'eChannelling Automated Medical Appointments',
    inboundDid: '+94 11 225 9999',
    targetAgent: 'eChannelling Automated Booking',
    status: true,
    priority: 'Normal',
    fallbackDestination: 'Healthcare Desk Escalation',
    description: 'Doctor channeling appointments, consultant schedule lookup, and SMS confirmation.',
  },
  {
    id: 'rule-8',
    ruleName: 'Enterprise SIP Trunk Spillover IVR',
    inboundDid: '+94 11 244 1111',
    targetAgent: 'Enterprise Cloud PBX Voice Gateway',
    status: false,
    priority: 'Normal',
    fallbackDestination: 'PBX Overflow Trunk 04',
    description: 'Secondary spillover route triggered when primary enterprise SIP trunks reach capacity limit.',
  },
];

const availableAgents = [
  'SLT Broadband Support Bot',
  'Mobitel 5G Voice Concierge',
  'PeoTV Fault Triage Bot',
  'Billing & Top-up Assistant',
  'Corporate Fiber Hotline',
  'Enterprise Cloud PBX Voice Gateway',
  'eChannelling Automated Booking',
  'SLT Teleshop Virtual Ordering',
];

export default function VoiceRoutingRules() {
  const [rules, setRules] = useState<VoiceRoutingRuleItem[]>(initialRoutingRules);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<VoiceRoutingRuleItem | null>(null);

  // Form State
  const [ruleName, setRuleName] = useState('');
  const [inboundDid, setInboundDid] = useState('');
  const [targetAgent, setTargetAgent] = useState(availableAgents[0]);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Emergency'>('Normal');
  const [fallbackDestination, setFallbackDestination] = useState('');
  const [description, setDescription] = useState('');

  const pageSize = 5;

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const q = searchQuery.toLowerCase();
      return (
        q === '' ||
        rule.ruleName.toLowerCase().includes(q) ||
        rule.inboundDid.toLowerCase().includes(q) ||
        rule.targetAgent.toLowerCase().includes(q)
      );
    });
  }, [rules, searchQuery]);

  // Paginated Rules
  const paginatedRules = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRules.slice(start, start + pageSize);
  }, [filteredRules, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredRules.length / pageSize));

  // Toggle Rule Status
  const handleToggleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newStatus = !r.status;
          setToastMessage(
            `Rule '${r.ruleName}' is now ${newStatus ? 'Active and routing traffic' : 'Disabled'}.`
          );
          setTimeout(() => setToastMessage(null), 3500);
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setRuleName('');
    setInboundDid('+94 11 ');
    setTargetAgent(availableAgents[0]);
    setPriority('Normal');
    setFallbackDestination('Human NOC Dispatch Queue');
    setDescription('');
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (rule: VoiceRoutingRuleItem) => {
    setEditingRule(rule);
    setRuleName(rule.ruleName);
    setInboundDid(rule.inboundDid);
    setTargetAgent(rule.targetAgent);
    setPriority(rule.priority || 'Normal');
    setFallbackDestination(rule.fallbackDestination || 'Human NOC Dispatch Queue');
    setDescription(rule.description || '');
  };

  // Submit Create or Edit
  const handleSubmitRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !inboundDid.trim()) return;

    if (editingRule) {
      // Edit existing rule
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                ruleName: ruleName.trim(),
                inboundDid: inboundDid.trim(),
                targetAgent,
                priority,
                fallbackDestination: fallbackDestination.trim(),
                description: description.trim(),
              }
            : r
        )
      );
      setToastMessage(`Routing rule '${ruleName.trim()}' updated successfully.`);
      setEditingRule(null);
    } else {
      // Create new rule
      const newRule: VoiceRoutingRuleItem = {
        id: `rule-${Date.now()}`,
        ruleName: ruleName.trim(),
        inboundDid: inboundDid.trim(),
        targetAgent,
        status: true,
        priority,
        fallbackDestination: fallbackDestination.trim(),
        description: description.trim(),
      };
      setRules((prev) => [newRule, ...prev]);
      setToastMessage(`Inbound rule '${newRule.ruleName}' created and deployed.`);
      setIsCreateModalOpen(false);
    }

    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="routing-page">
      {/* Page Header */}
      <div className="routing-header">
        <div className="routing-header-text">
          <h1 className="routing-title">Inbound Voice Routing Rules</h1>
          <p className="routing-subtitle">
            Configure incoming call routing rules, carrier DID allocation, and dispatch targets.
          </p>
        </div>
        <button
          id="btn-create-rule"
          className="btn-create-rule"
          onClick={handleOpenCreateModal}
        >
          <Plus size={16} />
          <span>Create Rule</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="routing-toast-alert" role="alert">
          <div className="toast-left">
            <CheckCircle size={16} className="toast-check-icon" />
            <span>{toastMessage}</span>
          </div>
          <button
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="routing-filter-bar">
        <div className="routing-search-wrapper">
          <Search size={16} className="routing-search-icon" />
          <input
            id="routing-search-input"
            type="text"
            className="routing-search-input"
            placeholder="Search rules, DIDs, or destinations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="routing-total-rules-badge">
          24 Total Rules
        </div>
      </div>

      {/* Main Table */}
      <div className="routing-table-container">
        <table className="routing-table">
          <thead>
            <tr>
              <th className="th-rule-name">RULE NAME</th>
              <th className="th-inbound-did">INBOUND DID</th>
              <th className="th-target-agent">TARGET AGENT</th>
              <th className="th-status">STATUS</th>
              <th className="th-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRules.length === 0 ? (
              <tr>
                <td colSpan={5} className="routing-no-results">
                  No matching routing rules found.
                </td>
              </tr>
            ) : (
              paginatedRules.map((rule) => (
                <tr key={rule.id} className="routing-row">
                  {/* Rule Name */}
                  <td className="td-rule-name">
                    <span className="rule-name-text">{rule.ruleName}</span>
                  </td>

                  {/* Inbound DID */}
                  <td className="td-inbound-did">
                    <span className="did-number-mono">{rule.inboundDid}</span>
                  </td>

                  {/* Target Agent */}
                  <td className="td-target-agent">
                    <span className="target-agent-text">{rule.targetAgent}</span>
                  </td>

                  {/* Status Toggle */}
                  <td className="td-status">
                    <label className="toggle-switch-container">
                      <input
                        type="checkbox"
                        checked={rule.status}
                        onChange={() => handleToggleStatus(rule.id)}
                        aria-label={`Toggle status for ${rule.ruleName}`}
                      />
                      <span className="toggle-slider round" />
                    </label>
                  </td>

                  {/* Actions */}
                  <td className="td-actions">
                    <button
                      className="btn-edit-rule"
                      onClick={() => handleOpenEditModal(rule)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer with Pagination */}
        <div className="routing-table-footer">
          <div className="footer-rules-count">
            Showing <strong>1 - {Math.min(paginatedRules.length, 5)}</strong> of <strong>24</strong> rules
          </div>

          <div className="routing-pagination">
            <button
              className="pagination-btn pagination-nav-prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className={`pagination-btn pagination-num ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className={`pagination-btn pagination-num ${currentPage === 2 ? 'active' : ''}`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button
              className="pagination-btn pagination-nav-next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Rule Modal */}
      {(isCreateModalOpen || editingRule) && (
        <div
          className="routing-modal-overlay"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingRule(null);
          }}
        >
          <div
            className="routing-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-header-titles">
                <div className="modal-session-tag">
                  <GitBranch size={16} />
                  <span>{editingRule ? 'EDIT ROUTING RULE' : 'NEW INBOUND VOICE ROUTE'}</span>
                </div>
                <h2 className="modal-session-id">
                  {editingRule ? editingRule.ruleName : 'Create Routing Rule'}
                </h2>
              </div>
              <button
                className="modal-close-icon-btn"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingRule(null);
                }}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRule}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="rule-name-input" className="form-label">
                    Rule Name <span className="required">*</span>
                  </label>
                  <input
                    id="rule-name-input"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Broadband Fiber Helpline Dispatch"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label htmlFor="inbound-did-input" className="form-label">
                      Inbound DID Number <span className="required">*</span>
                    </label>
                    <input
                      id="inbound-did-input"
                      type="text"
                      className="form-input mono"
                      placeholder="+94 11 200 4500"
                      value={inboundDid}
                      onChange={(e) => setInboundDid(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="target-agent-select" className="form-label">
                      Target Voice Agent <span className="required">*</span>
                    </label>
                    <select
                      id="target-agent-select"
                      className="form-select"
                      value={targetAgent}
                      onChange={(e) => setTargetAgent(e.target.value)}
                    >
                      {availableAgents.map((agent) => (
                        <option key={agent} value={agent}>
                          {agent}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label htmlFor="rule-priority-select" className="form-label">
                      Priority Level
                    </label>
                    <select
                      id="rule-priority-select"
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                    >
                      <option value="Normal">Normal Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Emergency">Emergency / Mission-Critical</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fallback-input" className="form-label">
                      Fallback Destination
                    </label>
                    <input
                      id="fallback-input"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Human NOC Tier-2 Queue"
                      value={fallbackDestination}
                      onChange={(e) => setFallbackDestination(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="rule-description-input" className="form-label">
                    Route Description &amp; Gateway Notes
                  </label>
                  <textarea
                    id="rule-description-input"
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe inbound carrier routing triggers, time-of-day policies, or failover conditions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-action-subtle"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingRule(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-action-primary">
                  {editingRule ? 'Save Changes' : 'Deploy Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
