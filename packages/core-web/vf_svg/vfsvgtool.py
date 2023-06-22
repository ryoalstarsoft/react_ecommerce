import re
import xml.etree.ElementTree
from pathlib import Path

class SvgModifier:
    def __init__(self, svg_fn):
        self.svg_fn = str(svg_fn)
        with open(svg_fn, 'r') as f:
            self.contents = f.read()
        self.basic_cleanup()

    def basic_cleanup(self):
        to_remove = [
            '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
            '<?xml version="1.0" encoding="UTF-8"?>'
        ]
        for s in to_remove:
            self.contents = self.contents.replace(s, '')
        to_remove_reg = [
            '<svg[^>]*>',
            '</svg>'
        ]
        for r in to_remove_reg:
            self.contents = re.sub(r, '', self.contents)

        # Remove unnecessary attributes
        for i in ['data-name']: #, 'width', 'height']:
            self.contents = re.sub(f' {i}=\"[^\"]*\"','', self.contents)
        # Remove unncessary blocks
        for i in ['title', 'desc']:
            self.contents = re.sub(f'<{i}>[^<]*</{i}>','', self.contents)
       
    def rename_id(self, frm, to):
        g_frm, g_to = f' id=\"{frm}\"', f' id=\"{to}\"'
        cnt = self.contents.count(g_frm)
        if cnt != 1:
            print(f'Invalid # of groups in {self.svg_fn} : found {cnt} of {frm}')
        assert(cnt == 1)
        self.contents = self.contents.replace(g_frm, g_to)
        
    def translate(self, id, trans, scale=None):
        if re.search(f'<[^>]*id="{id}"[^>]*transform[^>]*>', self.contents):
            if scale: dst = f'id="{id}" transform="translate({trans}) scale({scale})"'
            else:     dst = f'id="{id}" transform="translate({trans})"'
            self.contents = re.sub(f'id="{id}" transform=\"[^\"]*\"', dst, self.contents, count=1)
        elif re.search(f'<[^>]*id="{id}"[^>]*>', self.contents):
            if scale: dst = f'id="{id}" transform="translate({trans}) scale({scale})"'
            else:     dst = f'id="{id}" transform="translate({trans})"'
            self.contents = self.contents.replace(f'id="{id}"', dst)
        else:
            print('Failed to find entry to transform', self.svg_fn)

    def str_sub(self, frm, to):
        if re.search(frm, self.contents):
            self.contents = self.contents.replace(frm, to)
            return True
        return False

    def svg(self):
        return self.contents + '\n'

class VfSanityChecker:
    def __init__(self):
        self.expected_ids = []
    def add_expected(self, _id, suffixes=None):
        suffixes = suffixes or ['']
        self.expected_ids.extend([_id + str(s) for s in suffixes])
    def extract_ids(self, fn): # Use re
        doc = open(fn, 'r').read()
        m = re.findall('id=\"[^\"]*\"', doc)
        return m

    def extract_ids_by_xml(self, fn):
        print('Extracting id from', fn)
        doc = open(fn, 'r').read()
        doc = doc.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg>')
        doc = doc.replace('xlink:', '') # xml parser doesn't like this
        doc += '</svg>' # Wrap with tag to make it valid xml
        root = xml.etree.ElementTree.fromstring(doc) #.getroot()
        print(root.findall("."))
        ids = []
        selectors = [
            './/{http://www.w3.org/2000/svg}' + attr for attr in ['g', 'path', 'rect']
        ]
        for sel in selectors:
            for g in root.findall(sel):
                if 'id' in g.attrib:
                    ids.append(g.attrib['id'])
        return ids
    def check(self, fn):
        print('Checking sanity for', fn)
        ids = self.extract_ids(fn)
        for i in self.expected_ids:
            assert ids.count(i) == 1, f'Invalid id count {ids.count(i)} for id {i}'

