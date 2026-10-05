/* Global "already gifted" claims stored in Upstash Redis.
   Each claim records the registered guest name that marked the gift.

   On Vercel, install the Upstash Redis integration (Storage -> Marketplace)
   and these env vars are injected automatically:
     KV_REST_API_URL / KV_REST_API_TOKEN
   Upstash-direct names also work:
     UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN

   GET  /api/claims -> { claims: { giftId: "Guest Name", ... } }
   POST /api/claims { id, action, name }
     action: "claim" | "release"
     403 when the name is not in the registered guest list (GUESTS in js/data.js)
     403 when releasing a claim owned by a different guest
     409 when the gift was just claimed by someone else
*/

const HASH_KEY = "wg:claims";

let GUESTS = [];
try {
  const data = require("../js/data.js");
  GUESTS = Array.isArray(data.GUESTS) ? data.GUESTS : [];
} catch (err) {
  GUESTS = [];
}

function normalizeName(value) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim().toLowerCase();
}

function resolveGuest(value) {
  const key = normalizeName(value);
  if (!key) return null;
  const match = GUESTS.filter(function (g) { return normalizeName(g) === key; })[0];
  if (match) return match;
  /* If the guest list could not be loaded, keep the site working and accept
     any non-empty name instead of locking everyone out. */
  if (GUESTS.length === 0) return String(value).replace(/\s+/g, " ").trim();
  return null;
}

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token: token };
}

async function pipeline(config, commands) {
  const res = await fetch(config.url + "/pipeline", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + config.token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commands)
  });
  if (!res.ok) throw new Error("Redis HTTP " + res.status);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected Redis response");
  return data.map(function (entry) {
    if (entry && entry.error) throw new Error(entry.error);
    return entry && "result" in entry ? entry.result : null;
  });
}

function hashToClaims(value) {
  const claims = {};
  if (Array.isArray(value)) {
    for (let i = 0; i + 1 < value.length; i += 2) claims[value[i]] = value[i + 1] || true;
  } else if (value && typeof value === "object") {
    Object.keys(value).forEach(function (key) { claims[key] = value[key] || true; });
  }
  return claims;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const config = redisConfig();
  if (!config) {
    res.status(503).json({ error: "storage_not_configured" });
    return;
  }

  try {
    if (req.method === "GET") {
      const results = await pipeline(config, [["HGETALL", HASH_KEY]]);
      res.status(200).json({ claims: hashToClaims(results[0]) });
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      const id = String(body.id || "").trim();
      const action = body.action === "release" ? "release" : "claim";

      if (!/^[a-z0-9-]{1,120}$/i.test(id)) {
        res.status(400).json({ error: "invalid_gift_id" });
        return;
      }

      const guest = resolveGuest(body.name);
      if (!guest) {
        res.status(403).json({ error: "name_not_registered" });
        return;
      }

      if (action === "claim") {
        const results = await pipeline(config, [
          ["HSETNX", HASH_KEY, id, guest],
          ["HGETALL", HASH_KEY]
        ]);
        const claims = hashToClaims(results[1]);
        if (Number(results[0]) !== 1) {
          /* Already claimed: if it is this same guest (e.g. stale tab),
             treat it as success; otherwise report the conflict. */
          const owner = await pipeline(config, [["HGET", HASH_KEY, id]]);
          if (normalizeName(owner[0]) === normalizeName(guest)) {
            res.status(200).json({ claims: claims });
            return;
          }
          res.status(409).json({ error: "already_claimed", claims: claims });
          return;
        }
        res.status(200).json({ claims: claims });
        return;
      }

      const results = await pipeline(config, [
        ["HGET", HASH_KEY, id],
        ["HGETALL", HASH_KEY]
      ]);
      const claims = hashToClaims(results[1]);
      const owner = results[0];
      if (owner == null) {
        res.status(200).json({ claims: claims });
        return;
      }
      if (normalizeName(owner) !== normalizeName(guest)) {
        res.status(403).json({ error: "not_your_claim", claims: claims });
        return;
      }
      const released = await pipeline(config, [
        ["HDEL", HASH_KEY, id],
        ["HGETALL", HASH_KEY]
      ]);
      res.status(200).json({ claims: hashToClaims(released[1]) });
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    res.status(502).json({ error: "storage_unavailable" });
  }
};
