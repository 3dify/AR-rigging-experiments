# AR-rigging
A look at the workflow for early stage Augmented Reality experiments using Mixamo, Unity, and the Vuforia Toolkit.

Workflow to Date

=> 3D scan

=> (Skanect) Export as OBJ with texture UV - currently using about 400k polygons - need to see how low this can go.

=> Zip the folder with .obj, .png, and .mtl files

=> Upload zip file containing above assets to Mixamo

=> Rig using Mixamo software (follow simple step by step)

=> Download .fbx for Unity

=> Import into Unity (This example uses Unity version 4.6.2f1)

=> If the textures look weird it is probably the lighting. In Unity I clicked on the character then set the shader to Unlit/Texture to fix the patchy look

To set up a new Marker in Vuforia

Log in to Vuforia Target Manager
https://developer.vuforia.com/target-manager

Got to database called artree

Either 'add target' or use existing one

Click on 'Download Database' 

Select 'Unity' as your development platform and click 'Download'

File comes down as a Unity package.

Then basically you can follow this guide:
http://www.dannygoodayle.com/2013/03/01/making-your-first-project-with-unity-and-augmented-reality/

To use the motion packs from Unity follow this guide:

https://community.mixamo.com/hc/en-us/articles/203738103-Tutorial-Mixamo-and-Unity-Motion-Packs

Access:

Email me for Vuforia and Mixamo passwords.

Notes:

Aims for ideal workflow will be added in Wiki
