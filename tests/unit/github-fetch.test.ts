import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLatestCommit } from "@/lib/github/activity";

const commit = [
  {
    sha: "abcdef1234567",
    commit: {
      message: "fix: something\n\nbody",
      committer: { date: "2026-11-04T01:02:03Z" },
    },
  },
];

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function authOf(call: unknown[]): string | undefined {
  const init = call[1] as { headers: Record<string, string> };
  return init.headers.Authorization;
}

describe("GitHub fetch token handling", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends the token when one is set", async () => {
    vi.stubEnv("GITHUB_TOKEN", "good");
    fetchMock.mockResolvedValueOnce(json(200, commit));

    const result = await getLatestCommit();

    expect(result?.sha).toBe("abcdef1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(authOf(fetchMock.mock.calls[0])).toBe("Bearer good");
  });

  it("retries unauthenticated when the token is rejected", async () => {
    vi.stubEnv("GITHUB_TOKEN", "expired");
    fetchMock
      .mockResolvedValueOnce(json(401, { message: "Bad credentials" }))
      .mockResolvedValueOnce(json(200, commit));

    const result = await getLatestCommit();

    expect(result).toEqual({
      sha: "abcdef1",
      message: "fix: something",
      date: "2026-11-04",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(authOf(fetchMock.mock.calls[0])).toBe("Bearer expired");
    expect(authOf(fetchMock.mock.calls[1])).toBeUndefined();
    expect(console.warn).toHaveBeenCalledOnce();
  });

  it("does not retry a 401 when no token was sent", async () => {
    vi.stubEnv("GITHUB_TOKEN", "");
    fetchMock.mockResolvedValueOnce(json(401, {}));

    expect(await getLatestCommit()).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(authOf(fetchMock.mock.calls[0])).toBeUndefined();
  });

  it("does not retry other failures", async () => {
    vi.stubEnv("GITHUB_TOKEN", "good");
    fetchMock.mockResolvedValueOnce(json(403, { message: "rate limited" }));

    expect(await getLatestCommit()).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
