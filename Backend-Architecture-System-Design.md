# Flipkart-like Backend Architecture & System Design

**Version:** 0.1.0  
**Date:** 2026-02-25  
**Owners:** Backend Platform, SRE, Security, Data Platform  
**Status:** Draft  
**Scope:** End-to-end backend architecture, contracts, data/event topology, and operations for a Flipkart-like commerce platform.  
**Out of scope:** Frontend UX specs, vendor lock-in decisions, sprint-level implementation tasks.

---

## 1) How to use this document

### 1.1 Source-of-truth hierarchy
1. Runtime contracts (APIs, protobufs, event schemas)
2. Diagrams
3. Prose sections
4. Slides/chats/notes

### 1.2 Change log
| Date | Version | Change | Owner |
|---|---|---|---|
| 2026-02-25 | 0.1.0 | Initial backend structure blueprint and templates | Platform Architecture |

### 1.3 Diagram index
- C4 L1 Context
- C4 L2 Container
- C4 L3 Component(s) by domain
- Deployment & traffic entry
- Event topology (Kafka)
- Security/trust boundaries
- Critical flows (sequence diagrams)

---

## 2) Goals, constraints, and NFR baseline

### 2.1 Product and platform goals
- Support omnichannel commerce (web/mobile/seller/partners).
- Enable high-scale seasonal traffic with predictable reliability.
- Preserve correctness for money, inventory, and order lifecycle.

### 2.2 NFRs (SLO-driven)
- **Availability SLOs:** per tier (gateway, checkout, payment, order).
- **Latency SLOs:** p50/p95/p99 by API and async processing.
- **Consistency guarantees:** strong vs eventual by workflow boundary.
- **Scale targets:** sustained and peak QPS/events/s.
- **Error budget policy:** monthly budget, freeze criteria, release gating.

> Guideline: every critical service must declare one user-facing SLI + one operator SLI.

---

## 3) Architecture view set (C4 + operational views)

### 3.1 C4 Context (L1)
**Purpose:** External actors and systems; platform boundary.

### 3.2 C4 Container (L2)
**Purpose:** API gateway/BFF, domain services, event bus, storage classes.

### 3.3 C4 Component (L3)
**Purpose:** Per-domain internals (e.g., checkout orchestrator, payment adapters).

### 3.4 Mandatory non-C4 operational views
- Deployment + ingress + mesh routing
- Progressive delivery (canary/blue-green)
- Data view (SoR/cache/search/vector)
- Event topology (topics/partitions/retention/schema)
- Security view (trust boundaries, identity, secrets, encryption)

### 3.5 Diagram governance rules
- Stable IDs (e.g., `order-svc`, `payment.authorized.v1`).
- One shared legend.
- Diagrams generated from this doc; avoid drifted side copies.

---

## 4) Domain map and service boundaries

### 4.1 Bounded contexts
- Identity & Access
- Customer Profile
- Catalog
- Discovery
- Cart & Checkout
- Orders
- Inventory
- Payments & Wallet/Loyalty
- Fulfillment & Logistics
- Seller/Marketplace
- Notifications
- Support & Refunds

### 4.2 Dependency policy
- Prefer async domain integration over synchronous cross-domain chaining.
- Synchronous calls only for hard real-time interactions.
- No shared database across domains.

### 4.3 Service ownership model
For each service define:
- Product owner
- Engineering owner
- On-call rotation
- Escalation channel

---

## 5) Service catalogue template (one page per service)

Copy this section for each microservice.

```text
Service Name:
Domain:
Owners:
Tier: Critical / High / Standard

Purpose:
Owned data (authoritative):
Read models / caches:

Public APIs:
Internal APIs (gRPC):
Published events:
Consumed events:

Dependencies (sync):
Dependencies (async):

Consistency contract:
Idempotency contract:

SLOs:
- Availability:
- Latency:
- Freshness/lag:
Error budget policy:

Scaling signals:
- QPS/RPS:
- Kafka lag:
- CPU/memory:

Failure modes & mitigations:
Runbook links:
Dashboards:
Alerts:
```

---

## 6) Data architecture (system of record and derived stores)

### 6.1 Store classification
- **System of Record (ACID SQL):** Orders, payments ledger, inventory core.
- **Low-latency KV/cache:** sessions, hot catalog, cart, rate limits.
- **Search index:** text/filter retrieval.
- **Vector index:** semantic retrieval/AI ranking.
- **Analytics/feature stores:** offline model and BI pipelines.

