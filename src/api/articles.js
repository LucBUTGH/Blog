const API_URL = import.meta.env.VITE_API_URL;

export const fetchArticles = async () => {
  try {
    const response = await fetch(
      `${API_URL}/articles?populate=tags&populate=source`
    );
    const data = await response.json();
    return data.data.map((item) => ({
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      short_desc: item.short_desc,
      date: item.date,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
      tags:
        item.tags?.map((tag) => ({
          id: tag.id,
          category: tag.category,
        })) || [],
      time_read: item.time_read,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const fetchArticleByDocumentId = async (documentId) => {
  const response = await fetch(
    `${API_URL}/articles?filters[documentId][$eq]=${documentId}&populate=tags&populate=source`
  );
  const data = await response.json();
  console.log(data);
  if (data.data.length === 0) {
    return null; // Pas trouvé
  }
  const item = data.data[0];
  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    short_desc: item.short_desc,
    content: item.content,
    date: item.date,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt,
    tags:
      item.tags?.map((tag) => ({
        id: tag.id,
        category: tag.category,
      })) || [],
    source:
      item.source?.map((src) => ({
        id: src.id,
        label: src.label,
        url: src.url,
      })) || [],
    time_read: item.time_read,
  };
};
