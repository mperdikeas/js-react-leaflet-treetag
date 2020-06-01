package a.b.html;

import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;

import org.junit.Assert;
import org.apache.log4j.Logger;

import com.google.common.base.Joiner;


public final class BearerAuthorizationUtil {

    private BearerAuthorizationUtil() {}

    public static String getAccessTokenFromRequest(final Logger logger, final HttpServletRequest request) throws NoHeaderFoundException, MoreThanOneHeaderFoundException, AuthHeaderExceptionUnrecBearerFormat, AuthHeaderExceptionMoreThanOneBearerToken, NoBearerAuthHeaderException {
        final String authHeader = HTTPHeaderUtil.getAuthorizationHeader(logger, request);
        return getAccessToken(logger, authHeader);
    }

    public static String getAccessToken(final Logger logger, final String authorizationHeader) throws AuthHeaderExceptionUnrecBearerFormat
                                                                                                      , AuthHeaderExceptionMoreThanOneBearerToken
                                                                                                      , NoBearerAuthHeaderException {
        final String[] authorizations = authorizationHeader.split(",");

        logger.debug(String.format("[%d] authorizations present in [%s]"
                                   , authorizations.length
                                   , authorizationHeader));
        boolean bearerAuthFound = false;
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
                    bearerAuthFound = true;
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
        if (!bearerAuthFound)
            throw new NoBearerAuthHeaderException(String.format("%d authorizations in total: %s - none was of type [%s]"
                                                       , authorizations.length
                                                       ,  Joiner.on(", ").join(Arrays.asList(authorizations))));
        else
            return accessToken;
    }

}
