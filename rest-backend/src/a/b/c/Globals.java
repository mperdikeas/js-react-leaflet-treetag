package a.b.c;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.time.Instant;

public class Globals {

    public static final Gson gson;

    static {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        // gsonBuilder.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES);
        // gsonBuilder.registerTypeAdapter( Boolean.class, new JsonBooleanDeserializer());
        gsonBuilder.registerTypeAdapter( HealthStatus.class  , new HealthStatusAdapter());
        gsonBuilder.registerTypeAdapter( TreeActionType.class, new TreeActionTypeAdapter());
        gsonBuilder.registerTypeAdapter( BearerAuthorizationFailureMode.class, new BearerAuthorizationFailureModeAdapter());
        gsonBuilder.registerTypeAdapter( Instant.class, new InstantTypeAdapter());
        gson = gsonBuilder.serializeNulls().create();
    }


}
