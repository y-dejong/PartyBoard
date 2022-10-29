1 2 3 4 5 6
*
A B C D E F
*
H I J K L
*
indices = [0, 0, 0] (length = iterables.length)

while(True):
    
    makeTuple()
    indices[:-i]

    indices[:-1] += 1
    for i in range(indices.length, -1):
        if indices[i] >= iterables[i].length:
            indices[i-1] += 1
            indices[i] = 0


        
        if indices[:-1] >= iterables[:-1].length:
            indices[:-1] = 0
            indices[:-2] += 1
