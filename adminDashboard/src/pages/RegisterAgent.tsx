import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  Save,
  X,
  Radio,
  Webhook,
  Phone,
  Server,
} from 'lucide-react';
import sltLogo from '../assets/slt-logo.svg';

export type ChannelType = 'SIP' | 'API Webhook';

export interface NewAgentFormData {
  name: string;
  category: string;
  description: string;
  channelType: ChannelType;
  phoneTrunk?: string;
  carrierTrunk?: string;
  sipHost?: string;
  sipPort?: number;
  sipTransport?: string;
  codec?: string;
  baseUrl?: string;
  urlPath?: string;
  chatEndpoint?: string;
  httpMethod?: string;
  bearerToken?: string;
}

interface RegisterAgentProps {
  onBack: () => void;
  onSave?: (data: NewAgentFormData) => void;
}

export default function RegisterAgent({ onBack, onSave }: RegisterAgentProps) {
  // General Agent Details
  const [agentName, setAgentName] = useState('SLT Broadband Voice Assistant');
  const [category, setCategory] = useState('Broadband & Fiber Care');
  const [description, setDescription] = useState(
    'Handles fiber broadband optical power validation, automated line restarts, speed complaints, and billing triage for Colombo metropolitan loop.'
  );

  // Channel Selection: 'SIP' | 'API Webhook'
  const [channelType, setChannelType] = useState<ChannelType>('SIP');

  // SIP Ingress specific fields
  const [phoneTrunk, setPhoneTrunk] = useState('+94 11 200 4520');
  const [carrierTrunk, setCarrierTrunk] = useState('SLT Metro Core');
  const [sipHost, setSipHost] = useState('192.168.10.45');
  const [sipPort, setSipPort] = useState(5060);
  const [sipTransport, setSipTransport] = useState('TLS (Encrypted SIP)');
  const [codec, setCodec] = useState('Opus 48kHz HD');

  // API Webhook specific fields
  const [baseUrl] = useState('https://');
  const [urlPath, setUrlPath] = useState('api.slt.lk/orchestration/digital-lab/prod');
  const [chatEndpoint, setChatEndpoint] = useState('/v2/voice-gateway/interaction');
  const [bearerToken, setBearerToken] = useState('slt_sec_live_9941a87b3e8c704fa156bc823981');
  const [showToken, setShowToken] = useState(false);
  const [httpMethod, setHttpMethod] = useState('POST (JSON)');
  const [endpointVerified, setEndpointVerified] = useState(true);
  const [pingLoading, setPingLoading] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const descMax = 500;

  // Conditional Validation: Only validates fields for the SELECTED channel!
  const isAgentNameValid = agentName.trim().length > 0;
  const isSipValid =
    phoneTrunk.trim().length > 0 &&
    sipHost.trim().length > 0 &&
    Number(sipPort) > 0;
  const isWebhookValid =
    urlPath.trim().length > 0 &&
    chatEndpoint.trim().length > 0 &&
    bearerToken.trim().length > 0;

  const configValid = useMemo(() => {
    if (!isAgentNameValid) return false;
    return channelType === 'SIP' ? isSipValid : isWebhookValid;
  }, [isAgentNameValid, channelType, isSipValid, isWebhookValid]);

  const handlePing = () => {
    setPingLoading(true);
    setTimeout(() => {
      setPingLoading(false);
      setEndpointVerified(true);
    }, 1200);
  };

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!configValid) {
      return;
    }

    if (onSave) {
      onSave({
        name: agentName.trim() || 'SLT Broadband Voice Assistant',
        category,
        description,
        channelType,
        phoneTrunk:
          channelType === 'SIP'
            ? phoneTrunk.trim()
            : (chatEndpoint.trim() || 'API Webhook'),
        carrierTrunk: channelType === 'SIP' ? carrierTrunk : undefined,
        sipHost: channelType === 'SIP' ? sipHost.trim() : undefined,
        sipPort: channelType === 'SIP' ? Number(sipPort) || 5060 : undefined,
        sipTransport: channelType === 'SIP' ? sipTransport : undefined,
        codec: channelType === 'SIP' ? codec : undefined,
        baseUrl: channelType === 'API Webhook' ? baseUrl : undefined,
        urlPath: channelType === 'API Webhook' ? urlPath.trim() : undefined,
        chatEndpoint: channelType === 'API Webhook' ? chatEndpoint.trim() : undefined,
        httpMethod: channelType === 'API Webhook' ? httpMethod : undefined,
        bearerToken: channelType === 'API Webhook' ? bearerToken.trim() : undefined,
      });
    } else {
      onBack();
    }
  };

  return (
    <div className="register-page">
      {/* Breadcrumb */}
      <div className="register-breadcrumb">
        <button className="breadcrumb-back" onClick={onBack}>
          <ArrowLeft size={14} />
          Back to Agents
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">New Voice Pipeline</span>
      </div>

      {/* Page Header */}
      <div className="register-header">
        <div className="register-header-left">
          <img src={sltLogo} alt="SLT Mobitel" className="register-logo" />
          <div>
            <h1 className="register-title">Register Chat Agent &amp; Voice Pipeline</h1>
            <p className="register-subtitle">
              Attach Speech-to-Text (STT) and Text-to-Speech (TTS) layers to your telephony SIP trunk or API chatbot webhook.
            </p>
          </div>
        </div>
        <div className="register-header-actions">
          <button className="btn-cancel" onClick={onBack}>
            <X size={14} />
            Cancel
          </button>
          <button className="btn-save-draft">
            <Save size={14} />
            Save Draft
          </button>
          <button className="btn-save-open" onClick={handleSave}>
            <CheckCircle2 size={14} />
            Save &amp; Deploy
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className="register-form-body">

        {/* Section 1: Agent Details */}
        <div className="register-section">
          <div className="register-section-header">
            <div className="register-section-num">1</div>
            <div>
              <h2 className="register-section-title">Agent Details</h2>
              <p className="register-section-desc">Basic identification and telco routing category</p>
            </div>
          </div>

          <div className="register-section-content">
            <div className="form-group">
              <label className="form-label">
                Agent Name <span className="required">*</span>
              </label>
              <input
                id="agent-name"
                type="text"
                className={`form-input ${submitAttempted && !isAgentNameValid ? 'has-error' : ''}`}
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. SLT Broadband Voice Assistant"
              />
              {submitAttempted && !isAgentNameValid && (
                <span className="form-error-text">Agent name is required.</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="agent-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Broadband & Fiber Care">Broadband &amp; Fiber Care</option>
                    <option value="Billing & Top-up Gateway">Billing &amp; Top-up Gateway</option>
                    <option value="PeoTV / Media Support">PeoTV / Media Support</option>
                    <option value="Corporate & Enterprise Lines">Corporate &amp; Enterprise Lines</option>
                    <option value="Mobile 5G & Telephony">Mobile 5G &amp; Telephony</option>
                    <option value="Healthcare & eChannelling">Healthcare &amp; eChannelling</option>
                    <option value="General Telco Inquiries">General Telco Inquiries</option>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description / Operational Notes
                <span className="char-count">{description.length} / {descMax}</span>
              </label>
              <textarea
                id="agent-description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, descMax))}
                rows={3}
                placeholder="Describe the agent's purpose, region, and operational scope..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Channel Ingress & Endpoint Configuration */}
        <div className="register-section">
          <div className="register-section-header">
            <div className="register-section-num">2</div>
            <div>
              <h2 className="register-section-title">
                {channelType === 'SIP' ? 'SIP Telephony Endpoint' : 'Chatbot Webhook Endpoint'}
              </h2>
              <p className="register-section-desc">
                {channelType === 'SIP'
                  ? 'Carrier SBC signaling endpoint, DID trunk line, and audio codec parameters'
                  : 'Downstream HTTP REST API for conversational turns and webhook callbacks'}
              </p>
            </div>
            <div className="section-status-group">
              {channelType === 'API Webhook' ? (
                <>
                  {endpointVerified && (
                    <span className="verified-badge">
                      <CheckCircle2 size={12} />
                      Verified 200 OK
                    </span>
                  )}
                  <button
                    className={`btn-ping ${pingLoading ? 'loading' : ''}`}
                    onClick={handlePing}
                    type="button"
                  >
                    <RefreshCw size={13} className={pingLoading ? 'spin' : ''} />
                    Ping
                  </button>
                </>
              ) : (
                <span className="verified-badge verified-badge-sip">
                  <CheckCircle2 size={12} />
                  Nominal SIP Carrier Trunk
                </span>
              )}
            </div>
          </div>

          <div className="register-section-content">
            {/* Channel Selection Toggle */}
            <div className="form-group mb-2">
              <label className="form-label">
                Ingress Channel Type <span className="required">*</span>
              </label>
              <div className="type-toggle-group">
                <button
                  type="button"
                  id="toggle-channel-sip"
                  className={`type-toggle-btn ${channelType === 'SIP' ? 'active' : ''}`}
                  onClick={() => setChannelType('SIP')}
                >
                  <Radio size={18} />
                  <div className="type-toggle-text">
                    <span className="type-toggle-title">SIP Ingress Endpoint</span>
                    <span className="type-toggle-desc">
                      Carrier SBC direct DID line &amp; telephony SIP signaling
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  id="toggle-channel-api"
                  className={`type-toggle-btn ${channelType === 'API Webhook' ? 'active' : ''}`}
                  onClick={() => setChannelType('API Webhook')}
                >
                  <Webhook size={18} />
                  <div className="type-toggle-text">
                    <span className="type-toggle-title">API Webhook Endpoint</span>
                    <span className="type-toggle-desc">
                      HTTP REST conversational turns &amp; webhook payload callback
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Conditional Channel Configuration: SIP Mode */}
            {channelType === 'SIP' ? (
              <div className="channel-config-container animate-fade-in">
                <div className="config-banner sip-banner">
                  <Phone size={15} />
                  <span>
                    <strong>SIP Independent Mode:</strong> Telephony routing is enabled via direct SIP signaling. API Webhook fields are not required and will not block deployment.
                  </span>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">
                      Direct Ingress Phone / DID Trunk <span className="required">*</span>
                    </label>
                    <input
                      id="agent-phone"
                      type="text"
                      className={`form-input font-mono ${
                        submitAttempted && !phoneTrunk.trim() ? 'has-error' : ''
                      }`}
                      value={phoneTrunk}
                      onChange={(e) => setPhoneTrunk(e.target.value)}
                      placeholder="+94 11 200 4520"
                    />
                    {submitAttempted && !phoneTrunk.trim() && (
                      <span className="form-error-text">Phone trunk is required for SIP channels.</span>
                    )}
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">
                      Carrier Trunk Group <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="agent-carrier"
                        className="form-select"
                        value={carrierTrunk}
                        onChange={(e) => setCarrierTrunk(e.target.value)}
                      >
                        <option value="SLT Metro Core">SLT Metro Core</option>
                        <option value="Mobitel LTE / IMS">Mobitel LTE / IMS</option>
                        <option value="Colombo Billing Core">Colombo Billing Core</option>
                        <option value="Enterprise SIP LK">Enterprise SIP LK</option>
                        <option value="Disaster Recovery">Disaster Recovery</option>
                      </select>
                      <ChevronDown size={14} className="select-icon" />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-2">
                    <label className="form-label">
                      SIP Signaling Host / SBC IP <span className="required">*</span>
                    </label>
                    <input
                      id="agent-sip-host"
                      type="text"
                      className={`form-input font-mono ${
                        submitAttempted && !sipHost.trim() ? 'has-error' : ''
                      }`}
                      value={sipHost}
                      onChange={(e) => setSipHost(e.target.value)}
                      placeholder="e.g. 192.168.10.45 or sbc.voice.slt.lk"
                    />
                    {submitAttempted && !sipHost.trim() && (
                      <span className="form-error-text">SIP host IP or FQDN is required.</span>
                    )}
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">
                      Signaling Port <span className="required">*</span>
                    </label>
                    <input
                      id="agent-sip-port"
                      type="number"
                      className="form-input font-mono"
                      value={sipPort}
                      onChange={(e) => setSipPort(Number(e.target.value))}
                      placeholder="5060"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">
                      Signaling Transport Protocol
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="agent-sip-transport"
                        className="form-select"
                        value={sipTransport}
                        onChange={(e) => setSipTransport(e.target.value)}
                      >
                        <option value="TLS (Encrypted SIP)">TLS (Encrypted SIP)</option>
                        <option value="UDP (Standard Telephony)">UDP (Standard Telephony)</option>
                        <option value="TCP">TCP</option>
                      </select>
                      <ChevronDown size={14} className="select-icon" />
                    </div>
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">
                      Speech / Media Codec
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="agent-codec"
                        className="form-select"
                        value={codec}
                        onChange={(e) => setCodec(e.target.value)}
                      >
                        <option value="Opus 48kHz HD">Opus 48kHz HD (Recommended)</option>
                        <option value="AMR-WB 16kHz">AMR-WB 16kHz (Mobitel VoLTE)</option>
                        <option value="G.711a A-law">G.711a A-law (PSTN Standard)</option>
                        <option value="G.729">G.729 (Low Bandwidth)</option>
                      </select>
                      <ChevronDown size={14} className="select-icon" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Conditional Channel Configuration: API Webhook Mode */
              <div className="channel-config-container animate-fade-in">
                <div className="config-banner api-banner">
                  <Server size={15} />
                  <span>
                    <strong>API Webhook Mode:</strong> Conversational turns connect over HTTP REST endpoints. SIP Trunk configuration is not required and will not block deployment.
                  </span>
                </div>

                <div className="form-row">
                  <div className="form-group flex-2">
                    <label className="form-label">
                      Base URL <span className="required">*</span>
                    </label>
                    <div className="url-input-group">
                      <span className="url-prefix">{baseUrl}</span>
                      <input
                        id="base-url"
                        type="text"
                        className={`form-input url-path ${
                          submitAttempted && !urlPath.trim() ? 'has-error' : ''
                        }`}
                        value={urlPath}
                        onChange={(e) => setUrlPath(e.target.value)}
                        placeholder="api.slt.lk/path"
                      />
                    </div>
                    {submitAttempted && !urlPath.trim() && (
                      <span className="form-error-text">Base URL is required for API Webhooks.</span>
                    )}
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">
                      HTTP Method <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="http-method"
                        className="form-select"
                        value={httpMethod}
                        onChange={(e) => setHttpMethod(e.target.value)}
                      >
                        <option>POST (JSON)</option>
                        <option>POST (Form)</option>
                        <option>GET</option>
                        <option>PUT (JSON)</option>
                      </select>
                      <ChevronDown size={14} className="select-icon" />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">
                      Chat Endpoint Path <span className="required">*</span>
                    </label>
                    <input
                      id="chat-endpoint"
                      type="text"
                      className={`form-input font-mono ${
                        submitAttempted && !chatEndpoint.trim() ? 'has-error' : ''
                      }`}
                      value={chatEndpoint}
                      onChange={(e) => setChatEndpoint(e.target.value)}
                      placeholder="/v2/voice-gateway/interaction"
                    />
                    {submitAttempted && !chatEndpoint.trim() && (
                      <span className="form-error-text">Chat endpoint path is required.</span>
                    )}
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">
                      Bearer Token / API Key <span className="required">*</span>
                    </label>
                    <div className="token-input-group">
                      <input
                        id="bearer-token"
                        type={showToken ? 'text' : 'password'}
                        className={`form-input font-mono token-input ${
                          submitAttempted && !bearerToken.trim() ? 'has-error' : ''
                        }`}
                        value={bearerToken}
                        onChange={(e) => setBearerToken(e.target.value)}
                        placeholder="slt_sec_live_..."
                      />
                      <button
                        className="token-toggle"
                        onClick={() => setShowToken(!showToken)}
                        title={showToken ? 'Hide token' : 'Show token'}
                        type="button"
                      >
                        {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        className="token-regen"
                        title="Regenerate token"
                        type="button"
                        onClick={() =>
                          setBearerToken(
                            `slt_sec_live_${Math.random().toString(36).substring(2, 14)}`
                          )
                        }
                      >
                        <RefreshCw size={13} />
                      </button>
                    </div>
                    {submitAttempted && !bearerToken.trim() && (
                      <span className="form-error-text">Bearer token or API key is required.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Action Bar */}
      <div className="register-footer">
        <div className={`config-status ${configValid ? 'valid' : 'invalid'}`}>
          <span className={`config-dot ${configValid ? 'valid' : 'invalid'}`} />
          {configValid
            ? `Configuration valid and ready to deploy as ${channelType === 'SIP' ? 'SIP Ingress' : 'API Webhook'}`
            : `Incomplete configuration - fill required ${channelType === 'SIP' ? 'SIP' : 'API Webhook'} fields`}
        </div>
        <div className="register-footer-actions">
          <button className="btn-discard" onClick={onBack} type="button">
            Discard Changes
          </button>
          <button className="btn-save-draft" type="button">
            <Save size={14} />
            Save Draft
          </button>
          <button className="btn-save-open large" onClick={handleSave} type="button">
            <CheckCircle2 size={14} />
            Save &amp; Deploy
          </button>
        </div>
      </div>
    </div>
  );
}
