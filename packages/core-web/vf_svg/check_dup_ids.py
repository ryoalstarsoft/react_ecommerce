import sys
from vfsvgtool import VfSanityChecker
from collections import Counter
vsc = VfSanityChecker()
ids = vsc.extract_ids('../assets/svg/vf_wpants_core.svg')
ids += vsc.extract_ids('../assets/svg/vf_wshoes_core.svg')
ids += vsc.extract_ids('../assets/svg/vf_wtop_core.svg')

cntr = Counter(ids)
for id, count in cntr.items():
    if count > 1:
        print(id, count)


