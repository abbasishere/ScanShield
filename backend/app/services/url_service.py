import re
import socket
import ssl
from urllib.parse import urlparse
from typing import Dict, Any, Optional
from datetime import datetime, timezone

try:
    import whois
    WHOIS_AVAILABLE = True
except ImportError:
    WHOIS_AVAILABLE = False

HIGH_RISK_TLDS = {
    '.xyz', '.top', '.club', '.site', '.vip', '.icu', '.cfd', '.free', 
    '.work', '.gq', '.ml', '.tk', '.cc', '.buzz', '.monster', '.rest',
    '.live', '.online', '.fun', '.space', '.click', '.link', '.surf'
}

# Authentic known domains for major Indian and international institutions
OFFICIAL_DOMAINS = {
    'sebi': ['sebi.gov.in'],
    'rbi': ['rbi.org.in'],
    'sbi': ['onlinesbi.sbi', 'sbi.co.in', 'statebankofindia.com'],
    'hdfc': ['hdfcbank.com', 'hdfc.com'],
    'icici': ['icicibank.com', 'icicidirect.com'],
    'pnb': ['pnbindia.in', 'netpnb.com'],
    'axis': ['axisbank.com'],
    'kotak': ['kotak.com'],
    'zerodha': ['zerodha.com', 'kite.zerodha.com'],
    'groww': ['groww.in'],
    'angelone': ['angelone.in'],
    'upstox': ['upstox.com'],
    'tata': ['tata.com', 'tatacapital.com', 'tatamotors.com'],
    'flipkart': ['flipkart.com'],
    'amazon': ['amazon.in', 'amazon.com'],
    'indiapost': ['indiapost.gov.in'],
    'irctc': ['irctc.co.in'],
    'epfo': ['epfindia.gov.in'],
    'incometax': ['incometax.gov.in'],
    'telegram': ['t.me', 'telegram.org', 'telegram.me'],
    'whatsapp': ['whatsapp.com', 'wa.me']
}

def check_dns_resolvable(domain: str) -> bool:
    """Checks if domain resolves to an active IP address via DNS."""
    try:
        socket.setdefaulttimeout(3.0)
        ip = socket.gethostbyname(domain)
        return bool(ip)
    except Exception:
        return False

def check_ssl_validity(domain: str) -> Dict[str, Any]:
    """Inspects live SSL certificate on port 443."""
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = True
        ctx.verify_mode = ssl.CERT_REQUIRED
        with socket.create_connection((domain, 443), timeout=3.0) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                not_after = cert.get('notAfter')
                return {
                    "hasSsl": True,
                    "isValid": True,
                    "expiry": not_after
                }
    except Exception as e:
        return {
            "hasSsl": False,
            "isValid": False,
            "error": str(e)
        }

def lookup_whois_age(domain: str) -> Dict[str, Any]:
    """Queries live WHOIS database to compute actual domain age in days."""
    if not WHOIS_AVAILABLE:
        return {"ageDays": None, "creationDate": None, "registrar": None}

    try:
        w = whois.whois(domain)
        creation_date = w.creation_date
        
        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if creation_date:
            # Handle naive and aware datetimes
            now = datetime.now(timezone.utc) if creation_date.tzinfo else datetime.now()
            age_days = (now - creation_date).days
            return {
                "ageDays": max(0, age_days),
                "creationDate": creation_date.strftime("%Y-%m-%d"),
                "registrar": w.registrar
            }
    except Exception:
        pass
    
    return {"ageDays": None, "creationDate": None, "registrar": None}

def analyze_url_intelligence(url_str: str) -> Dict[str, Any]:
    """
    Evaluates real-world domain age, typosquatting, TLD risk, live DNS reachability, and SSL.
    """
    if not url_str:
        return {
            "url": "",
            "domain": "",
            "isSuspiciousTld": False,
            "isTyposquatting": False,
            "hasValidSsl": False,
            "riskScore": 15.0,
            "details": "No URL provided."
        }

    if not url_str.startswith(('http://', 'https://')):
        url_str = 'https://' + url_str

    parsed = urlparse(url_str)
    raw_domain = parsed.netloc.lower().split(':')[0]
    domain = raw_domain[4:] if raw_domain.startswith('www.') else raw_domain

    is_https = parsed.scheme == 'https'
    
    # 1. TLD Risk Check
    tld_match = re.search(r'\.[a-z]{2,}(?:\.[a-z]{2,})?$', domain)
    tld = tld_match.group(0) if tld_match else ''
    is_suspicious_tld = tld in HIGH_RISK_TLDS

    # 2. Typosquatting / Brand Impersonation Check
    is_typosquatting = False
    spoofed_brand = None
    is_official_brand_domain = False

    for brand, legit_domains in OFFICIAL_DOMAINS.items():
        if domain in legit_domains or any(domain.endswith('.' + d) for d in legit_domains):
            is_official_brand_domain = True
            break
        
        # Check if brand keyword is in the domain name but domain is NOT official
        if brand in domain:
            is_typosquatting = True
            spoofed_brand = brand
            break

    # 3. Live DNS Check
    is_dns_live = check_dns_resolvable(domain)

    # 4. Live WHOIS Check
    whois_info = lookup_whois_age(domain)
    domain_age_days = whois_info.get("ageDays")
    creation_date = whois_info.get("creationDate")

    # 5. Live SSL Check
    ssl_info = check_ssl_validity(domain) if is_dns_live else {"hasSsl": False, "isValid": False}

    # 6. Calculate Risk Score
    risk_score = 10.0
    details = []

    if is_official_brand_domain:
        risk_score = 5.0
        details.append(f"Verified official domain for {domain}.")
    else:
        if not is_https or not ssl_info.get("hasSsl"):
            risk_score += 25.0
            details.append("Lacks valid HTTPS/SSL encryption.")
        
        if is_suspicious_tld:
            risk_score += 45.0
            details.append(f"Uses high-risk/disposable TLD ({tld}) frequently used in phishing campaigns.")

        if is_typosquatting:
            risk_score += 55.0
            brand_label = spoofed_brand.upper() if spoofed_brand else "OFFICIAL ENTITY"
            details.append(f"⚠️ Brand Impersonation Alert: Domain attempts to mimic '{brand_label}' but is not an authorized domain ({domain}).")

        if domain_age_days is not None:
            if domain_age_days < 30:
                risk_score += 40.0
                details.append(f"Brand New Domain: Registered only {domain_age_days} days ago ({creation_date}).")
            elif domain_age_days < 180:
                risk_score += 20.0
                details.append(f"Recently Created Domain: Registered {domain_age_days} days ago.")
            else:
                details.append(f"Established Domain: Active for {domain_age_days} days (Created {creation_date}).")

        if 't.me' in domain or 'telegram' in domain:
            risk_score += 25.0
            details.append("Directs users to an anonymous Telegram channel/group.")

        if not is_dns_live:
            risk_score += 20.0
            details.append("Domain failed DNS resolution or is temporarily unreachable.")

    risk_score = min(max(risk_score, 5.0), 99.0)

    if not details:
        details.append("Domain appears authentic with standard TLD and valid DNS.")

    return {
        "url": url_str,
        "domain": domain,
        "creationDate": creation_date,
        "domainAgeDays": domain_age_days,
        "isSuspiciousTld": is_suspicious_tld,
        "isTyposquatting": is_typosquatting,
        "hasValidSsl": is_https and ssl_info.get("hasSsl", False),
        "isDnsLive": is_dns_live,
        "riskScore": round(risk_score, 1),
        "details": " ".join(details)
    }
