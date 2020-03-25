package a.b.c.constants;

import io.jsonwebtoken.Claims;

import javax.ws.rs.container.ContainerRequestContext;
import javax.servlet.http.HttpServletRequest;

public final class Installation {


    public static final String JWT_CLAIM = "installation";
    private static final String REQUEST_ATTRIBUTE = "installation";

    private Installation() {}


    public static String getFromClaims(final Claims claims) {
        return (String) claims.get(JWT_CLAIM);
    }

    public static void setInContainerRequestContext(final ContainerRequestContext requestContext, final String value) {
        requestContext.setProperty(REQUEST_ATTRIBUTE, value);
    }

    public static String getFromServletRequest(final HttpServletRequest request) {
        return (String) request.getAttribute(REQUEST_ATTRIBUTE);
    }    



}
