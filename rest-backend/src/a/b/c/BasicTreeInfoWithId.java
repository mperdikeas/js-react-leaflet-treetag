package a.b.c;

import java.util.Random;

public class BasicTreeInfoWithId extends BasicTreeInfo {

    public int id;

    public BasicTreeInfoWithId(final int id, final int kind, final Coordinates coords) {
        super(kind, coords);
        this.id = id;
    }

    public static BasicTreeInfoWithId from(final TreeInfoWithId treeInfoWithId) {
        return new BasicTreeInfoWithId(treeInfoWithId.id
                                       , treeInfoWithId.kind
                                       , treeInfoWithId.coords);
    }
}
