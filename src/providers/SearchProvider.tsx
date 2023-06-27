import { createContext, useContext, useEffect, useState } from "react";

const MARVEL_API_KEY = "2691643914b2e2abf77b6b5b7de5b867";

type Thumbnail = {
  path: string;
  extension: string;
};

type CharacterAppearances = {
  available: number;
  collectionURI: string;
  items: [];
  returned: number;
};

type MoreInfoUrl = {
  type: string;
  url: string;
};

type CharactersUrls = MoreInfoUrl[];

type PortraitImageVariants =
  | "portrait_small"
  | "portrait_medium"
  | "portrait_xlarge"
  | "portrait_fantastic"
  | "portrait_uncanny"
  | "portrait_incredible";

type StandardImageVariants =
  | "standard_small"
  | "standard_medium"
  | "standard_large"
  | "standard_xlarge"
  | "standard_fantastic"
  | "standard_amazing";

type LandscapeImageVariants =
  | "landscape_small"
  | "landscape_medium"
  | "landscape_large"
  | "landscape_xlarge"
  | "landscape_amazing"
  | "landscape_incredible";

export type Hero = {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: Thumbnail;
  resourceURI: string;
  comics: CharacterAppearances;
  series: CharacterAppearances;
  stories: CharacterAppearances;
  events: CharacterAppearances;
  urls: CharactersUrls;
};

export type HeroImageOps = {
  path: string;
  extension: string;
  variant:
    | PortraitImageVariants
    | StandardImageVariants
    | LandscapeImageVariants;
};

interface SearchContext {
  searchActive: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  heros: Hero[] | [];
  heroImagePath: (ops: HeroImageOps) => string;
}

const DEFAULT_VALUES = {
  searchActive: false,
  searchValue: "",
  setSearchValue: (value: string) => {},
  heros: [],
  heroImagePath: (ops: HeroImageOps) => "",
};

const SearchContext = createContext<SearchContext>(DEFAULT_VALUES);

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error("Missing SearchContext on React three");
  }

  return context;
};

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [heros, setHeros] = useState<Hero[]>([]);

  const fetchForHeros = () => {
    const endpoint = new URL(
      `characters?limit=100&nameStartsWith=${searchValue}&apikey=${MARVEL_API_KEY}`,
      "http://gateway.marvel.com/v1/public/"
    );

    fetch(endpoint)
      .then((_res) => _res.json())
      .then((res) => {
        setHeros(res.data.results);
      });
  };

  const heroImagePath = (imageOpts: HeroImageOps) => {
    const imageUrl = `${imageOpts.path}/${imageOpts.variant}.${imageOpts.extension}`;

    return imageUrl;
  };

  useEffect(() => {
    if (searchValue.length >= 2) {
      fetchForHeros();
    }
  }, [searchValue]);

  const value = {
    searchActive: searchValue.length >= 2,
    searchValue,
    setSearchValue,
    heros,
    heroImagePath,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
