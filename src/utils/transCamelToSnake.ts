export function toSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function transCamelToSnake(input: any): any {
    if (Array.isArray(input)) {
        return input.map(transCamelToSnake);
    }

    if (input && typeof input === 'object') {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [toSnake(key), transCamelToSnake(value)])
        );
    }

    return input;
}
