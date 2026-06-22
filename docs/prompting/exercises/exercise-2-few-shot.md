# Exercise 2: Teaching by Example

**Goal:** Understand when few-shot prompting improves output quality over zero-shot, and identify the messages where it matters most.

**Duration:** ~18 minutes

---

## The scenario

You are building a support triage tool. It needs to classify incoming messages into one of four categories: **bug report**, **feature request**, **question**, or **complaint**. You are testing two approaches: asking the model directly (zero-shot) and giving it labelled examples (few-shot).

Open a new Claude session.

---

## Step 1 — Zero-shot classification (~5 min)

Use this prompt for messages 5, 8, and 9 below — these are the most ambiguous. Run them in the **same session**.

**Zero-shot prompt:**
```
Classify this support message as one of: bug report, feature request, question, or complaint. Reply with only the category name.

Message: "[paste message here]"
```

**Message 5:** "The search function doesn't seem to match partial words. If I type 'proj' it doesn't find 'project'. I expected autocomplete to work."

**Message 8:** "Your app logged me out mid-session and I lost 20 minutes of work. This keeps happening and I'm seriously considering cancelling."

**Message 9:** "How do I change the email address on my account?"

Note the category Claude assigns to each.

---

## Step 2 — Add few-shot examples (~8 min)

Update your prompt to include four labelled examples before the message:

```
Classify this support message as one of: bug report, feature request, question, or complaint. Reply with only the category name.

Examples:
"The login button doesn't respond on Safari." → bug report
"Please add a dark mode option." → feature request
"How do I reset my password?" → question
"I've been waiting two weeks for a response and this is unacceptable." → complaint

Message: "[paste message here]"
```

Run the same three messages with the new prompt. Note whether any categorisations changed.

**Checkpoint:** Did message 8 change category? Why might it be ambiguous — is it a bug report (keeps happening) or a complaint (considering cancelling)?

---

## Step 3 — Swap an example (~5 min)

Replace the "dark mode" feature request example with:

`"It would be great if you could remember my login across devices." → feature request`

Run message 5 again. Did the category change? This is an example of how few-shot examples shape the model's interpretation of category boundaries.

---

## Reflection questions

- For which messages did few-shot make a difference? For which was zero-shot already reliable?
- Message 8 could reasonably be either a bug report or a complaint. How would you handle genuinely ambiguous cases in a real triage system?
- What happens if your few-shot examples are inconsistently labelled?

---

## Troubleshooting

**Claude is giving me a sentence instead of just the category name**  
Add "Reply with only the category name, nothing else." to the end of your prompt. Format instructions at the end tend to be followed more reliably.

**The category changed when I swapped the example — is that a bug?**  
No, that is the point. Few-shot examples define the boundaries of each category. Different examples draw different lines.
