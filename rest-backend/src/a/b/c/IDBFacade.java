package a.b.c;

import java.util.List;
import java.util.Set;

import java.lang.reflect.Method;


public interface IDBFacade {


    boolean checkCredentials(String installation, String username, String password);
    String userEmail(String installation, String username);
    String emailToUsername(String installation, String email);
    BasicTreeInfo getBasicTreeInfo(int treeId);
    TreeInfo getTreeInfo(int treeId);
    boolean setTreeInfo(int treeId, TreeInfo treeInfo);
    int getNumOfPhotos(int treeId);
    PhotoData getPhoto(int treeId, int photoIdx);
    boolean deletePhoto(int treeId, int photoIdx);
    List<BasicTreeInfo> getTrees(String installation);


    Set<Privillege> getPrivilleges(String installation, String username);
    boolean arePrivillegesSufficient(Set<Privillege> privilleges, Class c, Method m);



}
