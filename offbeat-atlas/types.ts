
export type Screen = 'feed' | 'discover' | 'community' | 'tribe' | 'wiki' | 'login' | 'profile';

export interface Post {
  id: string;
  author: string;
  location: string;
  date: string;
  avatar: string;
  image: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  status: string;
  image: string;
}

export interface TripEvent {
  id: string;
  host: string;
  hostAvatar: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  type: 'trek' | 'surf' | 'photo' | 'cycling';
}
