/**
 * ErrorCode definition
 *
 * Auth error:      1xx
 *
 * Request error:   4xx
 * Server error:    5xx
 *
 * @export
 * @enum {number}
 */
export enum ErrorCode {
    // VERIFY ERROR
    VERIFY_FAILED = 1,

    // AUTH ERROR
    AUTH_ACCOUNT_EXISTS = 100,
    AUTH_ACCOUNT_NOT_FOUND = 101,
    AUTH_ACCOUNT_NOT_ACTIVE = 102,
    AUTH_ACCOUNT_BLOCKED = 103,

    // REQUEST ERROR
    REQUEST_VALIDATION_ERROR = 400,
    REQUEST_UNAUTHORIZED = 401,
    REQUEST_FORBIDDEN = 403,
    REQUEST_NOT_FOUND = 404,

    // SERVER ERROR
    SERVER_ERROR = 500,
    SERVER_AUTH_ERROR = 501, // and not know why
}

