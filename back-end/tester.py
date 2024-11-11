from spylls.hunspell import Dictionary
import os

dir = os.path.dirname(os.path.realpath(__file__)) + '/languages/mn_Mn'
dictionary = Dictionary.from_files(dir)

senctence = "сайн бабйна уу? бии саййн байгаа мэнд амар"
words = senctence.split()

l = []

for word in words:
  if not dictionary.lookup(word):
    # for sug in 

print(l)