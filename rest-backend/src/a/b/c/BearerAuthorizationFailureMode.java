package a.b.c;

import javax.ws.rs.core.HttpHeaders;


public enum BearerAuthorizationFailureMode {

    NO_AUTHORIZATION_HEADERS_AT_ALL(String.format("no-%s-header"
                                                  , HttpHeaders.AUTHORIZATION))
    , MORE_THAN_ONE_AUTHORIZATION_HEADER("more-than-one-auth-header")
    , UNREC_AUTH_HEADER_FORMAT("unrec-auth-header-format")
    , MORE_THAN_ONE_BEARER_TOKENS("more-than-one-bearer-token")
    , NO_BEARER_TOKEN("no-bearer-token")
    , JWT_VERIFICATION_FAILED("JWT-verif-failed")
    , INSUFFICIENT_PRIVILLEGES("insufficient-priveleges");

    private final String code;

    private BearerAuthorizationFailureMode(final String code) {
        this.code = code;
    }

    public String getCode() {
        return this.code;
    }


}
