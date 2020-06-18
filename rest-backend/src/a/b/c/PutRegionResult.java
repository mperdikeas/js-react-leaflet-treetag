package a.b.c;

public class PutRegionResult {

    final boolean partitionAlreadyExisted;
    final String previousRegion; // null if the region did not previously exist

    public PutRegionResult(final boolean partitionAlreadyExisted
                           , final String previousRegion) {
        this.partitionAlreadyExisted = partitionAlreadyExisted;
        this.previousRegion = previousRegion;
    }

}
