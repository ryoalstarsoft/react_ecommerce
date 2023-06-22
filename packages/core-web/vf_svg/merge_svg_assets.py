#
# Merge individual svg files while setting proper group names
#
import sys
from vfsvgtool import VfSvgGenerator

def generate_all_vf_svg(category):
    outdir = '../assets/svg'
    VfSvgGenerator(category).generate(outdir)

if __name__ == '__main__':
    generate_all_vf_svg(sys.argv[1])