class VfSvgGenerator:
    category = None
    tn_touch =  '''<g id="tn_touches">
                <rect id="tn_touch_7" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
                <rect id="tn_touch_6" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
                <rect id="tn_touch_5" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
                <rect id="tn_touch_4" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
                <rect id="tn_touch_3" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
                <rect id="tn_touch_2" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
                <rect id="tn_touch_1" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
                <rect id="tn_touch_0" x=".42" y=".42" width="65" height="65" rx="8" fill="#BD10E0" stroke="#D5D0D0"/>
            </g>'''

    def __new__(cls, category):
        for c in VfSvgGenerator.__subclasses__():
            if c.category == category:
                return super().__new__(c)
        assert False, f'Unknown category {category}'

    def __init__(self, category):
        self.empty_group_ids = ['missing_group']
        self.opt_svgs = ['common/filter_buttons.svg']
        self.out_dir = None
        self.fv_svg = None
        self.tn_svg = None
    @property
    def core_n_tn_fn(self):
        return Path(self.out_dir) / f'vf_{self.category}.svg'
    @property
    def core_fn(self):
        return Path(self.out_dir) / f'vf_{self.category}_core.svg'
    @property
    def tn_fn(self):
        return Path(self.out_dir) / f'vf_{self.category}_tn.svg'

    def load_core_svg(self, svg_fn):
        raise NotImplementedError
    def load_tn_svg(self, svg_fn):
        raise NotImplementedError

    def generate(self, out_dir):
        self.out_dir = out_dir
        self.merge_svg()
        #self.check_sanity(self.core_n_tn_fn)

    def load_svg_fixed(self, fn, id_fixes=None, pos_fixes=None, str_sub_fixes=None):
        id_fixes = id_fixes or {}
        pos_fixes = pos_fixes or {}
        str_sub_fixes = str_sub_fixes or {}
        svg = SvgModifier(fn)
        for k, v in id_fixes.items():
            if re.search(f'id="{k}"', svg.contents):
                svg.rename_id(k, v)
            else:
                print(f' * id {k} not found in {fn}')
        for k, v in pos_fixes.items():
            if re.search(f'id="{k}"', svg.contents):
                xy, scale = v[0], v[1]
                svg.translate(k, xy, scale)
            else:
                print(f' * id {k} not found in {fn}. No position change.')
        for k, v in str_sub_fixes.items():
            if not svg.str_sub(k, v):
                print(f' * pattern {k} not found in {fn}')
        return svg.contents

    def load_preset_arrow(self):
        fn = 'common/preset_arrows.svg'
        id_fixes = {
            'left-arrow-button': 'preset_back',
            'right-arrow-button': 'preset_forward',
            'path-1' : 'preset-arrow-path-1',
            'path-3' : 'preset-arrow-path-3',
            'filter-2' : 'preset-arrow-filter-2',
            'filter-4' : 'preset-arrow-filter-4',
        }
        pos_fixes = {
            'preset_back': ['5 50', 1],
            'preset_forward': ['210 50', 1],
        }
        str_subs = {
            'id="left-touch"' : 'id="left-touch" opacity="0"',
            'id="right-touch"' : 'id="right-touch" opacity="0"',
            '"#path-1"' : '"#preset-arrow-path-1"',
            '"#path-3"' : '"#preset-arrow-path-3"',
            '#filter-2': '#preset-arrow-filter-2',
            '#filter-4': '#preset-arrow-filter-4',
        }
        return self.load_svg_fixed(fn, id_fixes=id_fixes, pos_fixes=pos_fixes, str_sub_fixes=str_subs)

    def load_tn_arrow(self):
        fn = 'common/arrows.svg'
        return self.load_svg_fixed(fn)

    def merge_svg(self):
        print('Combining svgs into', self.core_n_tn_fn)
        with open(self.core_n_tn_fn, 'w') as f:
            self.write_header(f)
            f.write('<g id="fullview_area">\n')
            self.write_empty_group(f)
            f.write(self.load_core_svg(self.fv_svg))
            f.write('</g>\n')
            f.write('<g id="thumbnail_area" transform="translate(0, 0)">')
            f.write(self.load_tn_svg(self.tn_svg))
            f.write(self.load_preset_arrow())
            f.write(self.load_tn_arrow())
            for svg in self.opt_svgs:
                f.write(self.load_svg_fixed(svg))
            f.write('</g>')
            #f.write('</svg>')
        print('Processing core', self.core_fn)
        with open(self.core_fn, 'w') as f:
            self.write_header(f)
            self.write_empty_group(f)
            f.write(self.load_core_svg(self.fv_svg))
            #f.write('</svg>')

        print('Processing thumbnails', self.tn_fn)
        with open(self.tn_fn, 'w') as f:
            self.write_header(f)
            f.write(self.load_tn_svg(self.tn_svg))
            #f.write('</svg>')

    def get_sanity_checker(self):
        sc = VfSanityChecker()
        for g in [self.category + '_mannequin', 'missing_group']:
            sc.add_expected(g)
        return sc
    def check_sanity(self, fn):
        print('Checking sanity on', fn)
        sc = self.get_sanity_checker()
        sc.check(fn)

    # TODO: Separate into SVG writer class
    def write_empty_group(self, f):
        for group_name in self.empty_group_ids:
            f.write(f'<g id="{group_name}"></g>\n')
    def write_header(self, f):
        f.write('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n')
        #f.write('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n')


