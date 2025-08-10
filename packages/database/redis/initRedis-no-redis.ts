// 临时禁用 Redis 的版本
export let Redis: any = null;

export function getRedisKey(key: string): string {
    return key;
}

export default function initRedis() {
    console.log('[INFO] Redis 已禁用，使用内存存储替代');
    
    // 创建一个简单的内存存储替代 Redis
    const memoryStore = new Map();
    
    Redis = {
        get: async (key: string) => {
            return memoryStore.get(key) || null;
        },
        set: async (key: string, value: any, mode?: string, duration?: number) => {
            memoryStore.set(key, value);
            if (duration) {
                setTimeout(() => {
                    memoryStore.delete(key);
                }, duration * 1000);
            }
            return 'OK';
        },
        del: async (key: string) => {
            return memoryStore.delete(key) ? 1 : 0;
        },
        exists: async (key: string) => {
            return memoryStore.has(key) ? 1 : 0;
        },
        expire: async (key: string, seconds: number) => {
            if (memoryStore.has(key)) {
                setTimeout(() => {
                    memoryStore.delete(key);
                }, seconds * 1000);
                return 1;
            }
            return 0;
        },
        incr: async (key: string) => {
            const current = parseInt(memoryStore.get(key) || '0', 10);
            const newValue = current + 1;
            memoryStore.set(key, newValue.toString());
            return newValue;
        }
    };
    
    return Redis;
}