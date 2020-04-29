package a.b.c;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.Date;
import java.util.Collections;
import java.util.Arrays;
import java.util.UUID;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

import java.io.File;
import java.io.OutputStream;
import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;

import java.lang.reflect.Type;

import java.awt.image.BufferedImage;

import java.util.Base64;
import java.time.Instant;


import com.google.common.base.Joiner;
import com.google.common.base.Throwables;
import com.google.gson.reflect.TypeToken;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;

import javax.ws.rs.CookieParam;
import javax.ws.rs.BadRequestException;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.PathSegment;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.HttpHeaders;
// import javax.inject.Singleton;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import javax.xml.bind.DatatypeConverter;

import javax.imageio.ImageIO;

import org.junit.Assert;

import org.apache.log4j.Logger;

import javax.crypto.SecretKey;
import io.jsonwebtoken.Jwts;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.TimeUnit;

import java.time.temporal.ChronoUnit;

import a.b.c.constants.Installation;


// To support the Singleton annotation in a Tomcat 8.5 container see: http://stackoverflow.com/a/19003725/274677
//@Singleton
// The above is commented as I am not using it in a JBoss deployment.


@Path("/main")
public class MainResource {

    final static Logger logger = Logger.getLogger(MainResource.class);

    private static AtomicInteger numberOfInstances = new AtomicInteger();

    public MainResource(final ServletContext servletContext) {
        Assert.assertNotNull(servletContext);
        final int numberOfInstancesV = numberOfInstances.incrementAndGet();
        final int TOLERANCE = 5;  // a single instance of this class is returned from JaxRsApplication#getSingleton() so in a perfect world this would be set to 0 (zero tolerance) - this is to ensure that the singleton semantics are (somewhat) respected.
        final int MAX_EXPECTED_INSTANCES = 1 + TOLERANCE;
        Assert.assertTrue(String.format("[%d] instances of [%s] encountered. I was expecting at most [%d] (including a tolerance of [%d] over the rigid value of 1)"
                                        , numberOfInstancesV
                                        , MainResource.class.getName()
                                        , MAX_EXPECTED_INSTANCES
                                        , TOLERANCE)
                          , numberOfInstancesV <= MAX_EXPECTED_INSTANCES);

        logger.info(String.format("instance hashcode: [%s]"
                                  , System.identityHashCode(this)));
    }

    @Path("/getConfiguration/")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public Response getConfiguration(@Context final HttpServletRequest httpServletRequest) {
        String methodInfo = null;
        try {
            final String installation = Installation.getFromServletRequest(httpServletRequest);
            methodInfo = String.format("getConfiguration() ~*~ installation: [%s], remote address: [%s]"
                                                    , installation
                                                    , httpServletRequest.getRemoteAddr());
            logger.info(methodInfo);
            final Configuration x = getConfiguration(installation);
            return Response.ok(Globals.gson.toJson(ValueOrInternalServerExceptionData.ok(x))).build();
        } catch (Throwable t) {
            logger.error(String.format("%s - shit happened", methodInfo), t);
            return ResourceUtil.softFailureResponse(t);
        }
    }

    private static Configuration getConfiguration(final String installation) {
        return Configuration.example();
    }


    
    @Path("/getTrees/")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
        public Response getTrees(@Context javax.ws.rs.core.Application _app,
                             @Context final HttpServletRequest httpServletRequest) {
        final JaxRsApplication app = (JaxRsApplication) _app;
        String methodInfo = null;
        try {
            final String installation = Installation.getFromServletRequest(httpServletRequest);
            methodInfo = String.format("getTrees() ~*~ installation: [%s], remote address: [%s]"
                                                    , installation
                                                    , httpServletRequest.getRemoteAddr());
            logger.info(methodInfo);
            return Response.ok(Globals.gson.toJson(ValueOrInternalServerExceptionData.ok(app.dbFacade.getTrees(installation)))).build();
        } catch (Throwable t) {
            logger.error(String.format("%s - shit happened", methodInfo), t);
            return ResourceUtil.softFailureResponse(t);
        }
    }


