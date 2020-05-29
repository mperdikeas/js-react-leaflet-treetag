package a.b.c;

import java.util.List;

public class TreeInfo extends BasicTreeInfo {

    public int yearPlanted;
    public HealthStatus healthStatus;
    public int heightCm;
    public int crownHeightCm;
    public int circumferenceCm;
    public boolean raisedSidewalk;
    public boolean powerlineProximity;
    public boolean obstruction;
    public boolean debris;
    public boolean litter;
    public boolean trunkDamage;
    public boolean fallHazard;
    public boolean publicInterest;
    public boolean disease;
    public String comments;
    public List<TreeAction> treeActions;


    public TreeInfo(final int kind,
                    final Coordinates coords,
                    final int yearPlanted,
                    final HealthStatus healthStatus,
                    final int heightCm,
                    final int crownHeightCm,
                    final int circumferenceCm,
                    final boolean raisedSidewalk,
                    final boolean powerlineProximity,
                    final boolean obstruction,
                    final boolean debris,
                    final boolean litter,
                    final boolean trunkDamage,
                    final boolean fallHazard,
                    final boolean publicInterest,
                    final boolean disease,
                    final String comments,
                    final List<TreeAction> treeActions) {
        super(kind, coords);
        this.yearPlanted = yearPlanted;
        this.healthStatus = healthStatus;
        this.heightCm = heightCm;
        this.crownHeightCm = crownHeightCm;
        this.circumferenceCm = circumferenceCm;
        this.raisedSidewalk = raisedSidewalk;
        this.powerlineProximity = powerlineProximity;
        this.obstruction = obstruction;
        this.debris = debris;
        this.litter = litter;
        this.trunkDamage = trunkDamage;
        this.fallHazard = fallHazard;
        this.publicInterest = publicInterest;
        this.disease = disease;
        this.comments = comments;
        this.treeActions = treeActions;
    }

    public BasicTreeInfo toBasicTreeInfo() {
        return new BasicTreeInfo(this.kind, this.coords);
    }

}
