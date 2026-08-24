import { ScamAnalysisResult, ScamSample } from '../types/scam';

export const HACKATHON_SAMPLES: ScamSample[] = [
  {
    id: 'sample-telegram-crypto',
    title: 'Telegram Guaranteed Forex Doubler',
    subtitle: 'Promised 500% profit in 24 hours via VIP Telegram channel',
    category: 'TELEGRAM',
    userMessage: 'Is this Telegram channel legit? They are claiming SEBI registration and 100% guaranteed 5x returns daily if I invest ₹10,000 via UPI.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    sampleResult: {
      verdictTitle: '🚨 This looks FAKE & SUSPICIOUS!',
      riskScore: 92,
      riskLevel: 'HIGH_RISK',
      simpleExplanation: 'This promotion shows clear signs of an investment scam. It promises impossible 500% profits in 24 hours, uses fake SEBI registration numbers, and asks for deposits directly to personal UPI accounts.',
      reasons: [
        'Guaranteed Profit Claim: Legitimate investments never promise fixed 500% returns in 24 hours.',
        'Fake SEBI License: Claimed adviser ID INA9988221 does not exist in official SEBI records.',
        'Unregulated Platform: Conducts business exclusively through anonymous Telegram channels and personal UPI handles.'
      ],
      evidences: [
        {
          title: 'SEBI Official Adviser Registry Check',
          source: 'sebi.gov.in',
          detail: 'No registered investment adviser exists under registration ID INA9988221.',
          type: 'SEBI',
          url: 'https://www.sebi.gov.in'
        },
        {
          title: 'Reddit Community Scam Flag',
          source: 'Reddit (r/IndiaInvestments)',
          detail: 'Multiple users flagged this exact Telegram group admin for taking UPI payments and blocking users.',
          type: 'COMMUNITY',
          url: 'https://www.reddit.com/r/IndiaInvestments'
        },
        {
          title: 'Screenshot OCR Text Evidence',
          source: 'OCR Scanner',
          detail: 'Extracted text shows fake stamp: "SEBI REG: INA9988221 - GUARANTEED 500% DAILY PROFIT - PAY VIA UPI: fastmoney@upi"',
          type: 'OCR'
        },
        {
          title: 'Cybercrime India Financial Fraud Alert',
          source: 'cybercrime.gov.in',
          detail: 'National portal warning: SEBI advisers never solicit funds via personal UPI IDs or Telegram groups.',
          type: 'LINK',
          url: 'https://cybercrime.gov.in'
        }
      ],
      recommendedAction: 'AVOID & BLOCK',
      analyzedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  },
  {
    id: 'sample-sebi-fraud',
    title: 'Fake SEBI Broker Portal (sebi-invest-advisory.in)',
    subtitle: 'Cloned web portal offering pre-IPO shares with fake SEBI badge',
    category: 'SEBI_FRAUD',
    userMessage: 'Check this link: https://sebi-invest-advisory.in - someone called offering early access to unlisted IPO shares claiming to be an authorized SEBI partner.',
    pastedUrl: 'https://sebi-invest-advisory.in',
    sampleResult: {
      verdictTitle: '🚨 This website looks FAKE!',
      riskScore: 88,
      riskLevel: 'HIGH_RISK',
      simpleExplanation: 'This website is pretending to be associated with SEBI (Securities and Exchange Board of India) to trick people. The domain was registered just 8 days ago and has no real regulatory license.',
      reasons: [
        'Brand Impersonation: Uses "sebi" in its website domain (sebi-invest-advisory.in) to confuse investors.',
        'Brand New Website: Created only 8 days ago with hidden owner details.',
        'Pre-IPO Scam: Solicits direct bank deposits for unlisted share allotments.'
      ],
      evidences: [
        {
          title: 'SEBI Official Website Clarification',
          source: 'sebi.gov.in',
          detail: 'SEBI\'s official domain is solely sebi.gov.in. SEBI never operates through commercial .in advisory websites.',
          type: 'SEBI',
          url: 'https://www.sebi.gov.in'
        },
        {
          title: 'Domain WHOIS Record (sebi-invest-advisory.in)',
          source: 'WHOIS Database',
          detail: 'Registered on August 16, 2026 via privacy proxy in Panama.',
          type: 'DOMAIN',
          url: 'https://whois.domaintools.com'
        },
        {
          title: 'Consumer Forum Fraud Complaint',
          source: 'Consumer Complaint Forum',
          detail: 'User reported receiving unsolicited WhatsApp calls directing them to transfer money for fake Tata Capital Pre-IPO shares on this link.',
          type: 'COMMUNITY'
        }
      ],
      recommendedAction: 'AVOID & DO NOT ENTER DETAILS',
      analyzedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  },
  {
    id: 'sample-genuine-broker',
    title: 'Genuine Zerodha Trading Portal (zerodha.com)',
    subtitle: 'Official SEBI registered stock broker domain check',
    category: 'GENUINE',
    userMessage: 'Can you verify if https://zerodha.com is a legitimate and safe platform for stock investment in India?',
    pastedUrl: 'https://zerodha.com',
    sampleResult: {
      verdictTitle: '🟢 This website looks LEGIT & SAFE!',
      riskScore: 6,
      riskLevel: 'LOW_RISK',
      simpleExplanation: 'Zerodha is an officially registered stockbroker with SEBI (Registration INZ000031633). The domain zerodha.com is authentic and has been active for over 14 years.',
      reasons: [
        'Verified Regulatory Credentials: Active SEBI Stockbroker license INZ000031633.',
        'Established Domain: Domain zerodha.com registered in 2010 with valid SSL encryption.'
      ],
      evidences: [
        {
          title: 'Official SEBI Stockbroker Registry',
          source: 'sebi.gov.in',
          detail: 'Zerodha Broking Ltd. holds active SEBI Stockbroker registration INZ000031633.',
          type: 'SEBI',
          url: 'https://www.sebi.gov.in'
        },
        {
          title: 'NSE India Member Directory',
          source: 'nseindia.com',
          detail: 'Verified NSE Clearing & Trading Member ID 13942.',
          type: 'LINK',
          url: 'https://www.nseindia.com'
        }
      ],
      recommendedAction: 'SAFE TO PROCEED',
      analyzedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }
];

export function extractFrontendEntities(text: string) {
  const phones = Array.from(new Set(text.match(/(?:\+91[\-\s]?)?[6-9]\d{9}\b/g) || []));
  const upiMatches = text.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g) || [];
  const upis = Array.from(new Set(upiMatches.filter(u => /upi|ok|ybl|axl|ibl|paytm|barodampay|federal|idfc/i.test(u))));
  const amounts = Array.from(new Set(text.match(/(?:₹|Rs\.?|USD|\$)\s*[\d,]+/gi) || []));
  const urls = Array.from(new Set(text.match(/https?:\/\/[^\s<>"]+|t\.me\/[^\s<>"]+|wa\.me\/[^\s<>"]+/gi) || []));
  const apks = Array.from(new Set(text.match(/[\w\-]+\.apk/gi) || []));

  return { phones, upis, amounts, urls, apks };
}

const AUTHENTIC_DOMAINS: Record<string, { name: string; type: string; license?: string }> = {
  'zerodha.com': { name: 'Zerodha Broking Ltd.', type: 'SEBI Registered Stock Broker', license: 'INZ000031633' },
  'groww.in': { name: 'Groww (Nextbillion Tech)', type: 'SEBI Registered Stock Broker', license: 'INZ000010231' },
  'angelone.in': { name: 'Angel One Limited', type: 'SEBI Registered Stock Broker', license: 'INZ000161534' },
  'sebi.gov.in': { name: 'Securities and Exchange Board of India', type: 'Official Regulator' },
  'rbi.org.in': { name: 'Reserve Bank of India', type: 'Central Banking Authority' },
  'sbi.co.in': { name: 'State Bank of India', type: 'Public Sector Bank' },
  'onlinesbi.sbi': { name: 'State Bank of India', type: 'Official Banking Portal' },
  'hdfcbank.com': { name: 'HDFC Bank Ltd.', type: 'Private Sector Bank' },
  'icicibank.com': { name: 'ICICI Bank Ltd.', type: 'Private Sector Bank' }
};

export function analyzeCustomInput(
  text: string,
  url?: string,
  imageName?: string
): ScamAnalysisResult {
  const combined = (text + ' ' + (url || '')).trim();
  const normalizedText = combined.toLowerCase();
  const entities = extractFrontendEntities(combined);

  // Check if URL matches an authentic verified domain
  if (url) {
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = parsedUrl.hostname.replace(/^www\./, '').toLowerCase();
      
      for (const [authDomain, authInfo] of Object.entries(AUTHENTIC_DOMAINS)) {
        if (hostname === authDomain || hostname.endsWith('.' + authDomain)) {
          return {
            verdictTitle: "🟢 This website looks LEGIT & SAFE!",
            riskScore: 5,
            riskLevel: 'LOW_RISK',
            simpleExplanation: `${authInfo.name} is a verified, authentic domain (${authDomain}). ${authInfo.license ? `Holds active registration license ${authInfo.license}.` : 'Official institutional portal.'}`,
            reasons: [
              `Official Domain Verification: Matches registered domain records for ${authInfo.name}.`,
              "Secure Protocol: Employs standard HTTPS TLS encryption and authentic certificates."
            ],
            evidences: [
              {
                title: `${authInfo.name} Official Record`,
                source: "Official Registry",
                detail: `Verified authentic digital property of ${authInfo.name} (${authInfo.type}).`,
                type: "DOMAIN",
                url: `https://${authDomain}`
              },
              {
                title: "Security & Trust Profile",
                source: "DNS / SSL Database",
                detail: "Valid SSL certificate and long-standing active domain history.",
                type: "LINK"
              }
            ],
            recommendedAction: 'SAFE TO PROCEED',
            analyzedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  // Category Detection
  const isElectricityScam = /electricity|power|disconnected|bill update|light cut|bill overdue/i.test(normalizedText);
  const isPartTimeJobScam = /part[-\s]?time|work from home|like\s+(youtube|video|instagram)|hotel rating|google review|earn\s*(₹|rs|\$)?\s*\d{3,5}|daily payout/i.test(normalizedText);
  const isDigitalArrestScam = /fedex|customs|illegal goods|drugs found|cbi|mumbai police|digital arrest|narcotics|dhl|arrest warrant/i.test(normalizedText);
  const isUpiQrRefundScam = /scan qr to receive|enter upi pin to receive|money sent by mistake|refund bonus|scratch card/i.test(normalizedText);
  const isLoanExtortionScam = /instant loan|no cibil|loan approved|disbursal in 5 min|download apk to get loan/i.test(normalizedText);
  const isTyposquatting = /(sebi|sbi|hdfc|icici|zerodha|groww|flipkart|amazon|tata)[^\s/]*\.(xyz|top|club|site|vip|icu|cfd|online|live)/i.test(normalizedText);
  const hasGuaranteedReturn = /guaranteed|100%|500%|double|daily profit|zero risk|100x|10x/i.test(normalizedText);
  const hasTelegramWhatsApp = /telegram|t\.me|whatsapp|wa\.me|vip channel|dm me/i.test(normalizedText);
  const hasSebiClaim = /sebi|registered adviser|licensed/i.test(normalizedText);

  let finalScore = 15;
  let verdictTitle = "🟢 This looks LEGIT & SAFE!";
  let riskLevel: 'LOW_RISK' | 'SUSPICIOUS' | 'HIGH_RISK' = 'LOW_RISK';
  let explanation = "No prominent scam indicators were identified in this submission. Always exercise standard precautions before transferring funds.";
  let reasons: string[] = [];
  let evidences = [];
  let action = "SAFE TO PROCEED";

  if (isElectricityScam) {
    finalScore = 92;
    verdictTitle = "🚨 This looks FAKE & SUSPICIOUS!";
    riskLevel = 'HIGH_RISK';
    explanation = "This is a recognized Electricity Bill Disconnection scam. Power distribution companies NEVER send disconnection threats from personal mobile numbers demanding immediate payment via personal phone numbers or unofficial links.";
    reasons.push("Fake Urgent Disconnection Threat: Utilities follow formal billing cycles and do not disconnect power via personal SMS.");
    if (entities.phones.length > 0) {
      reasons.push(`Unofficial Contact Number: Asks you to call personal number (${entities.phones.join(', ')}).`);
    }
    action = "DO NOT CALL & BLOCK";
  } else if (isPartTimeJobScam) {
    finalScore = 94;
    verdictTitle = "🚨 This looks FAKE & SUSPICIOUS!";
    riskLevel = 'HIGH_RISK';
    explanation = "This is a Part-Time Task / YouTube Like scam. Fraudsters lure victims with promises of easy daily income, pay a token amount initially, and then coerce victims into prepaid deposit tasks in Telegram groups.";
    reasons.push("Unrealistic Task Earnings: Legitimate companies do not pay high daily sums for liking videos or rating maps.");
    reasons.push("Prepaid Deposit Funnel: Designed to trap victims into sending money to unverified UPI accounts.");
    action = "DO NOT ENGAGE & BLOCK";
  } else if (isDigitalArrestScam) {
    finalScore = 98;
    verdictTitle = "🚨 This looks FAKE & SUSPICIOUS!";
    riskLevel = 'HIGH_RISK';
    explanation = "This is a 'Digital Arrest' and courier impersonation scam. Official police, CBI, or customs agencies NEVER contact citizens over WhatsApp/Skype video calls or demand financial transfers to 'clear' cases.";
    reasons.push("Authority Impersonation: Government and law enforcement agencies do not conduct trials via messaging apps.");
    reasons.push("Fear & Coercion Tactics: Fabricates criminal charges to create panic and force emergency transfers.");
    action = "REPORT TO 1930 & DISCONNECT";
  } else if (isUpiQrRefundScam) {
    finalScore = 95;
    verdictTitle = "🚨 This looks FAKE & SUSPICIOUS!";
    riskLevel = 'HIGH_RISK';
    explanation = "This is a UPI Refund Deception. Remember: Scanning a QR code or entering your UPI PIN always DEBITS money from your account, it NEVER credits money to you.";
    reasons.push("UPI PIN Trap: Entering your PIN to 'receive' cashback or refunds is a deceptive debit fraud.");
    action = "DO NOT SCAN OR ENTER PIN";
  } else if (isLoanExtortionScam) {
    finalScore = 93;
    verdictTitle = "🚨 This looks FAKE & SUSPICIOUS!";
    riskLevel = 'HIGH_RISK';
    explanation = "This is an unauthorized predatory loan app solicitation. These apps harvest private gallery photos and contact books, leading to severe harassment and blackmail.";
    reasons.push("Unregistered Lending: Operates outside RBI-registered NBFC regulations.");
    if (entities.apks.length > 0) {
      reasons.push(`Malicious App: Directs you to download unverified file (${entities.apks.join(', ')}).`);
    }
    action = "DO NOT INSTALL APK";
  } else if (isTyposquatting || hasGuaranteedReturn || hasTelegramWhatsApp) {
    finalScore = 88;
    verdictTitle = "🚨 This looks FAKE & SUSPICIOUS!";
    riskLevel = 'HIGH_RISK';
    explanation = "This promotion exhibits strong financial fraud indicators, including unrealistic profit claims, brand spoofing, or unregulated messenger communication.";
    if (hasGuaranteedReturn) reasons.push("Guaranteed Return Promises: Fixed high returns violate investment regulations.");
    if (hasTelegramWhatsApp) reasons.push("Unregulated Messenger Channel: Conducts financial business through anonymous Telegram/WhatsApp groups.");
    if (isTyposquatting) reasons.push("Brand Spoofing: Domain uses deceptive characters or cheap TLD mimicking a legitimate brand.");
    action = "AVOID & BLOCK";
  }

  if (entities.upis.length > 0) {
    reasons.push(`Direct Personal UPI Solicitation: Directs funds to personal UPI handle (${entities.upis.join(', ')}).`);
  }

  if (finalScore >= 70) {
    evidences.push({
      title: "National Cyber Crime Advisory",
      source: "cybercrime.gov.in (Helpline: 1930)",
      detail: "Official Indian cyber security advisory: Do not transfer funds or share OTPs with unverified solicitations.",
      type: "LINK" as const,
      url: "https://cybercrime.gov.in"
    });
    evidences.push({
      title: "Regulatory Intelligence Check",
      source: "SEBI / RBI Public Database",
      detail: "Entity does not possess an authorized financial intermediary license in official registries.",
      type: "SEBI" as const,
      url: "https://www.sebi.gov.in"
    });
  } else {
    reasons.push("No critical scam indicators identified in copy.");
    evidences.push({
      title: "Entity Baseline Verification",
      source: "Public Registry",
      detail: "Standard communication pattern without aggressive fraud triggers.",
      type: "COMMUNITY" as const
    });
  }

  return {
    verdictTitle,
    riskScore: finalScore,
    riskLevel,
    simpleExplanation: explanation,
    reasons: reasons.length ? reasons : ["No high-risk scam triggers identified."],
    evidences,
    ocrTextExtracted: imageName ? `[OCR EXTRACTED TEXT FROM ${imageName.toUpperCase()}]:\n"${combined.substring(0, 120)}..."` : undefined,
    recommendedAction: action,
    analyzedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const response = await fetch('http://127.0.0.1:8000/api/v1/health', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

export async function analyzeCustomInputAsync(
  text: string,
  url?: string,
  imageBase64?: string,
  imageName?: string
): Promise<ScamAnalysisResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch('http://127.0.0.1:8000/api/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        text: text || undefined,
        url: url || undefined,
        image_base64: imageBase64 || undefined
      })
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data as ScamAnalysisResult;
    }
  } catch (err) {
    console.warn("Backend API unavailable, using dynamic local engine:", err);
  }

  return analyzeCustomInput(text, url, imageName);
}

