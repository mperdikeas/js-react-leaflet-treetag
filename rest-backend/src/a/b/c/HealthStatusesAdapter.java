package a.b.c;

import java.util.Map;
import java.util.LinkedHashMap;


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


public class HealthStatusesAdapter implements JsonSerializer<HealthStatuses>, JsonDeserializer<HealthStatuses> {


    @Override
    public JsonElement serialize(final HealthStatuses h, Type typeOfT, JsonSerializationContext context) {
        final JsonObject rv = new JsonObject();
        for (final Map.Entry<Integer, String> entry: h.code2name.entrySet()) {
            final Integer code  = entry.getKey();
            final String  value = entry.getValue();
            Assert.assertNotNull(value);
            rv.addProperty(Integer.toString(code), value);
        }
        return rv;
    }

    @Override
    public HealthStatuses deserialize(JsonElement _json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        
        Assert.assertTrue(_json.isJsonObject());
        final LinkedHashMap<Integer, String> rv = new LinkedHashMap<>();
        final JsonObject json = _json.getAsJsonObject();
        for (final Map.Entry<String, JsonElement> entry: json.entrySet()) {
            final Integer code = Integer.valueOf(entry.getKey());
            final JsonElement valueJSON = entry.getValue();
            Assert.assertTrue(valueJSON.isJsonPrimitive());
            final String value = valueJSON.getAsString();
            Assert.assertNull(rv.put(code, value));
        }
        return new HealthStatuses(rv);
    }
}
