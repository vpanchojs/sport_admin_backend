export interface EResponse<T> {
    code: number
    message?: string
    data?: T
}