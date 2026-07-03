# DNS as code — Route 53

Terraform for the `damienfarrar.com` hosted zone (already in Route 53).
Written at cutover (plan §7 Phase 6 / §9), covering:

- ALIAS/CNAME records pointing the apex + `www` at Vercel
- Resend sending-domain records (SPF, DKIM)
- Decommission markers for the legacy `api.` records

Open (plan §10): state backend — S3 vs Terraform Cloud free tier. State is
never committed to git.
