package a.b.c;

import java.io.IOException;

import javax.ws.rs.ext.Provider;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerRequestContext;

// https://stackoverflow.com/a/23631475/274677
@Provider /* Given that you still have to do singletons.add(new CORSFilter() ) in the JaxRsApplication
           * I dont' see what's the value of this annotation
           */
public class CORSFilter implements ContainerResponseFilter {
 
    @Override
    public void filter(ContainerRequestContext requestContext, 
      ContainerResponseContext responseContext) throws IOException {
          responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");
          responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");
          responseContext.getHeaders().add("Access-Control-Allow-Headers", "origin, content-type, accept, authorization");
          responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
          responseContext.getHeaders().add("Access-Control-Max-Age", "1209600");
    }
}
