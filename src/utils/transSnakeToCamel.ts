export function toCamel(key: string): string {
    return key.replace(/([-_][a-z])/gi, match => match.toUpperCase().replace(/[-_]/g, ''));
}

export function transSnakeToCamel(input: any): any {
    if (Array.isArray(input)) {
        return input.map(transSnakeToCamel);
    }

    if (input && typeof input === 'object') {
        return Object.fromEntries(
            Object.entries(input).map(([key, value]) => [toCamel(key), transSnakeToCamel(value)])
        );
    }

    return input;
}