class VfWpantsSvgGenerator(VfSvgGenerator):
    category = 'wpants'

    def __init__(self, category): # Not directly called by user
        super().__init__(category)
        self.fv_svg = 'scoured/core_wpants.svg'
        self.tn_svg = 'scoured/tn_wpants.svg' # Temporary image until we get actual thumbnail image

        self.empty_group_ids += ['knee_0', 'ankle_0']

    def load_core_svg(self, svg_fn):
        id_fixups = {
            'mannequin_pants': 'wpants_mannequin',
            'rise_TA': 'touch_rise',
            'thigh_TA':        'touch_thigh',
            'knees_TA':        'touch_knee',
            'ankle_TA':        'touch_ankle',
            'pants_points': 'touch_points'
        }
        pos_fixes = {
            'Final_VF_Pants_2.0': [f'80 10', .7]
        }
        str_subs = {
            'g id="Final_VF_Pants_2.0"': 'g class="VF-Core-Pants" id="Final_VF_Pants_2.0"'
        }
        return self.load_svg_fixed(svg_fn, id_fixups, pos_fixes, str_subs)

    def load_tn_svg(self, svg_fn):
        # For now, use wtop thumbnail image as wpants thumbnail image
        id_fixups = {
            'selected': 'tn_HL',
            'ankle_TN' : 'tn_ankle',
            'ankle_0_TN' : 'tn_ankle_0',
            'ankle_1_TN' : 'tn_ankle_1',
            'ankle_2_TN' : 'tn_ankle_2',
            'ankle_3_TN' : 'tn_ankle_3',
            'knee_TN': 'tn_knee',
            'knee_0_TN': 'tn_knee_0',
            'knee_1_TN': 'tn_knee_1',
            'knee_2_TN': 'tn_knee_2',
            'thigh_TN': 'tn_thigh',
            'thigh_0_TN': 'tn_thigh_0',
            'thigh_1_TN': 'tn_thigh_1',
            'thigh_2_TN': 'tn_thigh_2',
            'rise_TN': 'tn_rise',
            'rise_0_TN': 'tn_rise_0',
            'rise_1_TN': 'tn_rise_1'
        }
        str_sub_fixes = {
            'path-': 'tn_path-',
            'mask-': 'tn_mask-',      # avoid conflict from core's mask
        }
        contents = self.load_svg_fixed(svg_fn, id_fixups, str_sub_fixes=str_sub_fixes)
        contents += self.tn_touch
        return contents

    def get_sanity_checker(self):
        sc = super().get_sanity_checker()
        for i in [
            'touch_rise', 'touch_thigh', 'touch_knee', 'touch_ankle']:
            sc.add_expected(i)
        sc.add_expected('rise_', range(3))
        sc.add_expected('thigh_', range(4))
        # sc.add_expected('knee_', range(3))
        # sc.add_expected('ankle_', range(5))
        return sc

