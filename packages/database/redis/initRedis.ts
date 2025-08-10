import logger from '@fiora/utils/logger';

// 创建一个简单的内存存储替代 Redis
const memoryStore = new Map();

export default function initRedis() {
    logger.info('[INFO] Redis 已禁用，使用内存存储替代');
    return null; // 返回 null，但我们会导出实际的函数
}

export async function get(key: string) {
    return memoryStore.get(key) || null;
}

export async function expire(key: string, seconds: number) {
    if (memoryStore.has(key)) {
        setTimeout(() => {
            memoryStore.delete(key);
        }, seconds * 1000);
        return 1;
    }
    return 0;
}

export async function set(key: string, value: string, expireTime = Infinity) {
    memoryStore.set(key, value);
    if (expireTime !== Infinity) {
        setTimeout(() => {
            memoryStore.delete(key);
        }, expireTime * 1000);
    }
}

export async function keys(pattern: string) {
    const allKeys = Array.from(memoryStore.keys());
    if (pattern === '*') return allKeys;
    
    // 简单的模式匹配
    const regex = new RegExp(pattern.replace('*', '.*'));
    return allKeys.filter(key => regex.test(key));
}

export async function has(key: string) {
    return memoryStore.has(key);
}

export function getNewUserKey(userId: string) {
    return `NewUser-${userId}`;
}

export function getNewRegisteredUserIpKey(ip: string) {
    return `NewRegisteredUserIpV2-${ip}`;
}

export function getSealIpKey(ip: string) {
    return `SealIp-${ip}`;
}

export async function getAllSealIp() {
    const allSealIpKeys = await keys('SealIp-*');
    return allSealIpKeys.map((key) => key.replace('SealIp-', ''));
}

export function getSealUserKey(user: string) {
    return `SealUser-${user}`;
}

export async function getAllSealUser() {
    const allSealUserKeys = await keys('SealUser-*');
    return allSealUserKeys.map((key) => key.split('-')[1]);
}

const Minute = 60;
const Hour = Minute * 60;
const Day = Hour * 24;

export const Redis = {
    get,
    set,
    has,
    expire,
    keys,
    Minute,
    Hour,
    Day,
};

export const DisableSendMessageKey = 'DisableSendMessage';
export const DisableNewUserSendMessageKey = 'DisableNewUserSendMessageKey';
