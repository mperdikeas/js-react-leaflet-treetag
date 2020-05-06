package a.b.c;

import java.lang.reflect.Type;

import org.junit.Assert;

import com.google.gson.JsonSerializer;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonParseException;


public class HealthStatusAdapter implements JsonSerializer<HealthStatus>, JsonDeserializer<HealthStatus> {


    @Override
    public JsonElement serialize(final HealthStatus h, Type typeOfT, JsonSerializationContext context) {
        return new JsonPrimitive(String.valueOf(h.getCode()));
    }

    @Override
    public HealthStatus deserialize(JsonElement _json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        
        final JsonPrimitive json = _json.getAsJsonPrimitive();
        /* JSON keys are strings; this cannot be helped. Accordingly, we need to convert
         * from strings back to integers upon deserializing
         */
        final int code = json.getAsInt(); 
        return HealthStatus.fromCode(code);
    }
}
