# AR Model Processing Automation

## Requires 
Unity 4.6.x
Blender 2.7.x

## Setup 

First install the required node packages.

```
npm install
```

Then make a copy of default-config.js.

```
cp scripts/default-config.js scripts/config.js
```

Then modify scripts/config.js to have valid Unity 3d, and Blender path, as well as authorization credencials for Vuforia and FTP.

## Running

```
./scripts/main.js {asset_dir} {output_dir}
```


## Enable Auto Rigging Setup ( in progress )

```
cp SmartBodySDK/core/smartbody/sbgui/bin/libpinocchio.dylib $PYTHONPATH
```

If this errors, find the actual location of your python path and substitute $PYTHONPATH for it.



