from spylls.hunspell import Dictionary
import os
from difflib import SequenceMatcher

dir = os.path.dirname(os.path.realpath(__file__)) + '/languages/mn_Mn'
dictionary = Dictionary.from_files(dir)


# senctence = "сайн бабйна уу? бии саййн байгаа мэнд амар"
# words = senctence.split()

# l = []

# # for word in words:
# #     if not dictionary.lookup(word):
# #       suggestions = list(dictionary.suggest(word))
# #       l.append((word, suggestions[0] if suggestions else "No suggestions"))

# # print("Misspelled words and suggestions:")
# # for word, suggestion in l:
# #   print(f"{word} -> {suggestion}")

# # ----------------------------

# def manual_stem(word):
#     stems = [form.stem for form in dictionary.lookuper.good_forms(word)]
#     return stems if stems else ["No stems found"]

# # Test word
# word = "амархан"
# stems = manual_stem(word)
# print(f"Word: {word}")
# print(f"Root word(s): {', '.join(stems)}")


def manual_stem(word):
    stems = [form.stem for form in dictionary.lookuper.good_forms(word)]
    return stems[0] if stems else ["No stems found"]

# Ижил төстэй байдлыг шалгах функц
def are_stems_similar(stem1, stem2, threshold=0.7):
    similarity = SequenceMatcher(None, stem1, stem2).ratio()
    return similarity < threshold  # 70%-иас бага ижил төстэй байвал үнэн гэж үзнэ

# Үндэс үгсийг ялгах
def different_stems(words):
    stems = []  

    l = len(words)
    for i in range(0, l):
        stem1 = manual_stem(words[i])
        
        # Шалгаж эхлэхдээ, эхний үгийг үндэс үгсийн массивт нэмэх
        if not any(are_stems_similar(stem1, s) for s in stems):
            stems.append(stem1)

        for j in range(i + 1, l):
            stem2 = manual_stem(words[j])
            if are_stems_similar(stem1, stem2) and (stem2 not in stems):
                stems.append(stem2)
    
    return stems

# Тест үгс
words = ["амархан", "амар", "хан", "амархаан", "адуу", "адууны", "адуутай"]
stems = different_stems(words)

# Үр дүнг хэвлэх
print("Ижил төстэй байдал нь 70%-иас бага үндэс үгс:", stems)




