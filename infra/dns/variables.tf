variable "zone_name" {
  description = "The Route 53 hosted zone name."
  type        = string
  default     = "damienfarrar.com"
}

variable "resend_records" {
  description = "Sending-domain records from the Resend dashboard: DKIM TXT (resend._domainkey), SPF TXT + bounce MX (send subdomain), and the optional DMARC TXT (_dmarc). Fully-qualified names. Empty until the domain is added in Resend."
  type = list(object({
    name  = string
    type  = string
    value = string
  }))
  default = []
}
