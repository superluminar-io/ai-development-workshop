#!/usr/bin/env bash
set -euo pipefail

# Creates the AWS resources used in the custom-mcp module:
#   - DynamoDB tables: apex-services, apex-deployments
#   - S3 bucket: apex-runbooks-<account-id>
#
# Prerequisites:
#   - AWS CLI configured with credentials
#   - Permissions: dynamodb:CreateTable, dynamodb:PutItem, s3:CreateBucket, s3:PutObject
#
# To clean up after the workshop, run:
#   aws dynamodb delete-table --table-name apex-services --region <region>
#   aws dynamodb delete-table --table-name apex-deployments --region <region>
#   aws s3 rb s3://apex-runbooks-<account-id> --force --region <region>

REGION="${AWS_DEFAULT_REGION:-eu-central-1}"
echo "Region: ${REGION}"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --region "$REGION")
echo "Account ID: ${ACCOUNT_ID}"

BUCKET="apex-runbooks-${ACCOUNT_ID}"
SERVICES_TABLE="apex-services"
DEPLOYMENTS_TABLE="apex-deployments"

# Cross-platform date arithmetic (macOS BSD date + Linux GNU date)
hours_ago() {
  local h=$1
  if date --version >/dev/null 2>&1; then
    date -u -d "${h} hours ago" +"%Y-%m-%dT%H:%M:%SZ"
  else
    date -u -v-${h}H +"%Y-%m-%dT%H:%M:%SZ"
  fi
}
days_ago() {
  local d=$1
  if date --version >/dev/null 2>&1; then
    date -u -d "${d} days ago" +"%Y-%m-%dT%H:%M:%SZ"
  else
    date -u -v-${d}d +"%Y-%m-%dT%H:%M:%SZ"
  fi
}

# ---------- DynamoDB tables ----------

echo ""
echo "Creating DynamoDB tables..."

if ! aws dynamodb describe-table --table-name "$SERVICES_TABLE" --region "$REGION" >/dev/null 2>&1; then
  aws dynamodb create-table \
    --table-name "$SERVICES_TABLE" \
    --attribute-definitions AttributeName=name,AttributeType=S \
    --key-schema AttributeName=name,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region "$REGION" >/dev/null
  echo "  Waiting for ${SERVICES_TABLE} to become ACTIVE..."
  aws dynamodb wait table-exists --table-name "$SERVICES_TABLE" --region "$REGION"
else
  echo "  ${SERVICES_TABLE} already exists."
fi

if ! aws dynamodb describe-table --table-name "$DEPLOYMENTS_TABLE" --region "$REGION" >/dev/null 2>&1; then
  aws dynamodb create-table \
    --table-name "$DEPLOYMENTS_TABLE" \
    --attribute-definitions \
      AttributeName=service,AttributeType=S \
      AttributeName=deployed_at,AttributeType=S \
    --key-schema \
      AttributeName=service,KeyType=HASH \
      AttributeName=deployed_at,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --region "$REGION" >/dev/null
  echo "  Waiting for ${DEPLOYMENTS_TABLE} to become ACTIVE..."
  aws dynamodb wait table-exists --table-name "$DEPLOYMENTS_TABLE" --region "$REGION"
else
  echo "  ${DEPLOYMENTS_TABLE} already exists."
fi

# ---------- Services ----------

echo ""
echo "Seeding service catalog..."

put_service() {
  local name="$1" team="$2" owner="$3" sla="$4" status="$5" on_call="$6"
  aws dynamodb put-item \
    --table-name "$SERVICES_TABLE" \
    --region "$REGION" \
    --item "{\"name\":{\"S\":\"${name}\"},\"team\":{\"S\":\"${team}\"},\"owner\":{\"S\":\"${owner}\"},\"sla\":{\"S\":\"${sla}\"},\"health_status\":{\"S\":\"${status}\"},\"on_call\":{\"S\":\"${on_call}\"}}"
  echo "  ${name} (${status})"
}

put_service "payments-api"         "payments"   "alice@apex.io" "99.99%" "healthy"  "alice@apex.io"
put_service "auth-service"         "platform"   "bob@apex.io"   "99.9%"  "healthy"  "bob@apex.io"
put_service "notification-service" "platform"   "carol@apex.io" "99.5%"  "degraded" "carol@apex.io"
put_service "orders-api"           "orders"     "dave@apex.io"  "99.9%"  "healthy"  "dave@apex.io"
put_service "inventory-service"    "operations" "eve@apex.io"   "99.5%"  "healthy"  "eve@apex.io"

# ---------- Deployments ----------

echo ""
echo "Seeding deployment history..."

