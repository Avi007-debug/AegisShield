import hashlib

def ingest_content(text: str) -> dict:
    content_hash = hashlib.sha256(text.encode()).hexdigest()[:16]
    
    word_count = len(text.split())
    exclamation_count = text.count('!')
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    
    # Infection probability: base 0.05, boosted by urgency signals
    # Caps ratio and exclamations are weak proxies for emotional charge
    # Capped at 0.30 to stay within organic spread range
    infection_prob = round(
        min(0.05 + (exclamation_count * 0.02) + (caps_ratio * 0.1), 0.30), 4
    )
    
    return {
        'content_hash':   content_hash,
        'infection_prob': infection_prob,
        'word_count':     word_count
    }