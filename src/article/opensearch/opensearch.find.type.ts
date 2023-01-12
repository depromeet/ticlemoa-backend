export type QueryType = {
  query: {
    bool: {
      must: object[];
      should: object[];
      must_not: object[];
      filter: object[];
    };
  };
  post_filter?: object;
  explain?: boolean;
};

export type SearchResponseType = {
  data: SearchType;
};
export type OneSearchType = {
  _index: string;
  _id: string;
  _source: {
    id: number;
    url: string;
    title: string;
    content: string;
    tags: string[];
    tagIds: number[];
    isPublic: boolean;
    userId: number;
  };
};

export type SearchType = {
  took: number;
  timed_out: boolean;
  hits: {
    total: {
      value: number;
    };
    hits: OneSearchType[];
  };
};
