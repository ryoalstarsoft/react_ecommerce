# scour is disabled due to an issue that it removes empty group

all: wpants wtop wshoes

scour:
	mkdir -p scoured
	scour -i originals/Final_VF_Pants_2.0.svg -o scoured/core_wpants.svg --set-precision=3
	scour -i originals/pants_TN.svg -o scoured/tn_wpants.svg --set-precision=3
	scour -i originals/Final_VF_Shoes_2.0.svg -o scoured/core_wshoes.svg --set-precision=3
	scour -i originals/shoes_TN.svg -o scoured/tn_wshoes.svg --set-precision=3
	scour -i originals/Final_VF_Tops_2.0.svg -o scoured/core_wtop.svg --set-precision=3
	scour -i originals/tn_tops.svg -o scoured/tn_wtop.svg --set-precision=3
    
wtop: scour
	python merge_svg_assets.py wtop

wpants: scour
	python merge_svg_assets.py wpants

wshoes: scour
	python merge_svg_assets.py wshoes

.PHONY: scour wpants wtop wshoes all
