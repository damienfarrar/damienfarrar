# DNS as code — Route 53

Terraform for the `damienfarrar.com` hosted zone (zone ID `ZN85FW20IKMGU`,
already in Route 53), covering exactly what changes at cutover
(plan §7 Phase 6 / §9):

- apex `A` and `www` `CNAME` pointing at Vercel
- Resend sending-domain records (DKIM, SPF, bounce MX, DMARC) via
  `var.resend_records` — values from the Resend dashboard, kept in the
  gitignored `terraform.tfvars` (template: `terraform.tfvars.example`)

Everything else in the zone — `NS`, `SOA`, the apex Google Workspace `MX`
(inbound mail), and the legacy records under cleanup below — is left
untouched by Terraform.

## Before you can apply

1. **The site is live on Vercel.** `rebuild/next` (with the Dispatch
   design merged) deployed to the Vercel production project, and
   `damienfarrar.com` + `www.damienfarrar.com` added as domains there.
   Pointing DNS at Vercel before the deploy exists is downtime.
2. **Resend domain added** and `terraform.tfvars` populated — done; all
   four records are in it.
3. **Terraform >= 1.9** installed and **AWS credentials** for the account
   that owns the hosted zone (Route 53 write on the zone).
4. **State backend decided** (plan §10: S3 bucket vs Terraform Cloud free
   tier) and set in `main.tf` (the commented `backend` block). Local
   state works for a one-shot but is easy to lose; `*.tfstate*` is
   gitignored either way.

## Cutover

5. `terraform init`
6. `terraform plan` — confirm it only:
   - **modifies** the apex `A` (old S3 alias → `76.76.21.21`)
   - **creates** `www` `CNAME` and the four Resend records
     (`resend._domainkey`, `send` TXT, `send` MX, `_dmarc`)

   It must NOT show changes to `NS`, `SOA`, or the apex `MX`.

7. **Delete the old `www` record by hand** in the Route 53 console:
   `www.damienfarrar.com` `A` (alias → `*.cloudfront.net`). Route 53
   refuses a `CNAME` where an `A` of the same name exists, so `apply`
   can't upsert it (`allow_overwrite` only covers same-type changes, like
   the apex). Do this right before apply to keep the `www` gap short —
   the apex is unaffected.
8. `terraform apply`
9. In Resend, click **Verify** once the records propagate (minutes to
   ~1 h). Then send a real message through `/api/contact` and confirm it
   arrives and passes SPF / DKIM / DMARC.

## Post-cutover cleanup (decommission the old stack)

Once the new site and email are confirmed, delete these by hand in the
Route 53 console — none are managed by Terraform:

- `api.damienfarrar.com` `A` (alias → `djt2vmnpjqrbn.cloudfront.net`) —
  old API, no equivalent in the new stack
- `_amazonses.damienfarrar.com` `TXT` — old SES domain-identity token
- the three `*.dkim.amazonses.com` `CNAME` records
  (`2sjnrxwyv5…`, `4jwlio3knzt5…`, `bxhyy6ci7…`) — old SES DKIM

Then, outside DNS: remove the old SES identity in the SES console, and
tear down the old S3 site bucket, the two CloudFront distributions
(apex + `api`), and the old API backend.
