#!/usr/bin/env python
# coding: utf-8

# In[7]:


from PIL import Image, ImageChops
from pylab import *
import numpy as np
import imageio
import glob
import pickle
from sklearn import datasets, svm
import csv
import os

# Root stores path of current python file
root = os.path.dirname(__file__)
inputPath = os.path.join(root, 'test.csv')
outputPath = os.path.join(root, 'genresult/result.csv')
# .jpg or .jpeg
imagesPath = os.path.join(root, 'coordinates/images/*.jpeg')
finalizedModelPath = os.path.join(root, 'finalized_model.sav')
scalePath = os.path.join(root, 'scale.csv')
resultPath = os.path.join(root, 'genresult', 'index.html')


def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0, 0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)


def blackw(im):
    gray = im.convert('L')
    bw = gray.point(lambda x: 0 if x < 200 else 255, '1')
    bw = bw.resize((28, 28))
    if bw:
        return bw


# In[5]:


with open(inputPath) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    arr_cord = [[0 for i in range(4)] for j in range(18)]
    arr_ans = ['F']*18
    for row in csv_reader:
        arr_cord[line_count][0] = int(row[0])
        arr_cord[line_count][1] = int(row[1])
        arr_cord[line_count][2] = int(row[2])
        arr_cord[line_count][3] = int(row[3])
        arr_ans[line_count] = row[4]
        line_count += 1

with open(scalePath) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        dimensions = row
    scaleX = (int(dimensions[2])/int(dimensions[0]))
    scaleY = (int(dimensions[3])/int(dimensions[1]))
    for coordinateSet in arr_cord:
        for i in range(4):
            if i % 2 == 0:
                coordinateSet[i] = coordinateSet[i] * scaleX
            else:
                coordinateSet[i] = coordinateSet[i] * scaleY

# In[6]:


clf = pickle.load(open(finalizedModelPath, 'rb'))

col = line_count+3
row = ['F']*col

correct = 0
wrong = 0
strTable = ''
with open(outputPath, 'a') as csvFile:
    writer = csv.writer(csvFile)

for img in glob.glob(imagesPath):
    im = Image.open(img)
    i = 0
    for i in range(line_count):
        img2 = im.crop(arr_cord[i])
        # Testing line
        img2 = img2.convert('L')
        arr1 = (np.array(img2))
        img2 = trim(img2)
        arr2 = (np.array(img2))
        img2 = blackw(img2)
        imarray = array(img2)
        finalarray = imarray.flatten()
        pred = clf.predict([finalarray])
        myscore = clf.predict_proba([finalarray])
        if pred == 'F':
            row[i+3] = 'F'
        else:
            row[i+3] = 'T'
        if pred == arr_ans[i]:
            correct = correct+1
        else:
            wrong = wrong+1
        #print("False Score=", round(myscore[0,0],5))
        #print("True Score=", round(myscore[0,1],5))
        if (i == line_count-1):
            with open(outputPath, 'a') as csvFile:
                row[1] = correct
                row[2] = wrong
                row[0] = os.path.splitext(os.path.basename(im.filename))[0]
                name = os.path.splitext(os.path.basename(im.filename))[0]
                writer = csv.writer(csvFile)
                writer.writerow(row)
                csvFile.close()
                strRW = "<tr><td>"+name+"</td><td>" + \
                    str(correct) + "</td><td>"+str(wrong)+"</td></tr>\n"
                strTable = strTable + strRW
                correct = 0
                wrong = 0

hs = open(resultPath, 'a')
strTable = strTable + "\n</table>\n</html>"
hs.write(strTable)
# In[ ]:


# In[ ]:
