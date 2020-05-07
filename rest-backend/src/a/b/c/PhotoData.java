package a.b.c;

import java.time.Instant;

public final class PhotoData {

    public final String imageBase64;
    public final Instant instant;

    public PhotoData(final String imageBase64
                     , final Instant instant) {
        this.imageBase64 = imageBase64;
        this.instant = instant;
    }
}
