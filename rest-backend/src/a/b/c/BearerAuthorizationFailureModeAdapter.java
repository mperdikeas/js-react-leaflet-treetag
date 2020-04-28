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


public class BearerAuthorizationFailureModeAdapter implements JsonSerializer<BearerAuthorizationFailureMode>, JsonDeserializer<BearerAuthorizationFailureMode> {

    @Override
    public JsonElement serialize(final BearerAuthorizationFailureMode fm, Type typeOfT, JsonSerializationContext context) {
        return new JsonPrimitive(fm.getCode());
    }

    @Override
    public BearerAuthorizationFailureMode deserialize(JsonElement _json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {

        throw new UnsupportedOperationException("I don't forsee that this method is ever used");
    }
}
