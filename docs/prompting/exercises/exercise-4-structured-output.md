# Exercise 4: Structured Output

**Goal:** Write a prompt that reliably extracts structured data as JSON by specifying a schema and providing a one-shot example.

**Duration:** ~15 minutes

---

## The scenario

You are building a feature that ingests hotel reviews and stores structured data for analytics. You need to extract five fields consistently from unstructured review text. You will progress from a loose instruction to a schema-constrained prompt with an example.

Open a new Claude session.

---

## Step 1 — Loose extraction (~3 min)

Run this prompt with the review below:

```
Extract key information from this hotel review and return it as JSON.
```

**Hotel review:**
> Stayed at the Grand Meridian for 4 nights in May. Location is perfect — right in the city centre, walkable to all the main attractions. Check-in was smooth and staff were genuinely helpful throughout.
>
> The room itself was a bit disappointing. Comfortable bed but the aircon was noisy and kept us up the first night. Breakfast was included and the spread was impressive — easily the best hotel breakfast I've had in Europe. Small but well-equipped gym.
>
> I'd recommend this for business travellers or couples. Maybe not ideal for families with young kids — noisy corridors in the evenings and no pool.
>
> Overall a good stay. Location and breakfast make up for the minor room issues.

Note the JSON structure Claude chose. Did it match what you expected?

---

## Step 2 — Specify the schema (~5 min)

Update your prompt to specify the exact JSON shape you need:

```
Extract information from this hotel review and return JSON in exactly this format:

{
  "rating": <integer 1–5>,
  "sentiment": <"positive" | "neutral" | "negative">,
  "highlights": [<string>, ...],
  "drawbacks": [<string>, ...],
  "recommendedFor": [<string>, ...],
  "notRecommendedFor": [<string>, ...]
}

Return only the JSON. No explanation.
```

Run it with the same review. Does the output match the schema?

**Checkpoint:** Does the JSON parse without errors? Does `recommendedFor` contain entries like `"business travellers"` or `"couples"`?

---

## Step 3 — Add a one-shot example (~7 min)

Even with a schema, models sometimes produce inconsistent types or field names. Add a one-shot example to anchor the expected output:

```
Extract information from this hotel review and return JSON in exactly this format:

{
  "rating": <integer 1–5>,
  "sentiment": <"positive" | "neutral" | "negative">,
  "highlights": [<string>, ...],
  "drawbacks": [<string>, ...],
  "recommendedFor": [<string>, ...],
  "notRecommendedFor": [<string>, ...]
}

Example:
Review: "Great little hotel. Clean rooms, slow Wi-Fi, good for solo travellers. 3 stars."
Output:
{
  "rating": 3,
  "sentiment": "positive",
  "highlights": ["clean rooms"],
  "drawbacks": ["slow Wi-Fi"],
  "recommendedFor": ["solo travellers"],
  "notRecommendedFor": []
}

Now extract from this review:
[paste the Grand Meridian review]

Return only the JSON. No explanation.
```

Run it. Try running it three times in separate sessions. Is the output consistent?

---

## Reflection questions

- Between Step 1 and Step 3, how much did the schema and example actually change the output? What could not be constrained by the prompt alone?
- What would you do if a review genuinely did not contain enough information to fill a field?
- In a production system, what would you add after receiving Claude's JSON output?

---

## Troubleshooting

**The JSON is wrapped in a markdown code block (` ```json ``` `)**  
Add "Return only the raw JSON. No markdown formatting." to your prompt.

**The output does not parse as valid JSON**  
Check for trailing commas and unquoted strings — common model errors. In production, handle this with a retry or a schema validation library such as Zod.

**The `rating` field is a string ("4") instead of a number (4)**  
Specify the type more explicitly: `"rating": <integer between 1 and 5>`. You can also demonstrate the correct type in your one-shot example.
