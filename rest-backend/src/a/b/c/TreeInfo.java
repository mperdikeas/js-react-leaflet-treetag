package a.b.c;

public class TreeInfo extends BasicTreeInfo {

    public int yearPlanted;
    public HealthStatus healthStatus;
    public int heightCm;
    public int crownHeightCm;
    public int circumferenceCm;
    public boolean raisedSidewalk;
    public boolean nearPowerLines;
    public boolean obstruction;
    public boolean debris;
    public boolean litter;
    public boolean trunkDamage;
    public boolean fallHazard;
    public boolean publicInterest;
    public boolean disease;
    public String comments;


    public TreeInfo(final int id,
                    final int kind,
                    final Coordinates coords,
                    final int yearPlanted,
                    final HealthStatus healthStatus,
                    final int heightCm,
                    final int crownHeightCm,
                    final int circumferenceCm,
                    final boolean raisedSidewalk,
                    final boolean nearPowerLines,
                    final boolean obstruction,
                    final boolean debris,
                    final boolean litter,
                    final boolean trunkDamage,
                    final boolean fallHazard,
                    final boolean publicInterest,
                    final boolean disease,
                    final String comments) {
        super(id, kind, coords);
        this.yearPlanted = yearPlanted;
        this.healthStatus = healthStatus;
        this.heightCm = heightCm;
        this.crownHeightCm = crownHeightCm;
        this.circumferenceCm = circumferenceCm;
        this.raisedSidewalk = raisedSidewalk;
        this.nearPowerLines = nearPowerLines;
        this.obstruction = obstruction;
        this.debris = debris;
        this.litter = litter;
        this.trunkDamage = trunkDamage;
        this.fallHazard = fallHazard;
        this.publicInterest = publicInterest;
        this.disease = disease;
        this.comments = comments;
    }

    public BasicTreeInfo toBasicTreeInfo() {
        return new BasicTreeInfo(this.id, this.kind, this.coords);
    }

}
