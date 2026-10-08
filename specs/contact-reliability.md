# Recoverable contact inquiries

## Problem

The current form makes one email attempt, stores no inquiry or delivery identifier, and can show success without notification when the hidden spam field is filled. The guest's reported missing request is not recovered and its cause is unproven. Improve future handling without claiming that incident is diagnosed.

## Scope and acceptance

1. Legitimate requests must be durably saved before any email attempt. Persistence failure gives actionable failure feedback and preserves the guest's draft. Never use serverless local disk for persistence.
2. The proposed adapter uses Upstash Redis, the older site's existing storage integration, with a separate contact namespace and 30-day expiry. Do not alter gallery keys. No Supabase integration was found in either repository; an externally provisioned project remains possible. Final service selection needs owner confirmation. The legacy Redis endpoint failed a read-only DNS check; reuse/current availability, capacity and non-evicting configuration remain unverified.
3. Validate required storage and mail configuration explicitly, require a custom-domain sender rather than resend.dev, and default new intake to disabled until the owner completes setup. Preview activation requires isolated sandbox credentials; production configuration/DNS changes are not part of this PR.
4. Use an atomic durable record/idempotency check for repeated and concurrent submissions. Identical retries reuse the same reference and immutable notification envelope; a reused key with changed content returns conflict without disclosing stored content. Browser double submissions cannot start a second operation.
5. Keep provider ID, bounded attempt count and status. Provider acceptance is not inbox delivery. Use the same provider idempotency key/payload across bounded transient retries. Stop automatic notification attempts before Resend's 24-hour deduplication window expires; ambiguous old outcomes require operator review. Maximum three notification attempts, at most two in one visitor request.
6. Provide credential-protected operator recovery through a local CLI, not an unauthenticated web list or complex dashboard. List summaries and inspect individual inquiries; explicit retry uses the same bounded/idempotent path. No scheduled service or new subscription.
7. Reject malformed/non-object bodies, overlong fields, header control characters and bad email values; limit body size while reading it. Hidden spam field rejection must not pretend legitimate acceptance. Enforce same-origin browser submissions and persistent per-client/global quotas for new inquiries. Do not store raw client IPs or log inquiry bodies, addresses or secrets.
8. Return accessible success, partial-notification and failure messages, with reference numbers only after durable acceptance. Preserve drafts and a stable idempotency token across uncertain browser responses/reloads where session storage works. Stale client tokens must not recreate expired records and duplicate notifications. Editing a draft after uncertain acceptance must not silently rotate the reference; offer retry of the original draft or direct contact. Time out hung browser requests without implying rejection; preserve the token for safe retry.
9. Fix the confirmed broken Playwright setup (Vercel adapter does not support astro preview) so the normal full test command can exercise built static pages with contact requests mocked. Preserve the published 307 address and existing map pins, pricing/capacity and booking behavior.

## Verification

Test seams are the public contact POST/browser behavior, Redis REST persistence boundary and email provider boundary, as authorized in the request. Use a disposable local Redis for actual Lua atomicity and a local REST bridge; mock email delivery. Verify persistence/provider failures, concurrency, repeated/conflicting submissions, malformed/spam inputs, config failure, retry cutoff and success. No production storage writes, form submissions, live email/SMS or denied-access retries. Focused/type/build/full checks apply to final reviewed head; distinguish host build from test-suite verification.

## Setup decisions and exclusions

No new service account, credentials, grants, fees, production env/DNS/configuration, merge or production deployment. Owner must identify and approve the intended storage service (including any existing Supabase project), configure the v2 project, verify custom sender/recipient, and approve activation/deployment separately. The existing Vercel403 and Resend send-only log limits remain. Retention is a deliberate 30-day limit; pending inquiries must be reviewed before expiry, with no claim of indefinite storage or inbox delivery. An automated scheduler, public/admin dashboard, delivery webhook, other feature work and recovering an expired/unrecorded historical inquiry are out of scope.
