# Lil Link
### A shortlink system built on Cloudflare workers

<a href="https://get.lillink.co">Website</a> - Hosted version coming soon

<a href="https://lillink.co">Live Demo</a>

Before deploying you'll need to put your info into the `zone_id`, `account_id`, `route`, and `[[kv-namespaces]]` sections of `wrangler.toml` To deploy with Wrangler, you'll need at least version 1.2.0.

This requires 2 Workers KV Namespaces, mapped to `SHORTLINKS` and `HITS`.
The shortlink is currently used as the key for both. 

HITS currently doesn't display data anywhere but collects hit counts for future usage.


| Namespace  |    Key    |     Value |
| :--------- | :-------: | --------: |
| SHORTLINKS | shortlink |       url |
| HITS       | shortlink | hit count |


This version adds support for handling KV Namespaces via Wrangler.  

## Configuration and Deployment
1. Run `git clone https://github.com/eldridgea/lil-link`
2. Create 2 KV Namespaces in the Cloudflare Dashboard or via their API.
3. Fill out the  `zone_id`, `account_id`.
4. Fill out the `route` section of `wrangler.toml` with `https://example.com/*`, replacing "example.com" with your domain. 
5. Paste one of your newly created KV Namespace IDs into `wrangler.toml` under `SHORTLINKS` and the other under `HITS`
6. `cd` into the lil-link directory and run `wrangler publish --release`

*Note: I have been unable to get Workers run unless there is already an active DNS record in the Cloudflare dashboard. I have an A record for `@` on lillink.co pointing to a server I control, but as my route is set to `https://lillink.co/*` supposedly the server will never be contacted as Workers will intercept all requests.*
