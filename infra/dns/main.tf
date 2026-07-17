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

resource "aws_route53_record" "apex" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.zone_name
  type    = "A"
  ttl     = 300
  records = ["76.76.21.21"] # Vercel anycast
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.zone_name}"
  type    = "CNAME"
  ttl     = 300
  records = ["cname.vercel-dns.com"]
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

# Legacy api.damienfarrar.com records are intentionally absent: the old
# backend is decommissioned after cutover (plan §9). Removing them from
# state/zone is part of the launch checklist, not this file.
