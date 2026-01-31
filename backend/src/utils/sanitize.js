// Input sanitization utilities

export function sanitizeString(input, maxLength = 10000) {
    if (typeof input !== 'string') {
        return '';
    }

    // Trim and limit length
    let sanitized = input.trim().slice(0, maxLength);

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    return sanitized;
}

export function sanitizeObject(obj, allowedKeys) {
    if (typeof obj !== 'object' || obj === null) {
        return {};
    }

    const sanitized = {};
    for (const key of allowedKeys) {
        if (obj.hasOwnProperty(key)) {
            sanitized[key] = obj[key];
        }
    }

    return sanitized;
}

export function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

export function isValidLanguage(lang) {
    return ['EN', 'HI'].includes(lang);
}

export function isValidMode(mode) {
    return ['LISTEN', 'REFLECT', 'CALM'].includes(mode);
}
