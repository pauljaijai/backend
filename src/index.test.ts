import { findBlockAndParent, findParentIds, getImageUrls, moveBlock } from '.';
import { blocks } from './blocks';

describe('Block functions', () => {
  describe('Question 1: getImageUrls', () => {
    test('- should return all image URLs in the block tree', () => {
      const result = getImageUrls(blocks);
      expect(result).toEqual([
        'https://cdn.example.org/k.png',
        'https://cdn.example.org/a.jpg',
        'https://cdn.example.org/c.jpg',
        'https://cdn.example.org/t.png',
        'https://cdn.example.org/x.gif',
        'https://cdn.example.org/p.jpg',
        'https://cdn.example.org/z.jpg',
      ]);
    });
  });

  describe('findBlockAndParent', () => {
    test('- should find the block and its parent', () => {
      const result = findBlockAndParent(blocks, 'ea3rb4fdUAjbeestD9bmKc');
      expect(result.block?.id).toBe('ea3rb4fdUAjbeestD9bmKc');
      expect(result.parent?.id).toBe('5fprgzZ56EuHSb7m4Kk5tr');
    });

    test('- should return null if the block is not found', () => {
      const result = findBlockAndParent(blocks, 'non-existent-id');
      expect(result.block).toBeNull();
      expect(result.parent).toBeNull();
    });
  });

  describe('Question 2:moveBlock', () => {
    test('-should move the block from one parent to another', () => {
      moveBlock(blocks, 'ea3rb4fdUAjbeestD9bmKc', '5fprgzZ56EuHSb7m4Kk5tr');

      const result = findBlockAndParent(blocks, 'ea3rb4fdUAjbeestD9bmKc');
      expect(result.parent?.id).toBe('5fprgzZ56EuHSb7m4Kk5tr');
    });

    test('-should throw an error if source or target block is not found', () => {
      expect(() => moveBlock(blocks, 'non-existent-id', '1')).toThrow('Source or target block not found');
    });

    test('-should throw an error if trying to move the root block', () => {
      expect(() => moveBlock(blocks, 'root', '1')).toThrow('Source or target block not found');
    });
  });

  describe('Question 3: findParentIds', () => {
    test('-should return an array of parent IDs in the correct order', () => {
      const result = findParentIds(blocks, '2m4WRKVtwL5R9mmQDoQCNK');
      expect(result).toEqual(['5fprgzZ56EuHSb7m4Kk5tr']);
    });

    test('-should return false if the target block is not found', () => {
      const result = findParentIds(blocks, 'non-existent-id');
      expect(result).toBe(false);
    });
  });
});
