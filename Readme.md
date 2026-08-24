ScamShield India — Project Summary

ScamShield India is an AI-powered platform designed to detect and prevent fake investment and trading scams before users lose money.

Users can submit a URL, investment message, social-media post, screenshot, or webpage. The system analyzes it using multiple independent signals:

NLP analysis — detects scam-like language, guaranteed-return claims, urgency, and manipulation.

URL/domain analysis — identifies suspicious domains, redirects, and other risky link characteristics.

Web intelligence — searches for reputation information and similar scam reports.

Official entity verification — checks claimed advisers, brokers, companies, and platforms against relevant official sources such as SEBI.

Scam intelligence database — compares domains, accounts, identifiers, and patterns against known scam indicators.

OCR/image analysis — extracts useful information from screenshots or visual content.


These signals are combined through an evidence-fusion and risk-scoring engine rather than simply averaging AI confidence scores. The system produces a 0–100 risk score and classifies the content as Low Risk, Suspicious, or High Risk.

The detected evidence is then passed to Gemini AI, which converts the technical findings into a simple explanation for the user.

For example:

> 🔴 HIGH RISK — 91/100
❌ Adviser not verified
⚠️ Guaranteed-return claim
⚠️ Suspicious trading domain
❌ Matches a known scam pattern



The user is then guided toward safe actions such as Verify, Avoid, or Report.

Key Innovation

The project's main differentiator is evidence-based, proactive protection:

> Detect → Verify → Fuse Evidence → Explain → Protect



A browser extension can warn users while they encounter suspicious investment content instead of requiring them to manually investigate every opportunity.

A further intelligence layer can correlate repeated indicators—such as domains, phone numbers, UPI IDs, accounts, messages, and scam patterns—to identify related scam campaigns.

In one line:

> ScamShield India helps users answer “Can I trust this investment?” by combining AI detection, official verification, web intelligence, and explainable evidence before they invest.

Sure. For your project, the formula we discussed is **weighted evidence fusion**. The idea is that every detection method provides a signal, but **not every signal should have equal importance**.

### Weighted Risk Score

[
\boxed{
R=\frac{\sum_{i=1}^{n} w_i s_i}{\sum_{i=1}^{n}w_i}
}
]

Where:

* **(R)** = final risk score
* **(s_i)** = score produced by the (i^{th}) detection method
* **(w_i)** = reliability/importance weight of that method
* **(n)** = number of detection signals

For ScamShield India, the signals could be:

| Detection Signal          | What it evaluates                               |
| ------------------------- | ----------------------------------------------- |
| **NLP Score**             | Scam-like language and manipulation             |
| **URL Score**             | Suspicious domain/link characteristics          |
| **Web Reputation**        | Reports and reputation found online             |
| **Official Verification** | Whether claimed entities can be verified        |
| **Scam Pattern Score**    | Similarity to known scam patterns               |
| **OCR/Image Score**       | Suspicious information contained in screenshots |

### Example

Suppose the system gets:

```text
NLP                  85
URL Analysis         75
Web Reputation       60
Official Verification 95
Scam Pattern         90
```

Instead of saying:

> "Let's just average these."

we assign different weights according to reliability:

```text
NLP                    × 0.20
URL Analysis           × 0.15
Web Reputation         × 0.15
Official Verification  × 0.30
Scam Pattern           × 0.20
```

Then:

[
R =
\frac{
(0.20)(85)+(0.15)(75)+(0.15)(60)+(0.30)(95)+(0.20)(90)
}{
0.20+0.15+0.15+0.30+0.20
}
]

This produces a final risk score of **83.75/100**, so the system could classify it as **High Risk**.

### But there's an important improvement

I **wouldn't let this formula be the entire decision system**.

Suppose official verification returns:

> **"Claimed SEBI adviser not found in official registration records."**

That's much stronger evidence than merely seeing words like *"guaranteed returns."*

So ScamShield should use:

**Weighted scoring + high-confidence rules**

```text
                    Detection Signals
                           ↓
                  Individual Scores
                           ↓
              ┌─────────────────────┐
              │  Weighted Evidence   │
              │      Fusion          │
              └──────────┬──────────┘
                         ↓
                   Base Risk Score
                         ↓
              High-Confidence Rules
                         ↓
                 Final Risk Score
                         ↓
             Low / Suspicious / High
```

For example, a **verified regulatory failure** could significantly increase the risk regardless of the NLP score.

### How to explain this to an SIH judge

Don't say:

> "We take the average confidence of different AI models."

Say:

> **"ScamShield uses weighted evidence fusion, where signals from NLP, URL analysis, web intelligence, official verification and scam-pattern matching are assigned different reliability weights. High-confidence evidence, such as failure of official entity verification, is additionally handled through rule-based checks. This produces an explainable risk score rather than relying on a single AI model."**

That's technically much stronger and gives you a clear reason for having multiple detection methods.
