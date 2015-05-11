from AutoRig import *
assetManager = scene.getAssetManager()
 
assetManager.loadAsset('c:/users/shapiro/path/to/my/mesh.ply')   # path to your 3D model
 
pawn = scene.createPawn("myCharacter ") # create an object
setPawnMesh(myCharacter, "mesh.ply'")  # attach the mesh to the object
 
autoRigManager = SBAutoRigManager.getAutoRigManager()
autoRigManager.buildAutoRiggingFromPawnMesh(“myCharacter”,0, myCharacter.sk', myCharacter.dae') # convert the object+mesh into a rigged character
saveDeformableMesh('testAutoRig.dae', 'myCharacter.sk', "c:/users/shapiro/myscans/") # save out the COLLADA file

quit()