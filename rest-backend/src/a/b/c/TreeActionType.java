package a.b.c;

import org.junit.Assert;

public enum TreeActionType {

    INITIAL_RECORD(0), RECORD_UPDATE(1), WATERING(2), MEDICATION(3), PRUNING(4), SIDEWALK_REPAIR(5), SUPPORT(6), CLEAR_LITTER(7), ADDRESS_POWERLINE_PROXIMITY(8);

    private final int code;

    private TreeActionType(final int code) {
        this.code =code;
    }

    public int getCode() {
        return code;
    }

    public static TreeActionType fromCode(final int code) {
        for (final TreeActionType v: TreeActionType.values())
            if (v.getCode()==code)
                return v;
        Assert.fail(String.format("unable to compute fromCode(%d)", code));
        return null;
    }
}
