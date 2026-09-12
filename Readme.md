# ScamShield India

> An AI-powered platform for detecting and explaining investment scams before users lose money.

## The Problem

Investment scams are becoming increasingly convincing. Fake advisers,
trading platforms, guaranteed-return schemes, and impersonation scams can
look legitimate to someone who does not know what to verify.

ScamShield India was built around a simple question:

**"Can I trust this investment?"**

## What ScamShield Does

ScamShield analyzes suspicious investment content using multiple sources
of evidence.

Users can submit:

- URLs
- Investment messages
- Social media content
- Screenshots
- Web pages

The system evaluates the submitted content through several detection layers:

### NLP Analysis
Identifies scam-related language, guaranteed-return claims, urgency,
and other manipulation patterns.

### URL & Domain Analysis
Examines suspicious links, domains, redirects, and other URL characteristics.

### Web Intelligence
Looks for reputation information and reports associated with the submitted
content.

### Official Verification
Checks claimed advisers, brokers, companies, and platforms against relevant
official sources.

### Scam Intelligence
Compares extracted identifiers and patterns against known scam indicators.

### OCR & Image Analysis
Extracts relevant information from screenshots and other visual content.

## Risk Assessment

Rather than relying on a single AI prediction, ScamShield combines evidence
from multiple detection layers to produce a risk score from **0–100**.

The result is classified as:

- 🟢 Low Risk
- 🟡 Suspicious
- 🔴 High Risk

The system also presents the evidence behind the result so that users can
understand *why* something was flagged.

### Example

**🔴 HIGH RISK — 91/100**

- ❌ Adviser could not be verified
- ⚠️ Guaranteed-return claim detected
- ⚠️ Suspicious trading domain
- ❌ Similarity to a known scam pattern

## From Detection to Action

ScamShield is designed around:

**Detect → Verify → Explain → Protect**

Instead of simply telling a user that something is "dangerous", the system
shows the evidence and helps them decide what to do next.

Possible actions include:

**Verify · Avoid · Report**

## Technology

- Python
- NLP / AI
- OCR
- Web intelligence
- Domain analysis
- Risk scoring
- Gemini API
- [Add the actual frontend/backend technologies used here]

## Why I Built It

I built ScamShield India to explore how AI can be used for a problem that
affects people outside the technology world.

The goal was not simply to classify text as a scam. I wanted to explore how
different pieces of evidence could be brought together and explained in a
way that a normal user could understand.

## Future Ideas

- Browser extension for real-time warnings
- Scam campaign detection through correlated indicators
- Expanded official-source verification
- Community reporting and scam intelligence
- Improved image and social-media analysis

## Project Status

This project was developed as part of a hackathon and is an ongoing
learning project.

## What I Learned

Through this project, I explored:

- Building a problem-focused AI application
- Combining multiple sources of evidence
- Working with APIs and external data
- Designing explanations for non-technical users
- Developing as part of a hackathon team
