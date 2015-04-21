using UnityEngine;
using UnityEditor;
using System.Collections;
using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;

public class MakeBundle {


	public static void BundleCommandLine(){
		System.IO.StreamWriter standardOutput = new System.IO.StreamWriter(System.Console.OpenStandardOutput());
		standardOutput.AutoFlush = true;
		System.Console.SetOut(standardOutput);
		Debug.LogWarning("TEST!!!");
		var fileArg = MakeBundle.GetCmdLineArg("-3dify:bundle-files");
		var outputArg = MakeBundle.GetCmdLineArg("-3dify:bundle-output");
		
		Debug.Log (fileArg);
		Debug.Log (outputArg);
		
		if( fileArg != null && outputArg != null){
			Debug.Log (fileArg);
			var files = fileArg.Split(new char[]{','}).Select(b=>b.Trim()).Where(
				f=>File.Exists(Path.Combine(Application.dataPath,f))
			).ToArray<string>();
            //.Select(f=>)
			Debug.Log(string.Format("Bundling files {0}",string.Join(",",files)));
			
			if( files.Length > 0 ) Bundle(files,outputArg);
		}
		//AssetDatabase.LoadAssetAtPath("file");
		//BuildPipeline.BuildAssetBundle(
	}
	
	[MenuItem("Assets/TestBundle")]
	public static void TestBundle(){
		Bundle (new string[]{ "Models/paul_20000_blender/model_20000.obj" },"/Users/paulhayes/Workspace/AR-rigging/model.bin");
	}
	
	public static void Bundle(string[] inputFiles,string outputFile){
		Debug.Log(string.Format("Bundling output: {0}",outputFile));
		//UnityEngine.Object[] allAssets = inputFiles.SelectMany(f=>AssetDatabase.LoadAllAssetsAtPath(f,typeof(UnityEngine.Object)).ToList()).Where (f=>f is Mesh).ToArray();
		UnityEngine.Mesh[] meshes = inputFiles.Select(f=>AssetDatabase.LoadAssetAtPath("Assets/"+f,typeof(Mesh)) as Mesh).ToArray();
		
		/*
		List<Mesh> meshes = new List<Mesh>();
		
		foreach( string file in inputFiles ){
			var objects = AssetDatabase.LoadAssetAtPath("Assets/"+file,typeof(MeshFilter));
			Debug.Log ( string.Join(", ",objects.Select(o=>o.name).ToArray() ) );
		}
		*/
		
		foreach(Mesh mesh in meshes){
			if( mesh == null ) return;
			Debug.Log(string.Format("Serializing mesh {0}",outputFile));
			byte[] meshData = MeshSerializer.WriteMesh(mesh,true);
			File.WriteAllBytes(outputFile,meshData);
			break;
		}
		/*
		BuildPipeline.BuildAssetBundle(allAssets[0],
		                               allAssets,
		                               outputFile,
		                               BuildAssetBundleOptions.CollectDependencies |
		                               BuildAssetBundleOptions.CompleteAssets |
		                               BuildAssetBundleOptions.DeterministicAssetBundle,
		                               BuildTarget.Android);
		                               */
    }
    
    public static string GetCmdLineArg(string arg){
		string[] args = System.Environment.GetCommandLineArgs();
		int bundleArgIndex = Array.IndexOf<string>( args, arg );
        if( bundleArgIndex == -1 || bundleArgIndex == (args.Length-1) ){
        	return null;
        }
        
		return args[bundleArgIndex+1];
        
    }
}
