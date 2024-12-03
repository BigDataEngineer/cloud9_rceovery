#!/usr/bin/python3
"""
What is in a BST?
root, left child, right child
define a blueprint/template for a node
"""

class TreeNode:
    def __init__(self, value=0,left=None, right=None):
        self.value=value
        self.left=left
        self.right=right

   # Function to print inorder traversal
def printInorder(node):
    if node is None:
        return

    # First recur on left subtree
    printInorder(node.left)

    # Now deal with the node
    print(node.value, end=' ')

    # Then recur on right subtree
    printInorder(node.right)

# Driver code
if __name__ == '__main__':
    root = TreeNode(1)
#    root.left = TreeNode(2)
    root.right = TreeNode(3)
#    root.left.left = TreeNode(4)
#    root.left.right = TreeNode(5)
#    root.right.right = TreeNode(6)
    root.right.left = TreeNode(5)
    # Function call
    print("Inorder traversal of binary tree is:")
    printInorder(root)