put_deployment() {
  local service="$1" at="$2" version="$3" by="$4" sha="$5" summary="$6"
  aws dynamodb put-item \
    --table-name "$DEPLOYMENTS_TABLE" \
    --region "$REGION" \
    --item "{\"service\":{\"S\":\"${service}\"},\"deployed_at\":{\"S\":\"${at}\"},\"version\":{\"S\":\"${version}\"},\"deployed_by\":{\"S\":\"${by}\"},\"commit_sha\":{\"S\":\"${sha}\"},\"change_summary\":{\"S\":\"${summary}\"}}"
}

# notification-service: recent deployment is the planted cause of degradation
put_deployment "notification-service" "$(hours_ago 3)"  "v1.4.0" "carol@apex.io" "a3f82c1" "feat: add email template versioning"
put_deployment "notification-service" "$(days_ago 7)"   "v1.3.9" "carol@apex.io" "9c21d4e" "fix: retry logic for bounced emails"

put_deployment "payments-api" "$(days_ago 2)"  "v2.1.4" "alice@apex.io" "f1a9b2c" "fix: handle timeout on bank API retries"
put_deployment "payments-api" "$(days_ago 5)"  "v2.1.3" "alice@apex.io" "b84ef3d" "feat: add payment analytics events"
put_deployment "payments-api" "$(days_ago 12)" "v2.1.2" "alice@apex.io" "7c30a1f" "fix: improve idempotency key generation"

put_deployment "auth-service" "$(days_ago 1)" "v3.0.1" "bob@apex.io" "d2e9c7a" "chore: upgrade JWT library to v9"
put_deployment "auth-service" "$(days_ago 8)" "v3.0.0" "bob@apex.io" "e5f1a2b" "feat: migrate to new Redis cluster"

put_deployment "orders-api" "$(days_ago 4)"  "v4.2.1" "dave@apex.io" "c8d3b4e" "fix: retry webhook delivery on 408 timeout"
put_deployment "orders-api" "$(days_ago 10)" "v4.2.0" "dave@apex.io" "a1b5c6f" "feat: add order analytics dashboard"

put_deployment "inventory-service" "$(hours_ago 6)" "v2.0.3" "eve@apex.io" "f4c2e9a" "fix: reduce full table scan in low-stock check"
put_deployment "inventory-service" "$(days_ago 3)" "v2.0.2" "eve@apex.io" "b3d1a7c" "chore: upgrade AWS SDK"
put_deployment "inventory-service" "$(days_ago 9)" "v2.0.1" "eve@apex.io" "e7f8b2d" "feat: add warehouse event filtering"

echo "  Done."

# ---------- S3 bucket ----------

echo ""
echo "Creating S3 bucket: ${BUCKET}..."

if ! aws s3api head-bucket --bucket "$BUCKET" --region "$REGION" >/dev/null 2>&1; then
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" >/dev/null
  else
    aws s3api create-bucket \
      --bucket "$BUCKET" \
      --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION" >/dev/null
  fi
  echo "  Created."
else
  echo "  Already exists."
fi

# ---------- Runbooks ----------

echo ""
echo "Uploading runbooks..."

s3_put() {
  local service="$1"
  aws s3 cp - "s3://${BUCKET}/${service}.md" \
    --content-type "text/markdown" \
    --region "$REGION" >/dev/null
  echo "  ${service}.md"
}

cat << 'EOF' | s3_put "payments-api"
# Payments API Runbook

## Common failure modes

### Payment timeouts
**Symptom:** 5xx errors or increased latency on `/api/payments`
**Cause:** Downstream bank API outage or database connection pool exhaustion.
**Steps:**
1. Check CloudWatch metrics: `PaymentsAPI/ProcessingTime` and `PaymentsAPI/ErrorRate`
2. Check RDS connection count — if > 80%, restart the connection pool via Systems Manager
3. Check the bank API status page

### Duplicate charges
**Symptom:** Customer reports a double charge; duplicate entries in `payment_events` DynamoDB table
**Cause:** Idempotency key collision or retry storm from the front-end
**Steps:**
1. Do NOT restart the service — it will trigger more retries
2. Check `payment_events` for duplicate `transaction_id` entries
3. Page the payments team lead immediately — SLA is 30 minutes to initial response

## Escalation
- L1: on-call engineer (alice@apex.io)
- L2: payments team lead (PagerDuty rotation)
- L3: VP Engineering (business-critical incidents only)

## SLA
99.99% uptime. Maximum allowed downtime: 52 minutes/year.
EOF

cat << 'EOF' | s3_put "notification-service"
# Notification Service Runbook

## Current status
This service is currently showing DEGRADED status. If a deployment occurred in the last 24 hours, roll it back first before investigating further.

## Common failure modes

