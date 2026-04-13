import { MockService } from './mock.service';
export declare class MockController {
    private readonly mockService;
    constructor(mockService: MockService);
    getFeed(): ({
        id: number;
        user: {
            name: string;
            handle: string;
            avatar: string;
            verified: boolean;
        };
        location: string;
        image: string;
        caption: string;
        likes: number;
        comments: number;
        time: string;
        type: string;
        tripData?: undefined;
    } | {
        id: number;
        user: {
            name: string;
            handle: string;
            avatar: string;
            verified: boolean;
        };
        location: string;
        caption: string;
        likes: number;
        comments: number;
        time: string;
        type: string;
        tripData: {
            title: string;
            days: number;
            budget: string;
            stops: string[];
        };
        image?: undefined;
    })[];
    getDestinations(): {
        id: string;
        name: string;
        region: string;
        image: string;
        tags: string;
        weather: string;
        vibeScore: number;
        cost: string;
        description: string;
        stats: {
            weather: string;
            bestTime: string;
            budget: string;
        };
        highlights: string[];
    }[];
    getStays(): {
        id: string;
        name: string;
        location: string;
        price: string;
        rating: number;
        image: string;
        type: string;
        amenities: string[];
        tags: string[];
    }[];
    getFestivals(): {
        id: string;
        name: string;
        location: string;
        dates: string;
        month: string;
        day: string;
        image: string;
        tags: string[];
    }[];
    getDestinationById(id: string): {
        id: string;
        name: string;
        region: string;
        image: string;
        tags: string;
        weather: string;
        vibeScore: number;
        cost: string;
        description: string;
        stats: {
            weather: string;
            bestTime: string;
            budget: string;
        };
        highlights: string[];
    } | undefined;
    getProfile(): {
        name: string;
        handle: string;
        bio: string;
        location: string;
        image: string;
        stats: {
            posts: number;
            followers: string;
            following: number;
        };
        posts: string[];
    };
    getWikis(): {
        id: string;
        name: string;
        region: string;
        views: string;
    }[];
    getGoOutRequests(): {
        id: string;
        user: {
            name: string;
            age: number;
            image: string;
        };
        trip: {
            title: string;
            destination: string;
            date: string;
            type: string;
            budget: string;
        };
        description: string;
    }[];
    getStories(): ({
        id: number;
        name: string;
        image: string;
        isUser: boolean;
    } | {
        id: number;
        name: string;
        image: string;
        isUser?: undefined;
    })[];
    addGoOutRequest(request: any): any;
    addGroup(group: any): any;
    toggleLike(id: string): {
        likes: number;
        liked: boolean;
    } | null;
    updateProfile(profile: any): {
        name: string;
        handle: string;
        bio: string;
        location: string;
        image: string;
        stats: {
            posts: number;
            followers: string;
            following: number;
        };
        posts: string[];
    };
    addComment(id: string, text: string): {
        success: boolean;
        comments: number;
    } | {
        success: boolean;
        comments?: undefined;
    };
    generateItinerary(prompt: string): {
        success: boolean;
        itinerary: string;
    };
    savePost(id: string): {
        success: boolean;
        saved: boolean;
    };
    getChats(): {
        id: string;
        name: string;
        lastMessage: string;
        time: string;
        unread: number;
        image: string;
    }[];
    getMessages(id: string): any[];
    sendMessage(id: string, text: string): {
        id: string;
        text: string;
        sender: string;
        time: string;
        isMe: boolean;
    };
    getWikiPage(id: string): {
        id: string;
        title: string;
        subtitle: string;
        image: string;
        sections: {
            overview: string;
            howToReach: string;
            budget: {
                item: string;
                cost: string;
            }[];
            stays: {
                name: string;
                price: string;
                rating: string;
                img: string;
            }[];
        };
    };
    getTrips(): {
        id: number;
        host: string;
        hostAvatar: string;
        title: string;
        desc: string;
        date: string;
        loc: string;
        type: string;
    }[];
}
