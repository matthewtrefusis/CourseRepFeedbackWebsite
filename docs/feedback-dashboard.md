# Course rep feedback dashboard

The dashboard is available at `/dashboard`. Its API requires a valid Cloudflare Access JWT and an email in the Worker `REP_EMAILS` secret. The feedback API has no public read route and fails closed until its Access settings are configured.

## Configure Cloudflare Access

1. The Worker needs a hostname before Access can protect it. If it has not been deployed yet, run `npm run deploy` from the project folder to publish it and note its hostname. This also makes anonymous feedback submissions live; the dashboard API remains closed until the Access secrets below are set.
2. In the Cloudflare dashboard, open **Zero Trust** > **Access** > **Applications** > **Create new application** > **Self-hosted and private**. Add both path entries to the same application (a `workers.dev` hostname is supported):
   - `/dashboard*`
   - `/api/rep/feedback*`
   Use an Allow policy listing only the course reps. Do not protect `/api/feedback`; students need this public POST route to submit feedback.
3. To let reps sign in with email codes, go to **Zero Trust** > **Integrations** > **Identity providers** > **Add new identity provider** > **One-time PIN**. Then edit the application and enable One-time PIN as a login method.
4. Copy the Access team's domain (`https://<team-name>.cloudflareaccess.com`) and this application's Audience (AUD) tag.
5. From the project folder, set the Worker secrets:

   ```powershell
   npx wrangler secret put ACCESS_TEAM_DOMAIN
   npx wrangler secret put ACCESS_AUD
   npx wrangler secret put REP_EMAILS
   ```

   Enter the team domain, application's AUD tag, and a comma-separated list of the exact rep email addresses when prompted. Keep these out of source control.

6. Run `npm run deploy` again to publish the final setup. Share `https://<worker-hostname>/dashboard` with the reps.

The Worker independently verifies the Access token's signature, issuer, audience, expiry, and email allowlist before reading submissions. Dashboard results are paginated and are not cached by the browser or API.
