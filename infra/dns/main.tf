# DNS as code for damienfarrar.com (zone already lives in Route 53).
# Small on purpose: records that must change at cutover, nothing else.
# Apply happens at launch — see README.md in this directory.

terraform {
  required_version = ">= 1.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # State backend decided at cutover (plan §10): S3 vs Terraform Cloud free
  # tier. State is never committed to git either way.
  # backend "s3" {}
}

provider "aws" {
  # Route 53 is global; the region only scopes the API endpoint.
  region = "us-east-1"
}

data "aws_route53_zone" "main" {
  name = var.zone_name
}

# --- Vercel ------------------------------------------------------------
# Values are the ones the Vercel project's Domains tab shows for this
# project (Vercel is rolling its IP range forward; the older 76.76.21.21 /
# cname.vercel-dns.com still resolve, but matching the dashboard is what
# clears "Invalid Configuration" and issues the cert first try). The www
# CNAME target is project-specific — re-check it if the project is ever
# recreated.
#
# allow_overwrite: the apex A already exists (alias -> old S3 site) and is
# the same type, so apply replaces it in place. The www record is a TYPE
# change (A alias -> CNAME), which Route 53 will not do as an upsert — the
# old www A record must be deleted by hand first (see README cutover step 4).

resource "aws_route53_record" "apex" {
  zone_id         = data.aws_route53_zone.main.zone_id
  name            = var.zone_name
  type            = "A"
  ttl             = 300
  records         = ["216.198.79.1"] # Vercel
  allow_overwrite = true
}

resource "aws_route53_record" "www" {
  zone_id         = data.aws_route53_zone.main.zone_id
  name            = "www.${var.zone_name}"
  type            = "CNAME"
  ttl             = 300
  records         = ["7732481b2f6863c8.vercel-dns-017.com"] # Vercel (project-specific)
  allow_overwrite = true
}

# --- Resend (sending domain) -------------------------------------------
# Values come from the Resend dashboard after the domain is added there;
# they are passed in as a variable so this file stays value-free.

resource "aws_route53_record" "resend" {
  for_each = { for r in var.resend_records : "${r.type}-${r.name}" => r }

  zone_id = data.aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  records = [each.value.value]
}

# --- Google Workspace (outbound mail auth) ------------------------------
# Inbound MX pre-dates this config and is left alone (see README). SPF and
# DKIM for mail sent *from* Workspace never made it over from the old
# registrar DNS at cutover — added here so outbound mail authenticates
# against the _dmarc policy above. Values from the Workspace admin console
# (Apps > Google Workspace > Gmail > Authenticate email), passed in the
# same value-free way as the Resend records.

resource "aws_route53_record" "google_workspace" {
  for_each = { for r in var.google_workspace_records : "${r.type}-${r.name}" => r }

  zone_id = data.aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  records = [each.value.value]
}

# Legacy api.damienfarrar.com records are intentionally absent: the old
# backend is decommissioned after cutover (plan §9). Removing them from
# state/zone is part of the launch checklist, not this file.
