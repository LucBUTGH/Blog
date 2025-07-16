export interface Tag {
  id: number;
  category: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  short_desc: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  tags: Tag[];
  source: string;
}

export interface ApiResponse {
  data: {
    id: number;
    attributes: {
      documentId: string;
      title: string;
      short_desc: string;
      content: string;
      date: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      tags: {
        data: Array<{
          id: number;
          attributes: {
            category: string;
          };
        }>;
      };
    };
  }[];
  meta: any;
}

export interface SingleArticleResponse {
  data: {
    id: number;
    attributes: {
      documentId: string;
      title: string;
      short_desc: string;
      content: string;
      date: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      tags: {
        data: Array<{
          id: number;
          attributes: {
            category: string;
          };
        }>;
      };
    };
  };
  meta: any;
}
