import sys
from rdflib import Graph
 
# data = str(sys.argv[2])
path = "/Users/wvw/git/n3/vscode/n3-vscode/rbc.n3"

g = Graph()
g.parse(path, format='n3')
pp = g.serialize(format='n3')
print(pp)