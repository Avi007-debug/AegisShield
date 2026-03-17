import sys
import requests
import time

BASE_URL = "http://127.0.0.1:8001"

def print_result(check, msg, status):
    print(f"{status:4}  {check} — {msg}")

def run_checks():
    pass_count = 0
    fail_count = 0
    failures = []

    def report(check, condition, msg_success, msg_fail, severity="high"):
        nonlocal pass_count, fail_count, failures
        if condition:
            print_result(check, msg_success, "PASS")
            pass_count += 1
        else:
            print_result(check, msg_fail, "FAIL")
            fail_count += 1
            failures.append((severity, check, msg_fail))

    print("\n## STEP 1 — Server Health")
    try:
        r = requests.get(f"{BASE_URL}/health")
        data = r.json()
        report("GET /health", r.status_code == 200 and data.get("status") == "ok", "returns 200 and status ok", f"Response: {data}")
    except Exception as e:
        report("GET /health", False, "", f"Exception: {e}")

    print("\n## STEP 2 — Federation Stores")
    try:
        r = requests.get(f"{BASE_URL}/federation/status")
        data = r.json()
        report("GET /federation/status (all)", r.status_code == 200 and "count" in data and "recent" in data, "Returns count and recent", f"Keys missing: {data.keys()}")
        
        hash_to_check = "a3f9c2d81b4e"
        r2 = requests.get(f"{BASE_URL}/federation/status?content_hash={hash_to_check}")
        data2 = r2.json()
        report("GET /federation/status (specific)", r2.status_code == 200 and data2.get("found") is True, "Pre-seeded entry exists", "Entry not found or bad response")
    except Exception as e:
        report("Federation checks", False, "", f"Exception: {e}")

    print("\n## STEP 3 — Combined /analyze Pipeline")
    analyze_body = {
        "text": "test propagation network text", 
        "use_cached_graph": True
    }
    try:
        r = requests.post(f"{BASE_URL}/analyze", json=analyze_body)
        if r.status_code == 200:
            data = r.json()
            fields = ["content_hash", "patient_zero", "infection_prob", "propagation", "graph"]
            missing = [f for f in fields if f not in data]
            report("POST /analyze keys", len(missing) == 0, "All keys present", f"Missing: {missing}")
            
            prop_data = data.get("propagation", {})
            report("Propagation dict", isinstance(prop_data, dict), "Propagation is dict", "Invalid propagation field")
            report("Graph object", isinstance(data.get("graph"), dict), "Graph object returned", "Invalid graph field")
        else:
            report("POST /analyze checks", False, "", f"Status {r.status_code}")
    except Exception as e:
        report("POST /analyze checks", False, "", f"Exception: {e}")

    print("\n## STEP 4 — Threat Scores & Cluster Info")
    try:
        r_threat = requests.get(f"{BASE_URL}/threat-scores")
        d_threat = r_threat.json()
        threat_fields = ["scores", "superspreader_id", "formula"]
        missing_t = [f for f in threat_fields if f not in d_threat]
        report("GET /threat-scores keys", r_threat.status_code == 200 and not missing_t, "Keys correct", f"Missing: {missing_t}")

        r_cluster = requests.get(f"{BASE_URL}/cluster-info")
        d_cluster = r_cluster.json()
        cluster_fields = ["clusters", "total_clustered_nodes", "unclustered_nodes"]
        missing_c = [f for f in cluster_fields if f not in d_cluster]
        report("GET /cluster-info keys", r_cluster.status_code == 200 and not missing_c, "Keys correct", f"Missing: {missing_c}")
    except Exception as e:
        report("Threat & Cluster checks", False, "", f"Exception: {e}")

    print("\n## STEP 5 — /contain Pipeline")
    try:
        r = requests.post(f"{BASE_URL}/contain/0")
        if r.status_code == 200:
            data = r.json()
            report("POST /contain keys", "cut_edges" in data, "Cut edges returned", "No cut_edges in response")
        else:
            report("POST /contain/0", False, "", f"Status {r.status_code}")
    except Exception as e:
        report("POST /contain/0", False, "", f"Exception: {e}")

    print("\n## STEP 6 — Audit Log Integrity")
    try:
        r = requests.get(f"{BASE_URL}/audit-log")
        if r.status_code == 200:
            data = r.json()
            logs = data.get("log", [])
            report("GET /audit-log structure", "log" in data and isinstance(logs, list), "Log is a list", "Invalid log structure")
            # We expect at least 2 entries because /contain/0 logs 2 actions (FLAGGED and COMPLIANT)
            report("Audit Log count", len(logs) >= 2, f"{len(logs)} logs found", f"Too few logs: {len(logs)}")
            if len(logs) > 0:
                first_log = logs[0]
                expected_fields = ["timestamp", "signature_id", "regulatory_order_id", "action", "status", "compliance_ref"]
                missing_l = [f for f in expected_fields if f not in first_log]
                report("Audit Log entry keys", not missing_l, "Keys correct inside log entry", f"Missing: {missing_l}")
        else:
            report("GET /audit-log", False, "", f"Status {r.status_code}")
    except Exception as e:
        report("GET /audit-log", False, "", f"Exception: {e}")

    print("\n" + "="*30)
    print(f"Total PASS: {pass_count}")
    print(f"Total FAIL: {fail_count}")
    print("\nFAILURES:")
    if not failures:
        print("None! Everything passed.")
    for sev, check, msg in failures:
        print(f"[{sev}] {check}: {msg}")

if __name__ == "__main__":
    print("Running newly calibrated endpoint checks based on exact return payloads...")
    run_checks()
