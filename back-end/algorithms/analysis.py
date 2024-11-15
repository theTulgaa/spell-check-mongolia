from spylls.hunspell import Dictionary
import os
from difflib import SequenceMatcher

dir = 'C:/Users/Acer/OneDrive/Desktop/my project/spell-check-mongolia/back-end/languages/mn_MN'
dictionary = Dictionary.from_files(dir)

def manual_stem(word):
    stems = [form.stem for form in dictionary.lookuper.good_forms(word)]
    return stems[0] if stems else word

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

def count_stems(stems, words):
    # Hashable (string эсвэл tuple) төрлийн үндэс үгс ашиглах
    stems = [tuple(stem) if isinstance(stem, list) else stem for stem in stems]
    stem_freq = {}
    
    for stem in stems:
        stem_freq[stem] = 0
        for i in range(0, len(words)):
            word_stem = manual_stem(words[i])
            if not are_stems_similar(word_stem, stem):
                stem_freq[stem] += 1
        

    return stem_freq



# Тест үгс
news = ["НДШ бол татвар биш НДШ төлөхийг ажилтан ажил олгогчоосоо шаардаж байх ёстой НДШ-ийг хувааж төлснөөр ажилтан маань ирээдүйдээ хэрэглэхээр хадгалж байгаа шимтгэл юм НӨАТ-ын хувьд реформ хийнэ гэдэг амлалт хаана ч байхгүй Хэрэглэгчийн эцсийн татвар байдаг НӨАТ ын хувьд өргөн хэрэглээний бараан дээр байдаггүй Өргөн хэрэглээний инфляцад нөлөөлдөг маш их барааг чөлөөлсөн байдаг Хүн амын бага орлоготой хэсэг дээр НӨАТ бага тусдаг өндөр хэрэглээтэй хэсэг дээр НӨАТ 10 хувь хүртэл байдаг 10 хувиас давахгүй "]
news = news[0] 
words = news.split(" ")
stems = different_stems(words)

# Үр дүнг хэвлэх
print("Ижил төстэй байдал нь 70%-иас бага үндэс үгс:", stems)

freq = count_stems(stems, words)
print("Ижил үндэстэй үгийн давтамж:", freq)

 