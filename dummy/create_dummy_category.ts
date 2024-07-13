import testPrisma from './test_prisma';

export default async function createDummyCategories(count: number) {
  const categories = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `category-${i + 1}`,
    image: `https://dummyimage.com/300x200/000/fff.png`,
    desc: `description-${i + 1}`,
    sort: i + 1,
  }));

  await testPrisma.categories.createMany({
    data: categories,
  });

  return categories;
}
