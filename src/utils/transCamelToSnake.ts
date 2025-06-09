export function toCamel(key: string): string {
    return key.replace(/([-_][a-z])/gi, $1 => $1.toUpperCase().replace(/[-_]/g, ''));
}

export function transCamelToSnake(input: any): any {
    if (Array.isArray(input)) {
        return input.map(transCamelToSnake);
    }

    if (input && typeof input === 'object') {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [toCamel(key), transCamelToSnake(value)])
        );
    }

    return input;
}
