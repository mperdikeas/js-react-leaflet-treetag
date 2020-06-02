package a.b.gson;

import com.google.gson.Gson;
import com.google.gson.JsonParser;
import com.google.gson.JsonElement;

import org.apache.log4j.Logger;

public final class GsonUtil {

    private GsonUtil() {}

    public static boolean isInternalizedRepresentationStable(final Logger logger, final Gson gson, final String json, final Object v) {
        final JsonParser parser = new JsonParser();
        final String json2 = gson.toJson(v);
        if (logger != null)
            logger.debug(String.format("json1=[%s], json2=[%s]"
                                       , json
                                       , json2));
        final JsonElement o1 = parser.parse(json);
        final JsonElement o2 = parser.parse(json2);
        return o1.equals(o2);
    }
}
