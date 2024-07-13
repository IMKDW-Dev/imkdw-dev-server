import createDummyArticles from './create_dummy_article';

const main = async () => {
  await createDummyArticles(100000);
};

main();
