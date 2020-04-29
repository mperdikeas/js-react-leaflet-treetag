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

import java.time.Instant;


public class InstantTypeAdapter implements JsonSerializer<Instant>
                                           , JsonDeserializer<Instant> {

    @Override
    public JsonElement serialize(final Instant o, Type typeOfT, JsonSerializationContext context) {
        return new JsonPrimitive(o.toEpochMilli()/1000);
    }

    @Override
    public Instant deserialize(JsonElement _json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        
        final JsonPrimitive json = _json.getAsJsonPrimitive();
        Assert.assertTrue(json.isNumber());
        final long sse  = json.getAsLong();
        return Instant.ofEpochSecond(sse);
    }
}
