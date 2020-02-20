package a.b.c;

import javax.ws.rs.core.Response;
import com.google.common.base.Throwables;


public final class ResourceUtil {

    private ResourceUtil() {}


    public static Response softFailureResponse(final Throwable t) {
        return Response.ok(ValueOrInternalServerExceptionData.err(Throwables.getRootCause(t).getMessage()
                                                                  , Throwables.getStackTraceAsString(t))
                           ).build();
    }


}
