import requests
import time
import os
import logging
import re

# --- Configuration ---
# Now using a single API Token instead of Email + Global Key
CF_DNS_API_TOKEN = os.getenv("CF_DNS_API_TOKEN", "your_api_token_here")
DDNS_DOMAIN = os.getenv("DDNS_DOMAIN", "example.org")
INTERVAL = int(os.getenv("INTERVAL", "300"))
DRY_RUN = os.getenv("DRY_RUN", "false").lower() in ("true", "1", "yes")
LOG_FILE = os.getenv("LOG_FILE", "/app/ddns.log")

# --- ANSI Color Codes ---
RED = "\033[91m"
GREEN = "\033[92m"
AMBER = "\033[93m"
CYAN = "\033[96m"
RESET = "\033[0m"

# --- Logging Setup ---
class ColorStrippingFormatter(logging.Formatter):
    def format(self, record):
        message = super().format(record)
        return re.sub(r'\x1b\[[0-9;]*m', '', message)

logger = logging.getLogger("CloudflareDDNS")
logger.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter('%(message)s'))
logger.addHandler(console_handler)

file_handler = logging.FileHandler(LOG_FILE)
file_handler.setFormatter(ColorStrippingFormatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(file_handler)

def log(message, color=""):
    prefix = f"[DRY RUN] " if DRY_RUN else ""
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S %z")
    console_msg = f"{color}[{timestamp}] {prefix}{message}{RESET}"
    file_msg = f"{prefix}{message}"

    if color == RED:
        logger.error(console_msg, extra={'raw_msg': file_msg})
    elif color == AMBER:
        logger.warning(console_msg, extra={'raw_msg': file_msg})
    else:
        logger.info(console_msg, extra={'raw_msg': file_msg})

def clean_log_emit(record):
    if hasattr(record, 'raw_msg'):
        record.msg = record.raw_msg
    return record

file_handler.addFilter(clean_log_emit)

# --- Cloudflare Logic ---
def get_public_ip(version="ipv4"):
    url = f"https://{version}.cloudflare-dns.com/cdn-cgi/trace"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        for line in response.text.split("\n"):
            if line.startswith("ip="):
                return line.split("=")[1]
    except Exception:
        return None
    return None

class CloudflareManager:
    def __init__(self, token):
        # API Token uses Bearer Authentication
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        self.base_url = "https://api.cloudflare.com/client/v4"

    def get_zone_id(self, domain):
        parts = domain.replace("*.", "").split(".")
        zone_name = ".".join(parts[-2:])
        try:
            r = requests.get(f"{self.base_url}/zones?name={zone_name}", headers=self.headers)
            res = r.json()
            if res["success"] and res["result"]:
                return res["result"][0]["id"]
            else:
                log(f"Zone not found or Token lacks permissions for {zone_name}", RED)
        except Exception as e:
            log(f"Error fetching zone ID: {e}", RED)
        return None

    def update_record(self, zone_id, name, ip_type, ip_address):
        try:
            r = requests.get(f"{self.base_url}/zones/{zone_id}/dns_records?type={ip_type}&name={name}", headers=self.headers)
            res = r.json()
            record_type = "A" if ip_type == "A" else "AAAA"

            if res["success"] and res["result"]:
                record = res["result"][0]
                if record["content"] != ip_address:
                    update_url = f"{self.base_url}/zones/{zone_id}/dns_records/{record['id']}"
                    payload = {"type": record_type, "name": name, "content": ip_address, "ttl": 1, "proxied": False}
                    if not DRY_RUN:
                        requests.put(update_url, headers=self.headers, json=payload)
                    log(f"URL: {update_url}")
                    log(f"Payload:\n{payload}")
                    log(f"Updated {record_type} record for {name} from {record['content']} to {ip_address}", GREEN)
                else:
                    log(f"{record_type} record for {name} is up to date.", "")
            else:
                create_url = f"{self.base_url}/zones/{zone_id}/dns_records"
                payload = {"type": record_type, "name": name, "content": ip_address, "ttl": 1, "proxied": False}
                if not DRY_RUN:
                    requests.post(create_url, headers=self.headers, json=payload)
                log(f"URL: {create_url}")
                log(f"Payload: {payload}")
                log(f"Created {record_type} record for {name} with {ip_address}", GREEN)
        except Exception as e:
            log(f"Error updating {name}: {e}", RED)

    def delete_record(self, zone_id, name, ip_type):
        try:
            r = requests.get(f"{self.base_url}/zones/{zone_id}/dns_records?type={ip_type}&name={name}", headers=self.headers)
            res = r.json()
            if res["success"] and res["result"]:
                record_id = res["result"][0]["id"]
                del_url = f"{self.base_url}/zones/{zone_id}/dns_records/{record_id}"
                if not DRY_RUN:
                    requests.delete(del_url, headers=self.headers)
                log(f"URL: {del_url}")
                log(f"IPv6 unreachable. Deleted AAAA record for {name}", AMBER)
        except Exception as e:
            log(f"Error deleting record: {e}", RED)

def main():
    cf = CloudflareManager(CF_DNS_API_TOKEN)
    DOMAINS = [f"{DDNS_DOMAIN}", f"*.{DDNS_DOMAIN}"]

    if DRY_RUN:
        log("DRY RUN MODE ENABLED", AMBER)

    while True:
        ipv4 = get_public_ip("ipv4")
        ipv6 = get_public_ip("ipv6")

        if not ipv4:
            log("Could not detect IPv4 address!", RED)

        for domain in DOMAINS:
            zone_id = cf.get_zone_id(domain)
            if not zone_id: continue

            if ipv4: cf.update_record(zone_id, domain, "A", ipv4)
            if ipv6:
                cf.update_record(zone_id, domain, "AAAA", ipv6)
            else:
                cf.delete_record(zone_id, domain, "AAAA")

        log(f"Sleeping for {INTERVAL} seconds...")
        time.sleep(INTERVAL)

if __name__ == "__main__":
    log("Starting Cloudflare Scoped-Token DDNS Script...", GREEN)
    main()
