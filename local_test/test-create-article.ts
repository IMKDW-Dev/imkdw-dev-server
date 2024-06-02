import testPrisma from './test-prisma';

const init = async () => {
  const CATEGORY_DATA = [
    {
      id: Math.floor(Math.random() * 1_000_000),
      name: '카테고리1',
      sort: 1,
      desc: '카테고리1 입니다.',
    },
    {
      id: Math.floor(Math.random() * 1_000_000),
      name: '카테고리2',
      sort: 2,
      desc: '카테고리2 입니다.',
    },
    {
      id: Math.floor(Math.random() * 1_000_000),
      name: '카테고리3',
      sort: 3,
      desc: '카테고리3 입니다.',
    },
  ];

  await testPrisma.categories.createMany({ data: CATEGORY_DATA });

  let titleId = 1;
  for (let i = 1; i <= 3; i += 1) {
    for (let j = 1; j <= 1000; j += 1) {
      const id = `ID_${titleId.toString()}`;
      const title = `TITLE_${(i * j).toString()}`;
      const content = `CONTENT_${(i * j).toString()}`;
      await testPrisma.articles.create({
        data: {
          id,
          title,
          content,
          categoryId: CATEGORY_DATA[i - 1].id,
          visible: true,
        },
      });
      titleId += 1;
    }
  }
};

init();
