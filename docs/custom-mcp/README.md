# Module: Building a Custom MCP Server

**Duration:** ~75 minutes  
**Level:** Advanced  
**Prerequisite:** Module 2 (Code Review with GitHub MCP) — you should already know what MCP is and have configured at least one server.

---

## What you will practise

- Building a TypeScript MCP server from scratch using `@modelcontextprotocol/sdk`
- Defining tools with Zod schemas that Claude can discover and call at runtime
- Connecting a local MCP server to real AWS data (DynamoDB + S3)
- Moving from a personal configuration to a project-level team setup

---

## Exercises

1. [Exercise 1: Scaffold a Local MCP Server](exercises/exercise-1-scaffold-server.md)
2. [Exercise 2: Connect to AWS](exercises/exercise-2-connect-to-aws.md)
3. [Exercise 3: Make It Team-Ready](exercises/exercise-3-team-adoption.md)

Or follow the [Participant Guide](participant-guide.md) for the full walkthrough.

---

## Prerequisites

- Module 2 complete
- Node.js 20+ (`node --version`)
- AWS CLI installed and configured: `aws sts get-caller-identity` returns valid JSON
- Permissions to create DynamoDB tables and S3 buckets in your AWS account
- TypeScript familiarity — you will write and compile TypeScript code
