# 🧠 Quiz App Hosting Guide: S3 + CloudFront + Route 53

Complete end-to-end guide for hosting the AI Quiz App on AWS with static site hosting, global CDN, and custom domain.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Services Used & Why](#services-used--why)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [S3 Configuration](#s3-configuration)
6. [CloudFront Setup](#cloudfront-setup)
7. [DNS Configuration](#dns-configuration)
8. [SSL Certificate](#ssl-certificate)
9. [Monitoring](#monitoring)
10. [Cost Analysis](#cost-analysis)
11. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
User accesses quiz.obaidinfo.xyz or kwiz.obaidinfo.xyz
         ↓
Route 53 DNS Resolution
         ↓
CloudFront CDN (150+ edge locations)
         ↓
S3 Bucket Static Content
         ↓
┌─────────────────────────────────┐
│  Application Files:             │
│  ├─ index.html                  │
│  ├─ script.js                   │
│  ├─ style.css                   │
│  └─ Assets                      │
└─────────────────────────────────┘
         ↓
Google Gemini API (AI Generation)
         ↓
Quiz displayed to user ✨
```

---

## 🛠️ Services Used & Why

### 1. **AWS S3** (Storage)
- **Cost**: FREE tier (5GB storage)
- **Why**: Durable, scalable, perfect for static sites
- **Features**: Static website hosting, versioning, lifecycle policies

### 2. **AWS CloudFront** (CDN)
- **Cost**: FREE tier (50GB transfer/month)
- **Why**: Global distribution, faster load times, DDoS protection
- **Features**: 150+ edge locations, SSL termination, compression

### 3. **Route 53** (DNS)
- **Cost**: $0.50/month
- **Why**: Domain management, health checks, failover
- **Features**: Custom domains, alias records, traffic policies

### 4. **AWS Certificate Manager** (SSL)
- **Cost**: FREE
- **Why**: Auto-renewing certificates, no management needed
- **Features**: Wildcard support, DNS validation, auto-renewal

### 5. **Google Gemini API** (AI)
- **Cost**: FREE (60 requests/minute)
- **Why**: AI question generation, fast responses
- **Features**: JSON structured output, streaming, reliable

---

## 📋 Prerequisites

1. **AWS Account** - [aws.amazon.com](https://aws.amazon.com)
2. **Domain Name** - quiz.obaidinfo.xyz, kwiz.obaidinfo.xyz
3. **Git** installed locally
4. **S3 command line** (optional)

---

## 🚀 Step-by-Step Deployment

### **PHASE 1: Repository Setup**

```bash
# Clone repository
git clone https://github.com/ObaidAbdullah16/Quiz-App.git
cd Quiz-App

# Verify files
ls -la
# Should show: index.html, script.js, style.css, README.md
```

### **PHASE 2: S3 Bucket Creation**

1. **Create S3 Bucket**
   - AWS Console → S3 → Create bucket
   - Bucket name: `quiz-app-obaid-production`
   - Region: us-east-1 (for CloudFront)
   - Uncheck "Block all public access"
   - Create bucket

2. **Enable Static Website Hosting**
   ```
   Properties → Static website hosting → Edit
   Enable
   Index document: index.html
   Error document: index.html (for SPA routing)
   Save
   ```

3. **Upload Files**
   ```bash
   # Using AWS CLI
   aws s3 sync ./ s3://quiz-app-obaid-production \
     --exclude "README.md" \
     --exclude ".git" \
     --exclude "node_modules"
   
   # Or drag-and-drop in console
   ```

4. **Set Bucket Policy** (Make public)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::quiz-app-obaid-production/*"
       }
     ]
   }
   ```

### **PHASE 3: CloudFront Distribution**

1. **Create Distribution**
   - AWS Console → CloudFront → Create distribution
   - Origin domain: Your S3 bucket endpoint
   - Origin path: (leave empty)
   - Protocol: HTTP only

2. **Viewer Protocol Policy**
   - Select: "Redirect HTTP to HTTPS"

3. **Caching Settings**
   - Cache policy: Default (with compression)
   - Compress objects: Yes
   - Default root object: index.html

4. **Alternate Domain Names**
   ```
   quiz.obaidinfo.xyz
   kwiz.obaidinfo.xyz
   ```

5. **SSL Certificate**
   - Select your ACM certificate
   - Must be in us-east-1 region

6. **Create Distribution** (takes 10-15 minutes)

### **PHASE 4: Certificate Setup**

1. **In AWS Certificate Manager (us-east-1)**

2. **Request Certificate**
   - Public certificate
   - Add domain names:
     ```
     quiz.obaidinfo.xyz
     kwiz.obaidinfo.xyz
     ```

3. **DNS Validation**
   - Choose DNS validation
   - Create records in Route 53
   - Wait for validation (5-10 minutes)

### **PHASE 5: Route 53 DNS Configuration**

1. **Create Primary A Record** (quiz)
   ```
   Record name: quiz
   Type: A (Alias)
   Alias target: Your CloudFront domain
   Routing: Simple
   ```

2. **Create Secondary A Record** (kwiz)
   ```
   Record name: kwiz
   Type: A (Alias)
   Alias target: Your CloudFront domain
   Routing: Simple
   ```

3. **Test DNS**
   ```bash
   nslookup quiz.obaidinfo.xyz
   nslookup kwiz.obaidinfo.xyz
   
   # Both should return CloudFront domain
   ```

### **PHASE 6: Verification**

```bash
# Test HTTPS connection
curl -I https://quiz.obaidinfo.xyz
# Should show: HTTP/2 200

# Test alternative URL
curl -I https://kwiz.obaidinfo.xyz
# Should also work

# Test application
curl https://quiz.obaidinfo.xyz | grep -i "AI Quiz App"
```

---

## 💾 S3 Configuration

### Bucket Structure

```
s3://quiz-app-obaid-production/
├── index.html              (Served directly)
├── script.js               (Served directly)
├── style.css               (Served directly)
└── assets/                 (Optional folder)
```

### Cache Control Headers

```bash
# For HTML (no cache)
aws s3 cp index.html s3://quiz-app-obaid-production/index.html \
  --metadata-directive REPLACE \
  --cache-control "no-cache, no-store, must-revalidate"

# For CSS/JS (cache 1 year)
aws s3 cp script.js s3://quiz-app-obaid-production/script.js \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=31536000"
```

### Versioning

```bash
# Enable versioning (automatic backup)
# S3 Console → Bucket → Versioning → Enable
# Allows rollback to previous versions
```

---

## 🚀 CloudFront Configuration

### Invalidation

When you update files:

```bash
# Option 1: CloudFront Console
# CloudFront → Invalidations → Create invalidation
# Path: /*
# Wait 2-3 minutes for cache clear

# Option 2: AWS CLI
aws cloudfront create-invalidation \
  --distribution-id <YOUR_DISTRIBUTION_ID> \
  --paths "/*"
```

### Performance

```bash
# View cache statistics
# CloudFront Console → Monitoring
# - Requests: Total requests
# - Data transfer: GB downloaded
# - Cache hit ratio: Aim for 90%+
```

---

## 🌐 DNS Configuration

### Route 53 Records

```
Zone: obaidinfo.xyz
TTL: 300

quiz A Record:
  Name: quiz
  Type: A (Alias)
  Target: CloudFront domain

kwiz A Record:
  Name: kwiz
  Type: A (Alias)
  Target: CloudFront domain
```

### Verify DNS

```bash
# Check resolution
dig quiz.obaidinfo.xyz
dig kwiz.obaidinfo.xyz

# Should return CloudFront IP
```

---

## 🔒 SSL Certificate

**Certificate Details:**
- Type: Public (Free)
- Domains:
  - quiz.obaidinfo.xyz
  - kwiz.obaidinfo.xyz
- Issuer: Amazon RSA 2048 M01
- Validation: DNS
- Renewal: Automatic (30 days before expiry)
- Cost: FREE

---

## 📊 Monitoring

### CloudFront Metrics

```bash
# View in CloudFront Console → Monitoring
# - Requests per second
# - Data transfer per second
# - 4xx/5xx error rates
# - Cache hit ratio
```

### S3 Metrics

```bash
# View in S3 Console → Metrics
# - Number of objects
# - Total storage size
# - Requests made
```

### Application Logs

```bash
# Enable CloudFront logging
# CloudFront → Logging → Edit
# S3 bucket: Create dedicated bucket
# Wait 30 minutes for logs to appear

# Logs show:
# - Request timestamps
# - Viewer IP addresses
# - Request methods
# - Status codes
```

---

## 💰 Cost Analysis

| Service | Usage | Cost |
|---------|-------|------|
| S3 Storage | <5GB | FREE* |
| S3 Requests | ~1000/month | FREE* |
| CloudFront | <50GB transfer | FREE* |
| Route 53 | 1 hosted zone | $0.50 |
| SSL Cert | Let's Encrypt | FREE |
| **Total** | | **~$0.50/month** |

*After 12 months:

| Service | Cost |
|---------|------|
| S3 Storage | $0.023 per GB |
| S3 Requests | $0.0007 per 10k |
| CloudFront | $0.085 per GB |
| Route 53 | $0.50 |
| **Total** | **~$1-2/month** |

---

## 🔧 Troubleshooting

### Issue: "Access Denied" when uploading

```bash
# Check bucket policy
# S3 Console → Permissions → Bucket policy
# Verify you can write to bucket

# Or grant via ACL
aws s3api put-bucket-acl --bucket quiz-app-obaid-production --acl private
```

### Issue: Website shows old version

```bash
# Clear CloudFront cache
# Option 1: Console → Invalidations → Create
# Option 2: CLI command (see above)

# Or hard refresh browser
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Issue: "Not Secure" warning

```bash
# Wait 10-15 minutes for CloudFront deployment
# Check certificate is "Issued" in ACM
# Try different browser

# Verify:
openssl s_client -connect quiz.obaidinfo.xyz:443 < /dev/null
```

### Issue: DNS not resolving

```bash
# Check Route 53 records
# AWS Console → Route 53 → Hosted zones → obaidinfo.xyz
# Verify A records point to CloudFront

# Test resolution
nslookup quiz.obaidinfo.xyz

# Wait 5 minutes for TTL
```

### Issue: Gemini API errors

```bash
# Check API key in browser console (F12)
# Verify key is valid at Google AI Studio
# Check rate limits (60 requests/minute)

# For debugging:
# Open DevTools → Console tab
# Try generating a quiz manually
# Check error message
```

---

## 📈 Performance Optimization

### File Optimization

```bash
# Minify CSS
# Minify JavaScript
# Tools:
# - TinyCSS (online)
# - UglifyJS (CLI)

# Keep files small:
# - JavaScript: <50KB
# - CSS: <20KB
# - HTML: <10KB
```

### Browser Caching

```bash
# Set cache headers in S3
# HTML: no-cache (always fresh)
# CSS/JS: 1 year (never changes)
# Images: 1 month
```

### CloudFront Optimization

```bash
# Compression: Enabled (automatic)
# Should be <10KB compressed
# Verify with curl:

curl -H "Accept-Encoding: gzip" -I https://quiz.obaidinfo.xyz
# Check: Content-Encoding: gzip
```

---

## 📝 Maintenance Checklist

### Daily
- [ ] Website accessible at quiz.obaidinfo.xyz
- [ ] Website accessible at kwiz.obaidinfo.xyz
- [ ] HTTPS working (green lock)
- [ ] Quiz generation working

### Weekly
- [ ] Check CloudFront cache hit ratio
- [ ] Review error logs
- [ ] Test with Google Gemini API

### Monthly
- [ ] Review AWS charges
- [ ] Check certificate expiry
- [ ] Update API configuration if needed

### Quarterly
- [ ] Review CloudFront metrics
- [ ] Optimize slow resources
- [ ] Update content/features
- [ ] Test disaster recovery

---

## 📚 Resources

- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [CloudFront Guide](https://docs.aws.amazon.com/cloudfront/)
- [Route 53 Docs](https://docs.aws.amazon.com/route53/)
- [Google Gemini API](https://ai.google.dev/)

---

**Last Updated:** May 27, 2026  
**Status:** ✅ Production Ready  
**Cost:** ~$0.50/month  
**Domains:** quiz.obaidinfo.xyz, kwiz.obaidinfo.xyz
