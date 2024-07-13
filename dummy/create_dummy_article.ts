import { generateCUID } from '../src/common/utils/cuid';
import createDummyCategories from './create_dummy_category';
import testPrisma from './test_prisma';

export default async function createDummyArticles(count: number) {
  const categories = await createDummyCategories(5);

  const articles = Array.from({ length: count }, (_, i) => ({
    id: `id-${i}-${generateCUID()}`,
    title: `title-${generateCUID()}-${i + 1}`,
    categoryId: categories[i % 5].id,
    content: generateCUID().repeat(100),
    visible: true,
    thumbnail: `https://static.imkdw.dev/images/pepe-404.jpg`,
  }));

  await testPrisma.articles.createMany({
    data: articles,
  });

  return articles;
}
