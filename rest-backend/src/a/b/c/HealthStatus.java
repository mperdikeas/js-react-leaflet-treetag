package a.b.c;

import org.junit.Assert;

public enum HealthStatus {
    POOR(-1),
    AVERAGE(0),
    HEALTHY(1);
    
    private int code;

    

    private HealthStatus(final int code) {
        this.code = code;
    }

    public int getCode() {
        return this.code;
    }

    public static HealthStatus fromCode(final int code) {
        for (final HealthStatus v: HealthStatus.values())
            if (v.getCode()==code)
                return v;
        Assert.fail(String.format("unable to compute fromCode(%d)", code));
        return null;
    }
}
