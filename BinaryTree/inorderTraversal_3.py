#!/usr/bin/python3
class Node:
    def __init__(self,value=0,left=None,right=None):
        self.value = value
        self.left = left
        self.right = right
        
def inorderTraversal(node, level=1):
    try:
        print('Function call #', level, 'node.value:',node.value)
    except:
        print('Node is None')
    if node is None:
        return
    else:
        print('calling inorderTraversal node.left, Function call #:', level+1)
        inorderTraversal(node.left, level+1)
        print('print node value',node.value)
        print('Function call #', level)
        print('calling inorderTraversal node.right, Function call #:', level+1)
        inorderTraversal(node.right, level+1)
        
if __name__ == '__main__':
    root = Node(1)
    root.left = Node(3)
#    root.left.left = Node(2)
#    root.left.right = Node(22)
#    root.left.right.left = Node(1) 
    root.right = Node(7)
#    root.right.left = TreeNode(None)
#    root.right.right = Node(10)
#    root.right.right.left = Node(11)
#    root.right.right.right = TreeNode(None)
    inorderTraversal(root)
    