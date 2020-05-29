package a.b.c;

import org.junit.Assert;

import javax.ws.rs.core.HttpHeaders;

import a.b.html.HeaderException;
import a.b.html.NoHeaderFoundException;
import a.b.html.MoreThanOneHeaderFoundException;
import a.b.html.AuthHeaderExceptionUnrecBearerFormat;
import a.b.html.AuthHeaderExceptionMoreThanOneBearerToken;

import a.b.c.SCAUtil;


public enum BearerAuthorizationFailureMode {

    NO_AUTHORIZATION_HEADERS_AT_ALL(String.format("no-%s-header"
                                                  , HttpHeaders.AUTHORIZATION))
    , MORE_THAN_ONE_AUTHORIZATION_HEADER("more-than-one-auth-header")
    , UNREC_AUTH_HEADER_FORMAT("unrec-auth-header-format")
    , MORE_THAN_ONE_BEARER_TOKENS("more-than-one-bearer-token")
    , NO_BEARER_TOKEN("no-bearer-token")
    , JWT_VERIFICATION_FAILED("JWT-verif-failed")
    , INSUFFICIENT_PRIVILEGES("insufficient-privileges");

    private final String code;

    private BearerAuthorizationFailureMode(final String code) {
        this.code = code;
    }

    public String getCode() {
        return this.code;
    }

    public static BearerAuthorizationFailureMode fromHeaderExceptionClass(Class<? extends HeaderException> klass) {
        if (klass.equals(NoHeaderFoundException.class))
            return NO_AUTHORIZATION_HEADERS_AT_ALL;
        else if (klass.equals(MoreThanOneHeaderFoundException.class))
            return MORE_THAN_ONE_AUTHORIZATION_HEADER;
        else if (klass.equals(AuthHeaderExceptionUnrecBearerFormat.class))
            return UNREC_AUTH_HEADER_FORMAT;
        else if (klass.equals(AuthHeaderExceptionMoreThanOneBearerToken.class))
            return MORE_THAN_ONE_BEARER_TOKENS;
        else {
            Assert.fail(String.format("unrecognized class: [%s]", klass.getName()));
            return SCAUtil.satisfyReturn(BearerAuthorizationFailureMode.class);
        }
    }


}
