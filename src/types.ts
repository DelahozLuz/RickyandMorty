export type Character = {
    id: string;
    name: string;
    image: string;
    species: string;
    status?: string;
    gender?: string;
    origin?: { name: string };
  };
  
  export type CharacterExtraData = {
    favorite: boolean;
    comment: string;
    deleted?: boolean;
  };
  