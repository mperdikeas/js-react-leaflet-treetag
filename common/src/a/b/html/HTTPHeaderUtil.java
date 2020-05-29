package a.b.html;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Collections;

import java.lang.reflect.Method;

import java.nio.charset.StandardCharsets;
    

    
import javax.ws.rs.WebApplicationException;

import javax.xml.bind.DatatypeConverter;

import org.junit.Assert;

import org.apache.log4j.Logger;

import java.util.List;
import java.util.Collections;
import java.io.IOException;

import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.HttpHeaders;

import javax.ws.rs.core.Application;

import javax.ws.rs.container.ResourceInfo;

import javax.crypto.SecretKey;

import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerRequestContext;


import org.junit.Assert;

import org.apache.log4j.Logger;

import com.google.common.base.Joiner;
import com.google.common.base.Throwables;



public final class HTTPHeaderUtil {
    private HTTPHeaderUtil() {}

    public static String getBearerAuthorizationHeader(final Logger logger, final HttpServletRequest request) throws NoHeaderFoundException, MoreThanOneHeaderFoundException {
        return getHeader(logger, request, HttpHeaders.AUTHORIZATION);
    }

public static String getHeader(final Logger logger, final HttpServletRequest request, final String header) throws NoHeaderFoundException, MoreThanOneHeaderFoundException {
        final List<String> headers = Collections.list(request.getHeaders(header));
        if ((headers==null) || (headers.size()==0)) {
            final String msg = (headers==null)?"null case":"0 elements list case";
            throw new NoHeaderFoundException(header, msg);
        }

        
        if (headers.size()>1) {
            throw new MoreThanOneHeaderFoundException(header, (String) null, headers.size());
        }
        Assert.assertEquals(1, headers.size());
        return headers.get(0);
    }
    
    
}
