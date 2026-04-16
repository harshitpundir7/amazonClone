import { prisma } from '@/server/config/database';
import { AppError } from '@/server/middleware/error-handler';

interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId: number | null;
  children: CategoryNode[];
}

function buildTree(categories: any[]): CategoryNode[] {
  const map = new Map<number, CategoryNode>();
  const roots: CategoryNode[] = [];

  for (const cat of categories) {
    map.set(cat.id, {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl,
      description: cat.description,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      parentId: cat.parentId,
      children: [],
    });
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!;
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export const categoryService = {
  async findAll() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return buildTree(categories);
  },

  async findBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });

    if (!category || !category.isActive) {
      return null;
    }

    return category;
  },

  async findTree() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return buildTree(categories);
  },
};
