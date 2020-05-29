package a.b.c;

import java.util.List;

public class TreeInfoWithId extends TreeInfo {

    public int id;

    public TreeInfoWithId(final int id,
                          final int kind,
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
        super(kind, coords, yearPlanted, healthStatus, heightCm, 
              crownHeightCm,
              circumferenceCm,
              raisedSidewalk,
              powerlineProximity,
              obstruction,
              debris,
              litter,
              trunkDamage,
              fallHazard,
              publicInterest,
              disease,
              comments,
              treeActions);
        this.id = id;
    }

   public TreeInfoWithId(final int id,
                         final TreeInfo treeInfo) {
       this(id,
            treeInfo.kind,
            treeInfo.coords,
            treeInfo.yearPlanted,
            treeInfo.healthStatus,
            treeInfo.heightCm, 
            treeInfo.crownHeightCm,
            treeInfo.circumferenceCm,
            treeInfo.raisedSidewalk,
            treeInfo.powerlineProximity,
            treeInfo.obstruction,
            treeInfo.debris,
            treeInfo.litter,
            treeInfo.trunkDamage,
            treeInfo.fallHazard,
            treeInfo.publicInterest,
            treeInfo.disease,
            treeInfo.comments,
            treeInfo.treeActions);
   }

    public BasicTreeInfoWithId toBasicTreeInfoWithId() {
        return new BasicTreeInfoWithId(this.id, this.kind, this.coords);
    }
    
}

