package com.diplomski.util;

public enum RecordType {
    ACCOUNT_BLOCKED ("Account has been blocked due to too many failed login attempts."),
    WRONG_CREDENTIALS ("Wrong credentials."),
    PASSWORD_RESET ("User requested password reset.");

    private String label;

    RecordType(String label) {
        this.label = label;
    }
}
