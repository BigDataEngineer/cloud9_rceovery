#!/usr/bin/python3       
class Node:
    def __init__(self, value=0,left=None, right=None):
        self.value=value
        self.left=left
        self.right=right        
        
def inorderTraversal(node):
    if node is None:
        return None
    else:
        inorderTraversal(node.left)
        print(node.value, end=' ')
        inorderTraversal(node.right)
        return None
        
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
    