import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { parsePagination } from '../../utils/pagination';
import type { ProductQueryInput, ProductSearchInput } from './product.validation';

function buildWhereClause(filters: ProductQueryInput): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.brandId) {
    where.brandId = filters.brandId;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.basePrice = {
      ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
      ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
    };
  }

  if (filters.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { shortDesc: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildOrderBy(sort: ProductQueryInput['sort']): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'price_asc':
      return { basePrice: 'asc' };
    case 'price_desc':
      return { basePrice: 'desc' };
    case 'rating':
      return { avgRating: 'desc' };
    case 'newest':
      return { createdAt: 'desc' };
    case 'bestselling':
      return { totalSold: 'desc' };
    case 'featured':
    default:
      return { isFeatured: 'desc' };
  }
}

const productListInclude = Prisma.validator<Prisma.ProductInclude>()({
  images: { where: { isPrimary: true }, take: 1 },
  brand: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
});

export const productService = {
  async findAll(filters: ProductQueryInput) {
    const where = buildWhereClause(filters);
    const orderBy = buildOrderBy(filters.sort);
    const { skip, take, page, limit } = parsePagination({
      page: String(filters.page),
      limit: String(filters.limit),
    });

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productListInclude,
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          where: { isActive: true },
          include: { attributes: true },
        },
        specifications: { orderBy: [{ groupName: 'asc' }, { sortOrder: 'asc' }] },
        brand: { select: { id: true, name: true, slug: true, imageUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            title: true,
            body: true,
            isVerified: true,
            createdAt: true,
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return product;
  },

  async search(filters: ProductSearchInput) {
    const where: Prisma.ProductWhereInput = { isActive: true };

    // Text search (optional)
    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { shortDesc: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    // Category by slug (e.g. "mobiles") or by ID
    if (filters.category) {
      const cat = await prisma.category.findFirst({
        where: { slug: { equals: filters.category, mode: 'insensitive' } },
        include: { children: true },
      });
      if (cat) {
        const catIds = [cat.id, ...cat.children.map(c => c.id)];
        where.categoryId = { in: catIds };
      }
    } else if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.basePrice = {
        ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
      };
    }

    const orderBy = buildOrderBy(filters.sort);
    const { skip, take, page, limit } = parsePagination({
      page: String(filters.page),
      limit: String(filters.limit),
    });

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productListInclude,
        orderBy,
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findFeatured() {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: productListInclude,
      take: 20,
      orderBy: { totalSold: 'desc' },
    });

    return products;
  },
};