### 6.2 Data contracts to document
- Primary keys and partition keys
- Retention, archival, and deletion (regulatory + product)
- Replication and failover per store
- RPO/RTO expectations per domain

### 6.3 Transaction boundary standard
- ACID within service boundary.
- Cross-service consistency via saga/events.

---

## 7) Eventing and streaming standard

### 7.1 Topic governance
- Naming: `<domain>.<entity>.<event>.v<version>`
- Partition key: business key preserving required order
- Retention tier by use case (operational vs audit vs replay)

### 7.2 Producer/consumer contracts
- Schema Registry mandatory for versioned events.
- Compatibility mode defined per topic family.
- Consumer group ownership explicitly documented.

### 7.3 Outbox standard (required)
- Domain state update + outbox row in one DB transaction.
- Publisher/CDC relays outbox to Kafka.
- Retry + dedup + poison-message handling policy.

### 7.4 Delivery semantics wording standard
Use: **“at-least-once delivery + idempotent consumers + outbox = effectively-once business effect.”**

---

## 8) API and integration architecture

### 8.1 North-south (external)
- API Gateway + BFF per client type (mobile/web/seller/partner).
- Policies: authN/authZ, rate limiting, bot control, input validation.

### 8.2 East-west (internal)
- Default: gRPC for low-latency service-to-service RPC.
- Timeouts, retries, and circuit-breaker defaults centrally defined.

### 8.3 API governance
- Versioning policy
- Error model (codes, retriable flags)
- Idempotency key requirements for write APIs

---

## 9) Critical business flow template

Use this template for Checkout, Returns/Refunds, Inventory reservation, Hyperlocal assignment, Seller payout.

```text
Flow Name:
Business goal:
Trigger:
Preconditions:
Invariants:

Step-by-step path:
- Sync steps:
- Async steps:

Compensation strategy:
Idempotency/dedup rules:
Failure injection points:

Observability:
- Key spans:
- Key metrics:
- Key logs:

SLO impact:
Runbook:
```

---

## 10) Security and compliance controls

### 10.1 Identity and access
- OAuth2/OIDC/JWT model
- Token lifetime + refresh + revocation strategy
- Service-to-service identity (mTLS/workload identity)

### 10.2 Data protection
- Encryption in transit and at rest
- Secret management and rotation
- PII/PCI classification and masking/redaction rules

### 10.3 Threat modeling and risk mapping
- Login/account takeover
- Checkout/payment abuse
- Refund fraud
- Seller payout manipulation

### 10.4 Compliance boundary notes
- Payment card scope and segmentation
- Audit logging and evidencing
- Data residency and deletion rights

---

## 11) Operations and SRE readiness

### 11.1 Autoscaling policies
- API tier: RPS + latency + saturation
- Consumers: lag + processing latency
- Search/reco: queue depth + CPU/memory

### 11.2 Progressive delivery
- Canary steps, bake times, promotion/rollback gates
- Blue-green switch criteria
- DB migration strategy (expand/contract)

### 11.3 Observability standard
- Golden signals per service tier
- Trace propagation across async boundaries
- Log correlation IDs and redaction policy

### 11.4 Incident response and DR
- Severity model and escalation tree
- Service runbook minimum bar
- DR tests cadence and acceptance criteria

---

## 12) Review and governance cadence

- **Architecture Review Board:** weekly for ADRs and interface changes.
- **Operational Readiness Review:** mandatory before production launch.
- **Quarterly reliability review:** SLO performance and error budget spend.

### 12.1 ADR index
Track architecture decision records with status and supersession links.

---

## 13) Appendices

### Appendix A: Backend doc checklist
- [ ] Every service has a filled catalogue page
- [ ] Every critical flow has sequence + compensation definition
- [ ] Event topics have schema/version/owner/retention
- [ ] SLOs and alerting exist for all tier-1 services
- [ ] Security controls mapped to threat model

### Appendix B: Starter skeleton (Notion/Confluence copy)
```text
Title: Flipkart-like Backend Architecture (v___.__)
Date:
Owners:
Scope:
Out of scope:
Status: Draft / In Review / Approved

Change log
- yyyy-mm-dd: ...

Diagram Index
- Context (C4 L1): ...
- Container (C4 L2): ...
- Component (C4 L3): ...
- Deployment: ...
- Event Topology: ...
- Security/Trust Boundaries: ...
- Critical Flows (Sequence): ...

Goals & NFRs (SLO-driven)
Domain Map + Service Catalogue
Data Architecture
Eventing & Streaming
API Design
Critical Business Flows
Security & Compliance
Operations
Appendices
```
