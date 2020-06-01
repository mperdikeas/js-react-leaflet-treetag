package a.b.c;

import io.jsonwebtoken.Claims;

import a.b.c.constants.Installation;

public final class ClaimsUtil {

    private ClaimsUtil() {}

    public static ConnectionInfo getConnInfoFromAccessToken(final String accessToken) {
        // must match the value in the webmvc-login app
        final String secretKeySpecS = "eyJhbGdvcml0aG0iOiJIbWFjU0hBMjU2IiwiZW5jb2RlZEtleSI6InhUMzQ4ZWlXTmMvTVhoeE5ucXU5bG5ZUVBRdVB0WWlQbVM1UGpoc2wrY1FcdTAwM2QifQ==";
        final Claims claims = JWTUtil.verifyJWS(secretKeySpecS, accessToken);
        final String installation = Installation.getFromClaims(claims);
        final String username     = claims.getSubject();
        return new ConnectionInfo(installation, username);
    }
}
     
