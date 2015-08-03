# AR Model Processing Automation

## Requires 
Unity 4.6.x
note: Unity 4.6.1 causes a black screen on some devices (known bug. Unity updated to 4.6.7f1 and it fixed the issue

Blender 2.7.x

## Setup 

Install Homebrew (on Mac)
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install node via packages: https://nodejs.org/download/

Install imagemagick and graphicsmagick

```
brew install imagemagick
brew install graphicsmagick
```

Install the required node packages. CD into directory where repository is downloaded and then..

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

Download and extract SmartBodySDK into root of this project.

Then follow build instructions for your operating system in SmartBodyManual.pdf


```
cp SmartBodySDK/core/smartbody/sbgui/bin/libpinocchio.dylib $PYTHONPATH
```

If this errors, find the actual location of your python path and substitute $PYTHONPATH for it.



