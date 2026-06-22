# Module: Communicating with AI

> Complete the **Setup** module before starting here.

---

## How LLMs process text

**Tokens**  
Language models don't read words — they read tokens. A token is roughly 3–4 characters. "Unbelievable" is three tokens; "cat" is one. Why it matters: prompt length affects cost and speed, and very long prompts can exceed a model's limits. For the exercises in this module, token counts are not a concern — but understanding tokens helps you reason about why some prompts are slow or expensive in production.

**Context window**  
Everything a model sees in one session is called the context window: your messages, the model's replies, any files you include. The model has no memory outside this window — it cannot recall a prompt you wrote in a different session. Current models handle large context windows (100,000+ tokens), but the key point is that clarity within a single prompt matters more than accumulating history across sessions.

**Probabilistic output**  
A language model predicts the most likely next token given everything in the context. This means the same prompt does not always produce the same output. When you test a prompt once and it works, that is not evidence it will always work. Run prompts multiple times; look for consistency, not just a single good result.

---

## Exercises

- **Exercise 1 — From Vague to Precise:** Run three weak prompts and iteratively improve one. Learn how specificity, context, and output constraints affect what Claude returns.
- **Exercise 2 — Teaching by Example:** Classify support messages zero-shot, then add few-shot examples and compare the output for edge cases.
- **Exercise 3 — Asking for Reasoning:** Compare direct answers versus chain-of-thought on an ambiguous matching task. Observe what changes and what stays the same.
- **Exercise 4 — Structured Output:** Extract fields from unstructured text as JSON by specifying a schema and adding a one-shot example.
