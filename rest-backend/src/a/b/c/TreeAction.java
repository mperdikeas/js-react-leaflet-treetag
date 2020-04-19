package a.b.c;

import java.util.List;
import java.util.ArrayList;
import java.util.Random;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class TreeAction {


    public Instant instant;
    public TreeActionType type;

    public TreeAction(final Instant instant, final TreeActionType type) {
        this.instant = instant;
        this.type = type;
    }

    public static List<TreeAction> someRandomActions(final Random r) {
        final List<TreeAction> rv = new ArrayList<>();
        final int N = 3*r.nextInt(4);
        int daysBack = N*300;
        for (int i = 0; i < N; i++) {
            Instant instant = Instant.now();
            instant = instant.minus(daysBack, ChronoUnit.DAYS);
            daysBack += r.nextInt(300);
            rv.add(new TreeAction(instant, TreeActionType.fromCode(r.nextInt(TreeActionType.values().length))));
        }
        return rv;
    }
}
