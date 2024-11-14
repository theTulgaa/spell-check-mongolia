from spylls.hunspell import Dictionary
import os

dir = os.path.dirname(os.path.realpath(__file__)) + '/languages/mn_Mn'
dictionary = Dictionary.from_files(dir)


senctence = "сайн бабйна уу? бии саййн байгаа мэнд амар"
words = senctence.split()

l = []

# for word in words:
#     if not dictionary.lookup(word):
#       suggestions = list(dictionary.suggest(word))
#       l.append((word, suggestions[0] if suggestions else "No suggestions"))

# print("Misspelled words and suggestions:")
# for word, suggestion in l:
#   print(f"{word} -> {suggestion}")

# ----------------------------

def manual_stem(word):
    stems = [form.stem for form in dictionary.lookuper.good_forms(word)]
    return stems if stems else ["No stems found"]

# Test word
word = "амархан"
stems = manual_stem(word)
print(f"Word: {word}")
print(f"Root word(s): {', '.join(stems)}")

# def count_similar_words(ыэут):
