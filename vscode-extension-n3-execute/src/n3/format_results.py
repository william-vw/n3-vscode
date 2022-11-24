import sys
from rdflib import Graph

g = Graph()
g.parse(data=str(sys.argv[2]), format='n3')
print(g.serialize(format='n3'))

