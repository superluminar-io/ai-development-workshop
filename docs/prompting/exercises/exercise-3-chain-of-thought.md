# Exercise 3: Asking for Reasoning

**Goal:** See when asking for step-by-step reasoning changes a model's answer, and understand what chain-of-thought can and cannot guarantee.

**Duration:** ~15 minutes

---

## The scenario

You are reviewing job applications and you need Claude to assess a candidate against a job description. The match is deliberately ambiguous — close but not clear-cut. You will compare a direct question (zero-shot) with a reasoning-first approach (chain-of-thought).

Open a new Claude session.

---

## Step 1 — Zero-shot assessment (~3 min)

Copy the job description and candidate profile below into your session. Run this prompt:

```
Is this candidate a strong match for the role? Answer yes or no.
```

**Job description:**
> **Senior Backend Engineer — FinTech Platform**
>
> Requirements:
> - 5+ years of backend engineering experience
> - Strong proficiency in Go or Rust
> - Experience with distributed systems and microservices
> - Familiarity with financial regulations (PCI-DSS, SOC 2) preferred
> - Experience with Kubernetes and cloud-native deployments (AWS preferred)
> - Excellent communication skills — this role involves regular stakeholder presentations

**Candidate profile:**
> Jordan has 4 years of backend experience, primarily in Python and Node.js, with one year of Go. They led the migration of a monolith to microservices at their current company. Jordan has no formal experience with financial regulations but has read about PCI-DSS requirements. They are AWS Solutions Architect certified. They have not done formal stakeholder presentations but are described as "an excellent communicator" by their manager. No open source contributions.

Note the answer (yes or no) and whether Claude offered any explanation.

---

## Step 2 — Chain-of-thought assessment (~5 min)

**Start a new session.** Run this prompt with the same job description and candidate profile:

```
Is this candidate a strong match for the role? Go through each requirement one by one before giving your final answer.
```

Compare the two outputs:
- Did the yes/no answer change?
- Which output would you trust more to make a hiring decision, and why?

**Checkpoint:** Did Claude note that Jordan has only 4 years of experience against a 5-year requirement? Did it flag the difference between "has read about PCI-DSS" and "familiarity with financial regulations"?

---

## Step 3 — Push back (~7 min)

In the same session as Step 2, ask Claude to argue the opposite of its conclusion:

```
Now make the strongest possible case for the opposite answer.
```

Note whether it can do it, and how convincing the argument is.

Then add this line to your original Step 2 prompt and run it fresh in a new session:

```
After your analysis, give a confidence level: high, medium, or low, and explain what would change your assessment.
```

---

## Reflection questions

- Did chain-of-thought change the answer, or just the explanation?
- Claude's reasoning in Step 2 is not verification — it is a generated narrative that accompanies the answer. What does that imply for how you use it?
- When would you use chain-of-thought in a production prompt, versus a conversational one?

---

## Troubleshooting

**Claude gave me a paragraph answer for the zero-shot prompt even though I asked for yes or no**  
That is normal. Models rarely give a single word when the question has nuance. The point is to compare the depth and structure of reasoning between the two prompts, not the length.

**The chain-of-thought output is very long**  
That is expected. Asking for step-by-step reasoning increases output length. In production you can add: "Summarise your reasoning in two sentences after the analysis."
