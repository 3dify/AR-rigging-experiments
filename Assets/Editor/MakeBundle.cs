using UnityEngine;
using UnityEditor;
using System.Collections;
using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;

public class MakeBundle {


	public static void BundleCommandLine(){
		System.IO.StreamWriter standardErr = new System.IO.StreamWriter(System.Console.OpenStandardError());
		standardErr.AutoFlush = true;
		System.Console.SetOut(standardErr);

		Debug.LogWarning("TEST!!!");
		var fileArg = MakeBundle.GetCmdLineArg("-3dify-bundle-files");
		var outputArg = MakeBundle.GetCmdLineArg("-3dify-bundle-output");
		
		Debug.Log (string.Format("input files : {0}",fileArg));
		Debug.Log (string.Format("output file : {0}",outputArg));
		
		System.Console.Write("\nTest\n");
		
		if( fileArg != null && outputArg != null){
			Debug.Log (fileArg);
			var files = fileArg.Split(new char[]{','}).Select(b=>b.Trim()).Where(
				f=>File.Exists(Path.Combine(Application.dataPath,f))
			).ToArray<string>();
            //.Select(f=>)
            
			if( files.Length == 0 ) {
				throw new UnityException("No valid files found to process!");
                
            }           
            
            
			Debug.Log(String.Format("Bundling files {0}",String.Join(",",files)));
			
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
		AssetDatabase.Refresh();
		Debug.Log(string.Format("Bundling output: {0}",outputFile));
		Debug.Log (string.Join(", ",inputFiles));
		//UnityEngine.Object[] allAssets = inputFiles.SelectMany(f=>AssetDatabase.LoadAllAssetsAtPath(f,typeof(UnityEngine.Object)).ToList()).Where (f=>f is Mesh).ToArray();
		UnityEngine.Mesh[] meshes = inputFiles.Select(f=>AssetDatabase.LoadAssetAtPath(Path.Combine("Assets",f),typeof(Mesh)) as Mesh).Where(m=>m!=null).ToArray();
		
		if( meshes.Length == 0 ) {
			throw new UnityException("No meshes found to process!");
		
		}
		
		/*
		List<Mesh> meshes = new List<Mesh>();
		
		foreach( string file in inputFiles ){
			var objects = AssetDatabase.LoadAssetAtPath("Assets/"+file,typeof(MeshFilter));
			Debug.Log ( string.Join(", ",objects.Select(o=>o.name).ToArray() ) );
		}
		*/
		
		
		
		foreach(Mesh mesh in meshes){
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
            Debug.LogWarning(String.Format("named argument {0} not found",arg));
            return null;
        }
        
		return args[bundleArgIndex+1];
        
    }
}
