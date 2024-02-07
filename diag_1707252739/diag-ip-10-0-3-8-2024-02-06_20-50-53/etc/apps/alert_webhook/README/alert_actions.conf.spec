[webhook]

param.user_agent = <string>
* Configure value of the User-Agent header sent to the webhook receiver.

enable_allowlist = <boolean>
* Enables/disables the webhook allow list, which defines the URLs to
  which webhook alert actions can send HTTP POST requests.
* Default: true for cloud and false otherwise

allowlist.<name> = <string>
* A list of endpoints that the webhook action is permitted to query against.
* Each allowlist entry must be prefixed by "allowlist." and will be on its own line.
* Values are regex strings that must match allowed URLs.
* An example allowlist is as follows:
*   allowlist.endpoint1 = ^https:\/\/10\.201\..*
*   allowlist.endpoint2 = ^https:\/\/(.*\.|)company.com\/?.*
*   ...
* NOTE: by default, the allowlist will be enabled.
