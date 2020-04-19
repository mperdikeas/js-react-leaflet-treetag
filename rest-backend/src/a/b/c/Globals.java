package a.b.c;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;



public class Globals {

    public static final Gson gson;

    static {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        // gsonBuilder.setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES);
        // gsonBuilder.registerTypeAdapter( Pair   .class, new PairAdapter());
        // gsonBuilder.registerTypeAdapter( Map    .class, new MapAdapter());
        // gsonBuilder.registerTypeAdapter( Boolean.class, new JsonBooleanDeserializer());
        gsonBuilder.registerTypeAdapter( HealthStatus.class, new HealthStatusAdapter());
        gson = gsonBuilder.serializeNulls().create();
    }


}
