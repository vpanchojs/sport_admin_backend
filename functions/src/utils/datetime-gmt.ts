export const dateTimeGmT = (time: number): number => {
    return time - ((5 * 60) * 60000);
}

export const dateTimeFixedGmt = (time: number): number => {
    return time + ((5 * 60) * 60000);
}