# 🛠️ System Configuration Files (โครงสร้างการตั้งค่าระบบ)

โฟลเดอร์นี้รวบรวมไฟล์ตั้งค่าระบบเซิร์ฟเวอร์ (Server Configurations) ที่ใช้งานจริงในโครงงาน **ระบบเฝ้าระวังความปลอดภัยและเว็บไซต์ประชาสัมพันธ์หลักสูตร (Keroro Network Project)** อ้างอิงตามบทที่ 2 และบทที่ 3 ในเล่มรายงานโครงงาน

> **🔒 นโยบายความปลอดภัยข้อมูลลับ (Security & Privacy Notice):**
> ไฟล์การตั้งค่าทั้งหมดในโฟลเดอร์นี้ได้รับการ **Sanitize / ปิดบังข้อมูลสำคัญ (Masked Secrets)** เช่น รหัสผ่านฐานข้อมูล, API Key, Token และ Private Key ตามมาตรฐานความปลอดภัย (Security Best Practice) โดยระบบจริงจะโหลดค่าความลับผ่าน Environment Variables หรือ Systemd Encrypted Credentials เท่านั้น

---

## 📂 โครงสร้างไดเรกทอรี

```text
configs/
├── nginx/                          # การตั้งค่า Web Server & Reverse Proxy
│   ├── nginx.conf                  # Main Nginx HTTP core configuration
│   ├── conf.d/
│   │   └── security.conf           # JSON Log format, Area mapping, Rate limiting zones
│   └── sites-available/
│       ├── wordpress               # Frontend (Port 443) HTTPS, Reverse Proxy, Anti-Enumeration
│       ├── wordpress-backend       # Backend (127.0.0.1:8080) PHP-FPM WordPress
│       └── 00-default-reject       # Default Server Block ปฏิเสธการเข้าถึงผ่าน IP ตรง / Unknown Host
├── ssh/                            # การตั้งค่าความปลอดภัยการเข้าถึงระยะไกล
│   ├── 00-keroro-hardening.conf    # OpenSSH Hardening (ปิดรหัสผ่าน, บังคับ Key + TOTP MFA)
│   └── pam-sshd                    # PAM configuration (/etc/pam.d/sshd) สำหรับ Google Authenticator
├── firewall/                       # การตั้งค่าไฟร์วอลล์และป้องกัน Brute Force
│   ├── rules.v4                    # iptables rules (Geo-blocking THAILAND, IPsets บล็อกการโจมตี)
│   └── jail.local                  # Fail2Ban SSH jail configuration
├── systemd/                        # การตั้งค่า Background Services & Timers อัตโนมัติ
│   ├── security-pipeline.service   # วิเคราะห์ Security Log แบบ Incremental ด้วย AI
│   ├── security-pipeline.timer     # ตั้งเวลาทำงานทุก 5 วินาที
│   ├── security-enforcer.service   # บังคับใช้การบล็อก IP บน iptables/ipset
│   ├── security-enforcer.timer     # ตั้งเวลาทำงานทุก 5 วินาที
│   ├── security-email-alert.service# ส่งอีเมลแจ้งเตือนเหตุการณ์ความเสี่ยงระดับสูง (HIGH)
│   ├── security-email-alert.timer  # ตรวจสอบและส่งการแจ้งเตือนทุก 30 วินาที
│   ├── security-admin-api.service  # API บริหารจัดการ Dashboard และปลดบล็อก IP (OTP)
│   ├── security-archive.service    # บีบอัดและจัดเก็บ Log ประจำวัน
│   └── security-archive.timer      # ทำงานอัตโนมัติทุกวันเวลา 02:30 น.
└── environment/
    └── .env.example                # แม่แบบตั้งค่า Environment สำหรับ Security AI Pipeline
```

---

## 📑 สรุปการทำงานแต่ละส่วนตามเล่มรายงาน

1. **Nginx Reverse Proxy & Rate Limiting (หัวข้อ 3.9):**
   - แยก Nginx Frontend (HTTPS:443) และ Backend (127.0.0.1:8080) เพื่อซ่อน Backend ไม่ให้ออกสู่อินเทอร์เน็ต
   - กำหนด Rate Limit แยกตามประเภท Endpoint (Website 8 req/s, Login 10 req/m, Admin 12 req/s)
   - ป้องกันการสแกนหาผู้ใช้ (Anti-User Enumeration) บล็อก `?author=` และ `rest_route=/wp/v2/users`
2. **SSH Hardening & TOTP MFA (หัวข้อ 3.7):**
   - ปิด Root Login และ Password Authentication
   - บังคับ 2FA (AuthenticationMethods: `publickey,keyboard-interactive`) ร่วมกับ `pam_google_authenticator.so`
3. **Firewall & Geo-Blocking (หัวข้อ 3.8):**
   - ใช้ `ipset` ร่วมกับ `iptables` อนุญาตเฉพาะ IP ประเทศไทย (THAILAND Hash:Net)
   - มีชุด `security_permanent_v4` และ `security_cooldown_v4` สำหรับบล็อก IP ที่ถูกตรวจพบการโจมตีทันที
4. **Automation via systemd (หัวข้อ 3.12 - 3.15):**
   - รัน Pipeline วิเคราะห์พฤติกรรมผ่าน Google Gemini API แบบเรียลไทม์ทุก 5 วินาที
   - แยกระบบ Enforcer บังคับใช้ไฟร์วอลล์เพื่อความน่าเชื่อถือสูง
