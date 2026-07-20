# DNS as code — Route 53

Terraform for the `damienfarrar.com` hosted zone (already in Route 53),
covering exactly what must change at cutover (plan §7 Phase 6 / §9):

- A/CNAME records pointing the apex + `www` at Vercel
- Resend sending-domain records (SPF, DKIM, MX) via `var.resend_records` —
  values come from the Resend dashboard after the domain is added there
- Legacy `api.` records are deliberately absent; removing them from the
  zone is a launch-checklist step

## Cutover runbook

1. Decide the state backend (plan §10: S3 vs Terraform Cloud free tier),
   uncomment/configure `backend` in `main.tf`. State never goes in git.
2. Add the domain in Resend, then `cp terraform.tfvars.example
   terraform.tfvars` and fill in the records it shows. The real file is
   gitignored (`*.tfvars`); only the `.example` template commits.
3. `terraform init && terraform plan` with AWS credentials for the zone's
   account — review that the plan only touches the records above.
4. `terraform apply`, verify the site and email deliverability, then
   remove the legacy `api.` records and decommission the old backend.
