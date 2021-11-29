export type SourcegraphSearchResult = {
  name: string;
  url: string;
  file: string;
  path: string;
  highlights: string[][] | null;
};
