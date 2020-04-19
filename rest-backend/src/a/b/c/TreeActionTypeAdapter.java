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


public class TreeActionTypeAdapter implements JsonSerializer<TreeActionType>
                                              , JsonDeserializer<TreeActionType> {

    @Override
    public JsonElement serialize(final TreeActionType o, Type typeOfT, JsonSerializationContext context) {
        return new JsonPrimitive(o.getCode());
    }

    @Override
    public TreeActionType deserialize(JsonElement _json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        
        final JsonPrimitive json = _json.getAsJsonPrimitive();
        Assert.assertTrue(json.isNumber());
        final int code = json.getAsInt();
        return TreeActionType.fromCode(code);
    }
}
