package a.b.c;

import java.util.List;
import java.util.Set;
import java.util.Map;

import java.lang.reflect.Method;


public interface IDBFacade {


    boolean checkCredentials(String installation, String username, String password);
    String userEmail(String installation, String username);
    String emailToUsername(String installation, String email);
    BasicTreeInfoWithId getBasicTreeInfo(int treeId);
    TreeInfoWithId getTreeInfo(int treeId);
    int createTree(TreeInfo treeInfo);    
    boolean setTreeInfo(int treeId, TreeInfoWithId treeInfo);
    int getNumOfPhotos(int treeId);
    PhotoData getPhoto(int treeId, int photoIdx);
    int postPhoto(int treeId, PhotoData photoData);
    boolean deletePhoto(int treeId, int photoIdx);
    List<BasicTreeInfoWithId> getTrees(String installation);
    Map<String, Map<String, Region>> partitionsForInstallation(String installation);

        
    Set<Privillege> getPrivilleges(String installation, String username);
    boolean arePrivillegesSufficient(Set<Privillege> privilleges, Class c, Method m);

    String putRegion(String installation, String partition, String region, String wkt);



}