    @Path("/feature/{featureId}/data")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFeatureData(@Context javax.ws.rs.core.Application _app,
                                   @Context final HttpServletRequest httpServletRequest
                                   , @PathParam("featureId") final int featureId
                                    ) {
        final JaxRsApplication app = (JaxRsApplication) _app;
        try {
            logger.info(String.format("getFeatureData(%d) ~*~ remote address: [%s]"
                                      , featureId
                                      , httpServletRequest.getRemoteAddr()));
            TimeUnit.MILLISECONDS.sleep(200);
            final TreeInfo treeInfo = app.dbFacade.getTreeInfo(featureId);
            return Response.ok(Globals.gson.toJson(ValueOrInternalServerExceptionData.ok(treeInfo))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling getFeatureData(%d) from remote address [%s]"
                                       , featureId
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }

    @Path("/feature/{featureId}/data")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response setFeatureData(@Context javax.ws.rs.core.Application _app,
                                   @Context final HttpServletRequest httpServletRequest
                                   , @PathParam("featureId") final int featureId
                                   , final String featureData
                                    ) {
        final JaxRsApplication app = (JaxRsApplication) _app;
        try {
            logger.info(String.format("setFeatureData(%d) ~*~ remote address: [%s]"
                                      , featureId
                                      , httpServletRequest.getRemoteAddr()));
            logger.info(String.format("featureData is [%s]", featureData));
            TimeUnit.MILLISECONDS.sleep(200);

            todo: write a method to assert that the JSON object is stable
                
            final TreeInfo treeInfo = Globals.gson.fromJson(featureData, TreeInfo.class);
            final String treeInfoJSON = Globals.gson.toJson(treeInfo);
            Assert.assertEquals("something's not right"
                                , featureData
                                , treeInfoJSON);
            final boolean valueUpdated = app.dbFacade.setTreeInfo(featureId, treeInfo);
            return Response.ok(Globals.gson.toJson(ValueOrInternalServerExceptionData.ok(valueUpdated))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling setFeatureData(%d) from remote address [%s]"
                                       , featureId
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }
    
    

    @Path("/feature/{featureId}/photos/num")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFeaturePhotosNum(@Context final HttpServletRequest httpServletRequest
                                        , @PathParam("featureId") final int featureId
                                    ) {
        try {
            logger.info(String.format("getFeaturePhotosNum(%d) ~*~ remote address: [%s]"
                                      , featureId
                                      , httpServletRequest.getRemoteAddr()));
            TimeUnit.MILLISECONDS.sleep(200);
            return Response.ok(Globals.gson.toJson(ValueOrInternalServerExceptionData.ok(featureId % 5))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling getFeaturePhotosNum(%d) from remote address [%s]"
                                       , featureId
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }
    

    @Path("/feature/{featureId}/photos/elem/{photoIndx}")
    @GET 
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFeaturePhoto(@Context final HttpServletRequest httpServletRequest
                                  , @PathParam("featureId") final int featureId
                                    , @PathParam("photoIndx") final int photoIndx
                                    ) {
        try {
            logger.info(String.format("getFeaturePhoto(%d, %d) ~*~ remote address: [%s]"
                                      , featureId
                                      , photoIndx
                                      , httpServletRequest.getRemoteAddr()));
            TimeUnit.MILLISECONDS.sleep(200);
            final String photoBase64 = getPhotoBase64(featureId, photoIndx);
            final Instant photoInstant = getPhotoInstant(featureId);
            final FeaturePhoto featurePhoto = new FeaturePhoto(photoBase64, photoInstant);
            return Response.ok(Globals.gson.toJson(ValueOrInternalServerExceptionData.ok(featurePhoto))).build();
        } catch (Throwable t) {
            logger.error(String.format("Problem when calling getFeaturePhoto(%d, %d) from remote address [%s]"
                                       , featureId
                                       , photoIndx
                                       , httpServletRequest.getRemoteAddr())
                         , t);
            return ResourceUtil.softFailureResponse(t);
        }
    }

    private Instant getPhotoInstant(final int featureId) {
        final int days = featureId % 2000;
        return Instant.now().minus(days, ChronoUnit.DAYS);
    }
    private String getPhotoBase64(final int featureId, final int photoIndx) throws Exception {
        final String[] photos = new String[]{
            "urban-olive-tree.jpeg",
            "olive-3687482__340.jpg",
            "olives-1752199__340.jpg", 
            "olive-tree-1973386__340.jpg", 
            "olive-tree-333973__340.jpg", 
            "olive-tree-3465274__340.jpg", 
            "olive-tree-3495165__340.jpg", 
            "olive-tree-3579922__340.jpg", 
            "olive-tree-3662627__340.jpg", 
            "olive-trees-4253749__340.jpg", 
            "photo-1445264718234-a623be589d37.jpeg", 
            "photo-1445294211564-3ca59d999abd.jpeg", 
            "photo-1446714276218-bd84d334af98.jpeg", 
            "photo-1471180625745-944903837c22.jpeg", 
            "photo-1476712395872-c2971d88beb7.jpeg", 
            "photo-1486162928267-e6274cb3106f.jpeg", 
            "photo-1489644484856-f3ddc0adc923.jpeg", 
            "photo-1496776574435-bf184935f729.jpeg", 
            "photo-1500215667712-fdbc1bfc0887.jpeg", 
            "photo-1501084291732-13b1ba8f0ebc.jpeg", 
            "photo-1502311526760-ebc5d6cc0183.jpeg", 
            "photo-1502770513380-138d6d3a51dd.jpeg", 
            "photo-1505672678657-cc7037095e60.jpeg", 
            "photo-1507369512168-9b7de6ec6be6.jpeg", 
            "photo-1508349937151-22b68b72d5b1.jpeg", 
            "photo-1523712999610-f77fbcfc3843.jpeg", 
            "photo-1541426062085-72349d82d048.jpeg", 
            "photo-1541623608922-3bce9d452968.jpeg", 
            "photo-1543130732-4b8da601004b.jpeg", 
            "photo-1545284860-c13569469d2a.jpeg", 
            "photo-1553755322-56baa43a31d7.jpeg", 
            "photo-1562207124-f93c6fc6c176.jpeg", 
            "photo-1563433571545-99e130f273f2.jpeg"
        };

        final ClassLoader classloader = Thread.currentThread().getContextClassLoader();
        final String fname = photos[ Math.abs((featureId*photoIndx + featureId + photoIndx)) % photos.length];
        final InputStream is = classloader.getResourceAsStream(String.format("photos/%s", fname));
        final BufferedImage image = ImageIO.read(is);
        final ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "jpg", baos);
        final byte[] imageData = baos.toByteArray();
        return Base64.getEncoder().encodeToString(imageData);
    }
}



class FeaturePhoto {
    final String photoBase64;
    final Instant instant;
    protected FeaturePhoto(final String photoBase64, Instant instant) {
        this.photoBase64 = photoBase64;
        this.instant = instant;
    }

}


