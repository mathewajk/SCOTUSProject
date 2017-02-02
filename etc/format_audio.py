import glob
import os 

dir = os.path.dirname(os.path.abspath(__file__))
names = list()

f = open('audiolist.txt', 'r')
lines = f.readlines()
f.close()

for line in lines:
	line = line.strip('\n')
	names.append(line)

collated_data = '",\n"'.join(names)
collated_data = '["' + collated_data + '"]'

f = open(os.path.join(dir,'audio.txt'), 'w')
f.write(collated_data)
f.close()