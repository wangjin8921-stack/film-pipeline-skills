from pathlib import Path
import json
import shutil


SUFFIX = ".bak-codex-20260316"


def backup_once(path: Path) -> None:
    backup = path.with_name(path.name + SUFFIX)
    if not backup.exists():
        shutil.copy2(path, backup)


def patch_executor(path: Path) -> None:
    old = '      scopes: ["operator.admin", "operator.approvals", "operator.pairing"],\n'
    new = '      scopes: ["operator.admin", "operator.approvals", "operator.pairing", "operator.read", "operator.write"],\n'
    text = path.read_text(encoding="utf-8")
    if old not in text:
        raise RuntimeError(f"executor snippet not found in {path}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


def patch_client(path: Path) -> None:
    text = path.read_text(encoding="utf-8")

    import_old = """import { v4 as uuidv4 } from "uuid";
import {
  ClientFactory,
  ClientFactoryOptions,
  DefaultAgentCardResolver,
  JsonRpcTransportFactory,
  RestTransportFactory,
  createAuthenticatingFetchWithRetry,
  type AuthenticationHandler,
  type HttpHeaders,
} from "@a2a-js/sdk/client";
"""
    import_new = """import { v4 as uuidv4 } from "uuid";
import { fetchWithSsrFGuard, type SsrFPolicy } from "openclaw/plugin-sdk";
import {
  ClientFactory,
  ClientFactoryOptions,
  DefaultAgentCardResolver,
  JsonRpcTransportFactory,
  RestTransportFactory,
  createAuthenticatingFetchWithRetry,
  type AuthenticationHandler,
  type HttpHeaders,
} from "@a2a-js/sdk/client";
"""
    if import_old not in text:
        raise RuntimeError(f"client import block not found in {path}")
    text = text.replace(import_old, import_new, 1)

    parse_old = """function parseAgentCardUrl(agentCardUrl: string): { baseUrl: string; path: string } {
  const parsed = new URL(agentCardUrl);
  return {
    baseUrl: parsed.origin,
    path: parsed.pathname,
  };
}

export class A2AClient {
"""
    parse_new = """function parseAgentCardUrl(agentCardUrl: string): { baseUrl: string; path: string } {
  const parsed = new URL(agentCardUrl);
  return {
    baseUrl: parsed.origin,
    path: parsed.pathname,
  };
}

function buildPeerSsrfPolicy(peer: PeerConfig): SsrFPolicy | undefined {
  const hostname = new URL(peer.agentCardUrl).hostname.trim();
  if (!hostname) {
    return undefined;
  }

  return { allowedHostnames: [hostname] };
}

async function guardedPeerFetch(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  policy: SsrFPolicy | undefined,
): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  const { response } = await fetchWithSsrFGuard({
    url,
    init,
    fetchImpl: fetch,
    policy,
  });
  return response;
}

export class A2AClient {
"""
    if parse_old not in text:
        raise RuntimeError(f"client parse block not found in {path}")
    text = text.replace(parse_old, parse_new, 1)

    build_old = """  private buildFactory(peer: PeerConfig): { factory: ClientFactory; path: string } {
    const { baseUrl: _baseUrl, path } = parseAgentCardUrl(peer.agentCardUrl);
    const authHandler = createAuthHandler(peer);

    // Wrap global fetch with auth headers if configured
    const authFetch = authHandler
      ? createAuthenticatingFetchWithRetry(fetch, authHandler)
      : fetch;

    // Inject auth fetch into card resolver and all transports
    const options = ClientFactoryOptions.createFrom(ClientFactoryOptions.default, {
      cardResolver: new DefaultAgentCardResolver({ fetchImpl: authFetch }),
      transports: [
        new JsonRpcTransportFactory({ fetchImpl: authFetch }),
        new RestTransportFactory({ fetchImpl: authFetch }),
        new GrpcTransportFactory(),
      ],
    });

    return { factory: new ClientFactory(options), path };
  }
"""
    build_new = """  private buildFactory(peer: PeerConfig): { factory: ClientFactory; path: string; fetchImpl: typeof fetch } {
    const { baseUrl: _baseUrl, path } = parseAgentCardUrl(peer.agentCardUrl);
    const authHandler = createAuthHandler(peer);
    const ssrfPolicy = buildPeerSsrfPolicy(peer);

    const peerFetch: typeof fetch = async (input, init) =>
      await guardedPeerFetch(input, init, ssrfPolicy);

    // Wrap guarded fetch with auth headers if configured
    const authFetch = authHandler
      ? createAuthenticatingFetchWithRetry(peerFetch, authHandler)
      : peerFetch;

    // Inject auth fetch into card resolver and all transports
    const options = ClientFactoryOptions.createFrom(ClientFactoryOptions.default, {
      cardResolver: new DefaultAgentCardResolver({ fetchImpl: authFetch }),
      transports: [
        new JsonRpcTransportFactory({ fetchImpl: authFetch }),
        new RestTransportFactory({ fetchImpl: authFetch }),
        new GrpcTransportFactory(),
      ],
    });

    return { factory: new ClientFactory(options), path, fetchImpl: authFetch };
  }
"""
    if build_old not in text:
        raise RuntimeError(f"client buildFactory block not found in {path}")
    text = text.replace(build_old, build_new, 1)

    discover_old = """  async discoverAgentCard(peer: PeerConfig): Promise<Record<string, unknown>> {
    const { baseUrl, path } = parseAgentCardUrl(peer.agentCardUrl);
    const { factory } = this.buildFactory(peer);

    // createFromUrl resolves the card internally
    await factory.createFromUrl(baseUrl, path);

    // Re-fetch the card for the return value (lightweight)
    const authHandler = createAuthHandler(peer);
    const headers: Record<string, string> = authHandler
      ? (await authHandler.headers()) as Record<string, string>
      : {};

    const response = await fetch(`${baseUrl}${path}`, {
      headers,
      signal: AbortSignal.timeout(30_000),
    });
"""
    discover_new = """  async discoverAgentCard(peer: PeerConfig): Promise<Record<string, unknown>> {
    const { baseUrl, path } = parseAgentCardUrl(peer.agentCardUrl);
    const { factory, fetchImpl } = this.buildFactory(peer);

    // createFromUrl resolves the card internally
    await factory.createFromUrl(baseUrl, path);

    // Re-fetch the card for the return value (lightweight)
    const authHandler = createAuthHandler(peer);
    const headers: Record<string, string> = authHandler
      ? (await authHandler.headers()) as Record<string, string>
      : {};

    const response = await fetchImpl(`${baseUrl}${path}`, {
      headers,
      signal: AbortSignal.timeout(30_000),
    });
"""
    if discover_old not in text:
        raise RuntimeError(f"client discover block not found in {path}")
    text = text.replace(discover_old, discover_new, 1)

    path.write_text(text, encoding="utf-8")


def patch_config(path: Path) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    data.setdefault("gateway", {}).setdefault("nodes", {}).setdefault("browser", {})["mode"] = "auto"
    profiles = data.setdefault("browser", {}).setdefault("profiles", {})
    profiles.pop("pc-chrome", None)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    executor_path = Path("/tmp/a2a-gateway/src/executor.ts")
    client_path = Path("/tmp/a2a-gateway/src/client.ts")
    config_path = Path("/vol1/docker/volumes/openclaw_data/_data/openclaw.json")

    for path in (executor_path, client_path, config_path):
        backup_once(path)

    patch_executor(executor_path)
    patch_client(client_path)
    patch_config(config_path)
    print("patched nas openclaw")


if __name__ == "__main__":
    main()
