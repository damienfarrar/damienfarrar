variable "zone_name" {
  description = "The Route 53 hosted zone name."
  type        = string
  default     = "damienfarrar.com"
}

variable "resend_records" {
  description = "Sending-domain records from the Resend dashboard (SPF TXT, DKIM TXT, MX on the send subdomain). Empty until the domain is verified there."
  type = list(object({
    name  = string
    type  = string
    value = string
  }))
  default = []
}
