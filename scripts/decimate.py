#!/bin/python

import os,sys,bpy,math

bpy.data.objects['Cube'].select = True
bpy.data.objects['Camera'].select = True
bpy.data.objects['Lamp'].select = True
bpy.ops.object.delete()

model_path = sys.argv[6]
output_path = sys.argv[7]

print("model_path={0}".format(model_path));
print("output_path={0}".format(output_path));

# get list of all files in directory
file_list = os.listdir(model_path)

#get all obj files
obj_list = [item for item in file_list if item[-4:] == '.obj']

# loop through the strings in obj_list.
for item in obj_list:
    number = item[5:-4]
    print("item: " + item + ", number: "+ item)
    full_path_to_file = os.path.join(model_path, item)
    bpy.ops.import_scene.obj(filepath=full_path_to_file)
    obj = bpy.data.objects['model']
    
    mod = obj.modifiers.new(name='decimate', type='DECIMATE')
    mod.decimate_type='COLLAPSE'
    mod.ratio =  min( 10000.0 / len(bpy.data.meshes['model'].polygons), 1)
    print("reducing by ratio: {0}".format(mod.ratio));
    bpy.context.scene.objects.active = obj
    bpy.ops.object.modifier_apply(modifier='decimate')

    print("rotating object");
    bpy.ops.transform.rotate(value=(-math.pi*0.5),axis=(1,0,0))


    mod = obj.modifiers.new(name='triangulate', type='TRIANGULATE')
    bpy.ops.object.modifier_apply(modifier='triangulate')
    outfile = os.path.join(output_path,item)
    bpy.ops.export_scene.obj(filepath=outfile, use_selection=True)


exit