class VfWtopSvgGenerator(VfSvgGenerator):
    category = 'wtop'

    def __init__(self, category): # Not directly called by user
        super().__init__(category)
        self.fv_svg = 'scoured/core_wtop.svg'
        self.tn_svg = 'scoured/tn_wtop.svg'

        self.empty_group_ids += ['top_length_0']

    def load_core_svg(self, svg_fn):
        id_fixups = {
            'mannequin': 'wtop_mannequin',
            'top_core_0_HL': 'coretype_0_HL',
            'top_core_1_HL': 'coretype_1_HL',
            'top_core_2_HL': 'coretype_2_HL',
            'top_core_3_HL': 'coretype_3_HL',
            'top_core_0': 'coretype_0',
            'top_core_1': 'coretype_1',
            'top_core_2': 'coretype_2',
            'top_core_3': 'coretype_3',
            'top_core_touch': 'coretype_touch',
            'sleeves_0_HL': 'sleeve_length_0_HL',
            'sleeves_1_HL': 'sleeve_length_1_HL',
            'sleeves_2_HL': 'sleeve_length_2_HL',
            'sleeves_3_HL': 'sleeve_length_3_HL',
            'sleeves_4_HL': 'sleeve_length_4_HL',
            'sleeves_5_HL': 'sleeve_length_5_HL',
            'sleeves_0': 'sleeve_length_0',
            'sleeves_1': 'sleeve_length_1',
            'sleeves_2': 'sleeve_length_2',
            'sleeves_3': 'sleeve_length_3',
            'sleeves_4': 'sleeve_length_4',
            'sleeves_5': 'sleeve_length_5',
            'sleeves_touch' : 'sleeve_length_touch',
            'length_0_HL': 'top_length_0_HL',
            'length_1_HL': 'top_length_1_HL',
            'length_2_HL': 'top_length_2_HL',
            'length_1': 'top_length_1',
            'length_2': 'top_length_2',
            'length_touch': 'top_length_touch',
            'Points': 'touch_points'
        }
        pos_fixes = {
            # 'touches_tops' : [f'-9 -18', None],
            'Final_VF_Tops_2.0': [f'70 0', 1]
        }

        str_subs = {
            'g id="Final_VF_Tops_2.0"': 'g class="VF-Core-Tops" id="Final_VF_Tops_2.0"'
        }
        return self.load_svg_fixed(svg_fn, id_fixups, pos_fixes, str_subs)

    def load_tn_svg(self, svg_fn):
        id_fixups = {
            'selected': 'tn_HL',
            'top_core_TN' : 'tn_coretype',
            'top_core_0_TN' : 'tn_coretype_0',
            'top_core_1_TN' : 'tn_coretype_1',
            'top_core_2_TN' : 'tn_coretype_2',
            'top_core_3_TN' : 'tn_coretype_3',
            'sleeves_TN' : 'tn_sleeve_length',
            'sleeves_0_TN' : 'tn_sleeve_length_0',
            'sleeves_1_TN' : 'tn_sleeve_length_1',
            'sleeves_2_TN' : 'tn_sleeve_length_2',
            'sleeves_3_TN' : 'tn_sleeve_length_3',
            'sleeves_4_TN' : 'tn_sleeve_length_4',
            'sleeves_5_TN' : 'tn_sleeve_length_5',
            'shoulder_TN': 'tn_shoulder',
            'shoulder_0_TN': 'tn_shoulder_0',
            'shoulder_1_TN': 'tn_shoulder_1',
            'shoulder_2_TN': 'tn_shoulder_2',
            'shoulder_3_TN': 'tn_shoulder_3',
            'length_TN' : 'tn_top_length',
            'length_0_TN' : 'tn_top_length_0',
            'length_1_TN' : 'tn_top_length_1',
            'length_2_TN' : 'tn_top_length_2',
            'neckline_TN' : 'tn_neckline',
            'neckline_0_TN' : 'tn_neckline_0',
            'neckline_1_TN' : 'tn_neckline_1',
            'neckline_2_TN' : 'tn_neckline_2',
            'neckline_3_TN' : 'tn_neckline_3',
            'neckline_4_TN' : 'tn_neckline_4',
        }
        contents = self.load_svg_fixed(svg_fn, id_fixups)
        contents += self.tn_touch
        return contents

    def get_sanity_checker(self):
        sc = super().get_sanity_checker()
        for i in [
            'shoulder_3_for_sleeves_0'
            ]:
            sc.add_expected(i)
        sc.add_expected('top_length_', range(2))
        sc.add_expected('coretype_', range(3))
        sc.add_expected('neckline_', range(4))
        sc.add_expected('shoulder_', range(3))
        sc.add_expected('sleeve_length_', range(5))
        return sc

