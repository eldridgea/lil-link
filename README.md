# Lil Link
### A shortlink system built on Cloudflare workers

<a href="https://get.lillink.co">Website</a>

<a href="https://lillink.co">Live Demo</a>

Before deploying you'll need to put your info into the `zone_id`, `account_id`, and `route` sections of `wrangler.toml`

Requires 2 Workers KV Namespaces, currently hardcoded as `SHORTLINKS` and `HITS`.
The shortlink is currently used as the key for both.

HITS currently doesn't display data anywhere but collects hit counts for future usage.


| Namespace  |    Key    |     Value |
| :--------- | :-------: | --------: |
| SHORTLINKS | shortlink |       url |
| HITS       | shortlink | hit count |


Currently the KV Namespaces must be setup and connected to this script manually. There is currently a 
<a href="https://github.com/cloudflare/wrangler/tree/feat-better-kv">feature branch</a> of the <a href="https://github.com/cloudflare/wrangler">wrangler tool</a> that supports configuring this in the wrangler.toml file. Once this has been merged to `master` I'll be integrating it into this.
