
export interface NotePage {
  id: string;
  title: string;
  content: string;
  tags: string[];
  places: PlaceMarker[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceMarker {
  id: string;
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
}

export interface TagCache {
  [tag: string]: string[]; // tag -> array of page IDs
}
