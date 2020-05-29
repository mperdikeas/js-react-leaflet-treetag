package a.b.html;


import javax.servlet.http.HttpServletRequest;
import org.junit.Assert;

import org.apache.log4j.Logger;


public final class BearerAuthorizationUtil {

    private BearerAuthorizationUtil() {}

    public static String getAccessTokenFromRequest(final Logger logger, final HttpServletRequest request) throws NoHeaderFoundException, MoreThanOneHeaderFoundException, AuthHeaderExceptionUnrecBearerFormat, AuthHeaderExceptionMoreThanOneBearerToken {
        final String headerValue = HTTPHeaderUtil.getBearerAuthorizationHeader(logger, request);
        return getAccessToken(logger, headerValue);
    }

    public static String getAccessToken(final Logger logger, final String authorizationHeader) throws AuthHeaderExceptionUnrecBearerFormat, AuthHeaderExceptionMoreThanOneBearerToken {
        final String[] authorizations = authorizationHeader.split(",");

        logger.debug(String.format("[%d] authorizations present in [%s]"
                                   , authorizations.length
                                   , authorizationHeader));
        String accessToken = null;
        final String BEARER = "bearer";
        for (int i = 0 ; i < authorizations.length ; i++) {
            final String authorization = authorizations[i];
            final String authorizationTr = authorization.trim();
            logger.debug(String.format("trimmed authorization %d of %d from [%s] to [%s]"
                                       , i
                                       , authorizations.length
                                       , authorization
                                       , authorizationTr));
            String nameValue[] = authorizationTr.split(" ");
            if (nameValue.length!=2) {
                final String context = String.format("Unrecognized form: [%s] in the %d-th authorization"
                                                 , authorizationTr
                                                 , i);
                throw new AuthHeaderExceptionUnrecBearerFormat(authorizationHeader
                                                               , context);
            } else {
                final String name  = nameValue[0].trim();
                if (name.toLowerCase().equals(BEARER)) {
                    if (accessToken!=null) {
                        throw new AuthHeaderExceptionMoreThanOneBearerToken(authorizationHeader, (String) null, (Integer) null);
                    } else {
                        accessToken = nameValue[1].trim();
                    }
                }
                logger.debug(String.format("authorization name=[%s], value=[%s]"
                                           , name
                                           , accessToken));
            }
        } // for (int i = 0 ; i < authorizations.length ; i++) {
        return accessToken;
    }

}
