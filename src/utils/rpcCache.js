import { ethers } from "ethers";

/**
 * Global RPC Request Cache
 * Prevents duplicate blockchain calls and implements request deduplication
 */

class RPCCache {
  constructor(ttl = 5000) {
    // 5 seconds default TTL
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.ttl = ttl; // Time to live for cached data in milliseconds
  }

  /**
   * Generate a unique key for the request
   */
  generateKey(method, params) {
    return `${method}:${JSON.stringify(params)}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set data in cache with timestamp
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Execute request with caching and deduplication
   * If same request is pending, wait for it instead of making duplicate call
   */
  async execute(method, params, fetcher) {
    const key = this.generateKey(method, params);

    // Check cache first
    const cached = this.get(key);
    if (cached !== null) {
      console.log(`[RPC Cache] HIT: ${key}`);
      return cached;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      console.log(`[RPC Cache] PENDING: ${key}`);
      return this.pendingRequests.get(key);
    }

    // Execute new request
    console.log(`[RPC Cache] MISS: ${key}`);
    const promise = fetcher()
      .then((result) => {
        this.set(key, result);
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Clear specific keys matching a pattern
   */
  clearPattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Create global instance
export const rpcCache = new RPCCache(10000); // 10 seconds TTL

/**
 * Cached wrapper for contract read calls
 */
export async function cachedContractCall(
  contract,
  method,
  args = [],
  ttl = null
) {
  const cacheKey = `${contract.target}:${method}:${JSON.stringify(args)}`;

  // Use custom TTL if provided
  const effectiveTtl = ttl !== null ? ttl : rpcCache.ttl;
  const tempCache = ttl !== null ? new RPCCache(ttl) : rpcCache;

  return tempCache.execute(
    method,
    { contract: contract.target, args },
    async () => {
      return await contract[method](...args);
    }
  );
}

/**
 * Batch multiple contract calls into a single request
 * This significantly reduces the number of HTTP requests
 */
export async function batchContractCalls(calls) {
  try {
    // Execute all calls in parallel
    const results = await Promise.allSettled(
      calls.map(({ contract, method, args }) =>
        cachedContractCall(contract, method, args)
      )
    );

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return { success: true, data: result.value };
      } else {
        console.error(`Batch call ${index} failed:`, result.reason);
        return { success: false, error: result.reason };
      }
    });
  } catch (error) {
    console.error("Batch contract calls failed:", error);
    throw error;
  }
}

/**
 * Clear cache when user performs actions that change blockchain state
 */
export function invalidateCache(pattern = null) {
  if (pattern) {
    rpcCache.clearPattern(pattern);
  } else {
    rpcCache.clear();
  }
}

export default rpcCache;
