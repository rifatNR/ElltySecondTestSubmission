export const getAvatarFallback = (name: string): string => {
    const words = name.trim().split(/\s+/);
    const initials =
        words.length > 1
            ? `${words[0][0]}${words[words.length - 1][0]}`
            : words[0][0];
    return initials.toUpperCase();
};