class VfWshoesSvgGenerator(VfSvgGenerator):
    category = 'wshoes'

    def __init__(self, category): # Not directly called by user
        super().__init__(category)
        self.fv_svg = 'scoured/core_wshoes.svg'
        self.tn_svg = 'scoured/tn_wshoes.svg'
        self.empty_group_ids += ['shafts_0', 'counters_0', 'toes_0']

    def load_core_svg(self, svg_fn):
        id_fixups = {
            'mannequin': 'wshoes_mannequin',
            'counter_1': 'counters_1',
            'counter_2': 'counters_2',
            'shaft_1': 'shafts_1',
            'shaft_2': 'shafts_2',
            'shaft_3': 'shafts_3',
            'shaft_4': 'shafts_4',
            'bottoms_1': 'bottoms_x',
            'bottoms_2': 'bottoms_1',
            'bottoms_3': 'bottoms_2',
            'bottoms_4': 'bottoms_3',
            'bottoms_5': 'bottoms_4',
            'bottoms_6': 'bottoms_5',

            'counter_0_HL': 'counters_0_HL',
            'counter_1_HL': 'counters_1_HL',
            'counter_2_HL': 'counters_2_HL',

            'shaft_0_HL': 'shafts_0_HL',
            'shaft_1_HL': 'shafts_1_HL',
            'shaft_2_HL': 'shafts_2_HL',
            'shaft_3_HL': 'shafts_3_HL',

            'cover_0_HL': 'covers_0_HL',
            'cover_1_HL': 'covers_1_HL',
            'cover_2_HL': 'covers_2_HL',
            
            'shaft_0_HL': 'shafts_0_HL',
            'shaft_1_HL': 'shafts_1_HL',
            'shaft_2_HL': 'shafts_2_HL',
            'shaft_3_HL': 'shafts_3_HL',
            'shaft_4_HL': 'shafts_4_HL',

            'bottoms_1_HL': 'bottoms_x_HL',
            'bottoms_2_HL': 'bottoms_1_HL',
            'bottoms_3_HL': 'bottoms_2_HL',
            'bottoms_4_HL': 'bottoms_3_HL',
            'bottoms_5_HL': 'bottoms_4_HL',
            'bottoms_6_HL': 'bottoms_5_HL',

            'shoes_points': 'touch_points'
        }
        pos_fixes = {
            'Final_VF_Shoes_2.0': [f'45 10', .7]
        }
        str_subs = {
            'g id="Final_VF_Shoes_2.0"': 'g class="VF-Core-Shoes" id="Final_VF_Shoes_2.0"'
        }
 
        return self.load_svg_fixed(svg_fn, id_fixups, pos_fixes, str_subs)

    def load_tn_svg(self, svg_fn):
        id_fixups = {
            'selected': 'tn_HL',
            'counter_TN': 'tn_counters',
            'counter_0_TN': 'tn_counters_0',
            'counter_1_TN': 'tn_counters_1',
            'counter_2_TN': 'tn_counters_2',

            'bottoms_TN': 'tn_bottoms',
            'bottoms_0_TN': 'tn_bottoms_0',
            #'bottoms_1_TN': 'tn_bottoms_x',
            'bottoms_2_TN': 'tn_bottoms_1',
            'bottoms_3_TN': 'tn_bottoms_2',
            'bottoms_4_TN': 'tn_bottoms_3',
            'bottoms_5_TN': 'tn_bottoms_4',
            'bottoms_6_TN': 'tn_bottoms_5',

            'shaft_TN' : 'tn_shafts',
            'shaft_0_TN': 'tn_shafts_0',
            'shaft_1_TN': 'tn_shafts_1',
            'shaft_2_TN': 'tn_shafts_2',
            'shaft_3_TN': 'tn_shafts_3',
            'shaft_4_TN': 'tn_shafts_4',

            'cover_TN': 'tn_covers',
            'cover_0_TN': 'tn_covers_0',
            'cover_1_TN': 'tn_covers_1',
            'cover_2_TN': 'tn_covers_2',

            'toes_TN': 'tn_toes',
            'toes_0_TN': 'tn_toes_0',
            'toes_1_TN': 'tn_toes_1',
            'toes_2_TN': 'tn_toes_2',

            'mask-2': 'tn_mask-2', # avoid conflict from core's mask
            'mask-4': 'tn_mask-4',
            'mask-6': 'tn_mask-6',
        }
        str_sub_fixes = {
            'path-1"': 'tn_path-1"', # avoid conflict from core's mask
            'path-3': 'tn_path-3',
            'path-5': 'tn_path-5',
            '#mask-2': '#tn_mask-2',      # avoid conflict from core's mask
            '#mask-4': '#tn_mask-4',      # avoid conflict from core's mask
            '#mask-6': '#tn_mask-6',      # avoid conflict from core's mask
        }
        contents = self.load_svg_fixed(svg_fn, id_fixes=id_fixups, str_sub_fixes=str_sub_fixes)
        contents += self.tn_touch
        return contents

    def get_sanity_checker(self):
        sc = VfSanityChecker()
        sc.add_expected('toes_', range(3))
        sc.add_expected('covers_', range(3))
        sc.add_expected('counters_', range(3))
        sc.add_expected('bottoms_', range(5))
        sc.add_expected('shafts_', range(4))
        return sc
