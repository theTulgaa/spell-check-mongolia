from spylls.hunspell import Dictionary
import os
dir = os.path.dirname(os.path.realpath(__file__)) + '/languages/mn_Mn'

dictionary = Dictionary.from_files(dir)

print(dictionary.lookup('сөйн'))

for sug in dictionary.suggest("сайнн"):
  print(sug)