### Degradation after a deployment
**Symptom:** Email delivery rate drops; service health status shows degraded; `notification_queue` SQS depth rising
**Cause:** A recent deployment likely introduced a regression in the template rendering pipeline.
**Steps:**
1. Check deployment history — if anything was deployed in the last 24 hours, roll it back immediately
2. To roll back: trigger the previous version in the deployment dashboard or via the CI/CD pipeline
3. If no recent deployment: check SES bounce rate in the AWS SES console (Services > SES > Sending Statistics)
4. If bounce rate > 5%: pause sending and page carol@apex.io

### Notification backlog (no recent deployment)
**Symptom:** Users report delayed notifications (> 5 minutes)
**Cause:** Lambda concurrency limit hit during a traffic spike
**Steps:**
1. Check Lambda concurrency: CloudWatch > Lambda > notification-processor > ConcurrentExecutions
2. Increase reserved concurrency in the Lambda console
3. Check `notification-dlq` in the SQS console for failed messages

## Escalation
- L1: carol@apex.io (on-call)
- L2: platform team lead

## SLA
99.5% uptime. Brief delays are acceptable; complete delivery failure is not.
EOF

cat << 'EOF' | s3_put "auth-service"
# Auth Service Runbook

## Common failure modes

### Token validation failures
**Symptom:** 401 errors across multiple services; auth-service error rate spike
**Cause:** JWT signing key rotation failure or Redis cache miss storm
**Steps:**
1. Check auth-service error rate in CloudWatch
2. Check ElastiCache (Redis) cluster health — if degraded, token validation falls back to the database
3. Database fallback is slow but correct — the service will recover when Redis is healthy
4. Page bob@apex.io if error rate exceeds 1%

### Session invalidation delay
**Symptom:** Users can still access resources after logout
**Cause:** Redis cache inconsistency
**Steps:**
1. Check Redis cluster status
2. Force cache flush only with approval: `redis-cli FLUSHDB` (causes a brief login storm — coordinate first)

## Escalation
- L1: bob@apex.io (on-call)
- L2: Security team for any suspected breach

## SLA
99.9% uptime. Auth failures propagate to all services — treat any degradation as high priority.
EOF

cat << 'EOF' | s3_put "orders-api"
# Orders API Runbook

## Common failure modes

### Order creation failures
**Symptom:** 500 errors on `/api/orders`; customers cannot place orders
**Cause:** inventory-service dependency failure or database write timeout
**Steps:**
1. Check inventory-service health first — orders-api depends on it for stock validation
2. Check RDS write latency in CloudWatch
3. If inventory-service is down: restore it; orders will resume automatically

### Stuck orders
**Symptom:** Orders in PENDING state for > 5 minutes
**Cause:** Payment processor webhook not received
**Steps:**
1. Check `order_events` DynamoDB table for stuck records
2. Trigger payment status retry: `POST /admin/orders/{id}/retry`
3. Admin API key is in Secrets Manager: `prod/orders-api/admin-key`

## Escalation
- L1: dave@apex.io (on-call)
- L2: orders team lead

## SLA
99.9% uptime.
EOF

cat << 'EOF' | s3_put "inventory-service"
# Inventory Service Runbook

## Common failure modes

### Inventory count discrepancies
**Symptom:** Products show incorrect stock levels
**Cause:** Event processing lag from the warehouse system
**Steps:**
1. Check SQS queue depth: `warehouse-events` should be near zero
2. If the queue is backing up: check the inventory-processor Lambda for errors
3. Manual sync: `POST /admin/inventory/sync` (requires admin credentials)

### Service unavailable
**Symptom:** Other services receive 503 from inventory-service
**Cause:** High CPU from a full table scan or a cold start storm
**Steps:**
1. Check Lambda metrics for concurrency and duration
2. A scheduled reconciliation job runs at 02:00 UTC — elevated CPU at that time is normal
3. If cold start storm: increase reserved concurrency to 50 in the Lambda console

## Escalation
- L1: eve@apex.io (on-call)
- L2: operations team lead

## SLA
99.5% uptime.
EOF

# ---------- Summary ----------

echo ""
echo "========================================"
echo "Setup complete."
echo ""
echo "Resources in region ${REGION}:"
echo "  DynamoDB: ${SERVICES_TABLE}"
echo "  DynamoDB: ${DEPLOYMENTS_TABLE}"
echo "  S3 bucket: ${BUCKET}"
echo ""
echo "Add this to the env block of your .mcp.json:"
echo "  \"RUNBOOKS_BUCKET\": \"${BUCKET}\""
echo ""
echo "To clean up after the workshop:"
echo "  aws dynamodb delete-table --table-name ${SERVICES_TABLE} --region ${REGION}"
echo "  aws dynamodb delete-table --table-name ${DEPLOYMENTS_TABLE} --region ${REGION}"
echo "  aws s3 rb s3://${BUCKET} --force --region ${REGION}"
echo "========================================"
