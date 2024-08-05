import { Block, BlockId } from './blocks';

export function getImageUrls(block: Block): string[] {
  let imageUrls: string[] = [];

  if (block.type === 'Image' && block.options && typeof block.options.url === 'string') {
    imageUrls.push(block.options.url);
  }

  if (block.children && block.children.length > 0) {
    for (const childBlock of block.children) {
      imageUrls = imageUrls.concat(getImageUrls(childBlock));
    }
  }

  return imageUrls;
}

export function findBlockAndParent(rootBlock: Block, blockId: BlockId): { block: Block | null; parent: Block | null } {
  const stack: { block: Block; parent: Block | null }[] = [{ block: rootBlock, parent: null }];

  while (stack.length > 0) {
    const { block, parent } = stack.pop()!;

    if (block.id === blockId) {
      return { block, parent };
    }

    if (block.children) {
      for (const child of block.children) {
        stack.push({ block: child, parent: block });
      }
    }
  }

  return { block: null, parent: null };
}

export function moveBlock(rootBlock: Block, sourceBlockId: BlockId, targetBlockId: BlockId): Block {
  const { block: sourceBlock, parent: sourceParent } = findBlockAndParent(rootBlock, sourceBlockId);
  const { block: targetBlock } = findBlockAndParent(rootBlock, targetBlockId);

  if (!sourceBlock || !targetBlock) {
    throw new Error('Source or target block not found');
  }

  if (sourceParent && sourceParent.children) {
    sourceParent.children = sourceParent.children.filter((child) => child.id !== sourceBlockId);
  } else if (rootBlock.id === sourceBlockId) {
    throw new Error('Cannot move root block');
  }

  if (!targetBlock.children) {
    targetBlock.children = [];
  }
  targetBlock.children.push(sourceBlock);

  return rootBlock;
}

export function findParentIds(rootBlock: Block, targetId: BlockId): BlockId[] | false {
  const parentIds: BlockId[] = [];

  function traverse(block: Block, path: BlockId[]): boolean {
    if (block.id === targetId) {
      parentIds.push(...path);
      return true;
    }
    if (block.children) {
      for (const child of block.children) {
        if (traverse(child, [...path, block.id])) {
          return true;
        }
      }
    }
    return false;
  }

  if (traverse(rootBlock, [])) {
    return parentIds.reverse();
  }
  return false;
}
