/**
 * Firestore helper functions for Musafir
 * All collections read from Firestore; falls back gracefully on error.
 */
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    increment,
    query,
    orderBy,
    where,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    runTransaction,
    Transaction
} from "firebase/firestore";
import { db } from "./firebase";

// ----------- Posts -----------

export interface Post {
    id: string;
    user: { name: string; handle: string; avatar: string; verified: boolean };
    location: string;
    image?: string;
    caption: string;
    likes: number;
    comments: number;
    time: string;
    type: "photo" | "trip";
    tripData?: { title: string; days: number; budget: string; stops: string[] };
}

export async function getPosts(): Promise<Post[]> {
    const snap = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }));
}

/** Real-time listener for posts */
export function subscribeToPosts(callback: (posts: Post[]) => void): () => void {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
        const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Post[];
        callback(posts);
    });
}

/**
 * Toggle like on a post. Uses arrayUnion/arrayRemove on `likedBy` field.
 * Returns new liked state.
 */
export async function toggleLike(postId: string, uid: string): Promise<boolean> {
    const { arrayUnion, arrayRemove } = await import("firebase/firestore");
    const ref = doc(db, "posts", postId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Post not found");
    const likedBy: string[] = snap.data().likedBy || [];
    const isLiked = likedBy.includes(uid);
    await updateDoc(ref, {
        likedBy: isLiked ? arrayRemove(uid) : arrayUnion(uid),
        likes: increment(isLiked ? -1 : 1),
    });
    return !isLiked;
}

// ----------- Comments -----------

export interface Comment {
    id: string;
    text: string;
    uid: string;
    authorName: string;
    authorAvatar: string;
    createdAt: Timestamp | null;
}

export async function getComments(postId: string): Promise<Comment[]> {
    const snap = await getDocs(
        query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }));
}

export function subscribeToComments(postId: string, callback: (c: Comment[]) => void): () => void {
    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Comment[]);
    });
}

/** Adds a comment and increments post.comments counter */
export async function addComment(
    postId: string,
    text: string,
    author: { uid: string; name: string; avatar: string }
): Promise<void> {
    await addDoc(collection(db, "posts", postId, "comments"), {
        text,
        uid: author.uid,
        authorName: author.name,
        authorAvatar: author.avatar,
        createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "posts", postId), { comments: increment(1) });
}

// ----------- Saves (Bookmarks) -----------

/**
 * Toggle save/unsave a post for a user.
 * Stores saved post IDs in users/{uid}.savedPosts array.
 * Returns new saved state.
 */
export async function toggleSave(postId: string, uid: string): Promise<boolean> {
    const { arrayUnion, arrayRemove } = await import("firebase/firestore");
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    const savedPosts: string[] = snap.exists() ? (snap.data().savedPosts || []) : [];
    const isSaved = savedPosts.includes(postId);
    await updateDoc(userRef, {
        savedPosts: isSaved ? arrayRemove(postId) : arrayUnion(postId),
    });
    return !isSaved;
}

export async function getSavedPosts(uid: string): Promise<string[]> {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return [];
    return snap.data().savedPosts || [];
}


// ----------- Destinations -----------

export interface Destination {
    id: string;
    type?: "tourist" | "offbeat";
    name: string;
    region: string;
    image: string; // Keep for backward compatibility
    photos?: string[];
    tags: string; // Using for smart tags mostly now
    category?: string;
    subCategories?: string[];
    mapUrl?: string;
    rating?: number;
    reviewCount?: number;
    ratings?: Record<string, number>; // uid -> score
    weather: string;
    vibeScore: number;
    cost: string;
    description: string;
    stats: { weather: string; bestTime: string; budget: string };
    highlights: string[];
}

export async function getDestinations(): Promise<Destination[]> {
    const snap = await getDocs(collection(db, "destinations"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Destination, "id">) }));
}

export async function getDestinationById(id: string): Promise<Destination | null> {
    const snap = await getDoc(doc(db, "destinations", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Destination, "id">) };
}

export async function addDestination(dest: Omit<Destination, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "destinations"), dest);
    return ref.id;
}

export async function deleteDestination(id: string): Promise<void> {
    await deleteDoc(doc(db, "destinations", id));
}

export async function submitDestinationRating(destId: string, userId: string, score: number): Promise<void> {
    const destRef = doc(db, "destinations", destId);

    // Using a transaction to ensure we correctly increment/update ratings
    await runTransaction(db, async (transaction: Transaction) => {
        const destDoc = await transaction.get(destRef);
        if (!destDoc.exists()) throw new Error("Destination does not exist");

        const data = destDoc.data() as Omit<Destination, "id">;
        const ratings = data.ratings || {};
        const previousScore = ratings[userId];

        ratings[userId] = score; // Add or update the user's score

        let newReviewCount = data.reviewCount || 0;
        let newRating = data.rating || 0;

        if (previousScore !== undefined) {
            // User updating their past score
            // current total = newRating * newReviewCount
            // new total = current total - previousScore + score
            const currentTotal = newRating * newReviewCount;
            const newTotal = currentTotal - previousScore + score;
            newRating = newReviewCount === 0 ? score : newTotal / newReviewCount;
        } else {
            // New user rating
            const currentTotal = newRating * newReviewCount;
            newReviewCount += 1;
            const newTotal = currentTotal + score;
            newRating = newTotal / newReviewCount;
        }

        transaction.update(destRef, {
            ratings,
            rating: newRating,
            reviewCount: newReviewCount
        });
    });
}

// ----------- Stays -----------

export interface Stay {
    id: string;
    // Basic info
    name: string;
    type: string;          // "Hostel" | "Homestay" | "Guesthouse" | "Resort" | "Campsite"
    destinationId: string; // links to destinations collection
    location: string;      // full address / area
    description: string;
    price: number;         // per night in ₹
    beds: number;
    rating: number;
    // Host
    hostName: string;
    hostBio: string;
    hostAvatar: string;    // URL
    // Contact
    phone: string;
    whatsapp: string;
    email: string;
    // Media
    photos: string[];      // array of image URLs
    // Extras
    amenities: string[];   // e.g. ["WiFi", "Hot Water", "Mountain View"]
    houseRules: string[];
    tags: string[];
    createdAt?: any;
}

export async function getStays(): Promise<Stay[]> {
    const snap = await getDocs(query(collection(db, "stays"), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Stay, "id">) }));
}

export async function getStayById(id: string): Promise<Stay | null> {
    const snap = await getDoc(doc(db, "stays", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Stay, "id">) };
}

export async function getStaysByDestination(destinationId: string): Promise<Stay[]> {
    const q = query(collection(db, "stays"), where("destinationId", "==", destinationId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Stay, "id">) }));
}

export async function addStay(stay: Omit<Stay, "id" | "createdAt">): Promise<string> {
    const ref = await addDoc(collection(db, "stays"), {
        ...stay,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function updateStay(id: string, data: Partial<Omit<Stay, "id">>): Promise<void> {
    await updateDoc(doc(db, "stays", id), data);
}

export async function deleteStay(id: string): Promise<void> {
    await deleteDoc(doc(db, "stays", id));
}

// ----------- Trip Packages -----------

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
}

export interface TripPackage {
    id: string;
    title: string;
    destination: string;
    description: string;         // "About" section
    duration: string;            // e.g. "6 Days / 5 Nights"
    price: number;               // per person in ₹
    cancellationPolicy: string;  // e.g. "Free cancellation up to 7 days"
    departureDate: string;       // e.g. "April 15, 2025"
    maxGroupSize: number;
    highlights: string[];
    included: string[];
    excluded: string[];
    itinerary: ItineraryDay[];
    photos: string[];            // Firebase Storage URLs
    tags: string[];
    status: "upcoming" | "full" | "completed";
    createdAt?: any;
}

export async function getTripPackages(): Promise<TripPackage[]> {
    const snap = await getDocs(query(collection(db, "tripPackages"), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TripPackage, "id">) }));
}

export async function addTripPackage(pkg: Omit<TripPackage, "id" | "createdAt">): Promise<string> {
    const ref = await addDoc(collection(db, "tripPackages"), {
        ...pkg,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function deleteTripPackage(id: string): Promise<void> {
    await deleteDoc(doc(db, "tripPackages", id));
}



// ----------- Festivals -----------

export interface Festival {
    id: string;
    name: string;
    location: string;
    dates: string;
    month: string;
    day: string;
    image: string;
    tags: string[];
}

export async function getFestivals(): Promise<Festival[]> {
    const snap = await getDocs(collection(db, "festivals"));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Festival, "id">) }));
}

// ----------- Go-Out Requests -----------

export interface GoOutRequest {
    id: string;
    authorUid?: string;   // UID of the user who posted the trip
    user: { name: string; age: number; image: string };
    trip: { title: string; destination: string; date: string; dateFromISO?: string; dateToISO?: string; type: string; budget: string };
    description: string;
}

export async function getGoOutRequests(): Promise<GoOutRequest[]> {
    const snap = await getDocs(query(collection(db, "goOutRequests"), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GoOutRequest, "id">) }));
}

export async function getMyGoOutRequests(uid: string): Promise<GoOutRequest[]> {
    const snap = await getDocs(query(collection(db, "goOutRequests"), where("authorUid", "==", uid)));
    const results = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GoOutRequest, "id">) }));
    // Sort client-side so no composite index is needed
    return results.sort((a: any, b: any) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function deleteGoOutRequest(id: string): Promise<void> {
    await deleteDoc(doc(db, "goOutRequests", id));
}

export async function updateGoOutRequest(id: string, data: Partial<GoOutRequest>): Promise<void> {
    await updateDoc(doc(db, "goOutRequests", id), { ...data, updatedAt: serverTimestamp() });
}

export async function addGoOutRequest(request: Omit<GoOutRequest, "id">): Promise<string> {
    const ref = await addDoc(collection(db, "goOutRequests"), {
        ...request,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

// ----------- Community Chats (Groups) -----------

export interface GroupChat {
    id: string;
    name: string;
    description: string;
    type: "public" | "private";
    image: string;
    createdBy: string;
    memberUids: string[];
    memberCount: number;
    lastMessage: string;
    lastMessageAt: Timestamp | null;
    createdAt: Timestamp | null;
}

export interface Message {
    id: string;
    text: string;
    senderUid: string;
    senderName: string;
    senderAvatar: string;
    createdAt: Timestamp | null;
}

/** One-shot fetch (use subscribeToGroups for real-time) */
export async function getCommunityChats(): Promise<GroupChat[]> {
    const snap = await getDocs(
        query(collection(db, "communityChats"), orderBy("lastMessageAt", "desc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GroupChat, "id">) }));
}

/** Real-time listener for all community groups */
export function subscribeToGroups(callback: (groups: GroupChat[]) => void): () => void {
    const qRef = query(collection(db, "communityChats"), orderBy("lastMessageAt", "desc"));
    return onSnapshot(qRef, (snap) => {
        const groups = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GroupChat[];
        callback(groups);
    });
}

/** Real-time listener for messages in a group */
export function subscribeToChatMessages(
    chatId: string,
    callback: (messages: Message[]) => void
): () => void {
    const qRef = query(
        collection(db, "communityChats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );
    return onSnapshot(qRef, (snap) => {
        const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
        callback(messages);
    });
}

/** Create a new community group */
export async function createCommunityGroup(data: {
    name: string;
    description: string;
    isPublic: boolean;
    creatorUid: string;
    creatorName: string;
    creatorAvatar: string;
}): Promise<string> {
    const ref = await addDoc(collection(db, "communityChats"), {
        name: data.name,
        description: data.description,
        type: data.isPublic ? "public" : "private",
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&size=200`,
        createdBy: data.creatorUid,
        memberUids: [data.creatorUid],
        memberCount: 1,
        lastMessage: "Group created",
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

/** Join a public group */
export async function joinGroup(chatId: string, uid: string): Promise<void> {
    const { arrayUnion } = await import("firebase/firestore");
    await updateDoc(doc(db, "communityChats", chatId), {
        memberUids: arrayUnion(uid),
        memberCount: increment(1),
    });
}

/** Leave a group */
export async function leaveGroup(chatId: string, uid: string): Promise<void> {
    const { arrayRemove } = await import("firebase/firestore");
    await updateDoc(doc(db, "communityChats", chatId), {
        memberUids: arrayRemove(uid),
        memberCount: increment(-1),
    });
}

/** Send a message with real user identity */
export async function sendChatMessage(
    chatId: string,
    text: string,
    sender: { uid: string; name: string; avatar: string }
): Promise<void> {
    await addDoc(collection(db, "communityChats", chatId, "messages"), {
        text,
        senderUid: sender.uid,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "communityChats", chatId), {
        lastMessage: text.length > 60 ? text.slice(0, 60) + "…" : text,
        lastMessageAt: serverTimestamp(),
    });
}

/** Get a single group doc */
export async function getGroupChat(chatId: string): Promise<GroupChat | null> {
    const snap = await getDoc(doc(db, "communityChats", chatId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<GroupChat, "id">) };
}

/** Save FCM token for push notifications */
export async function saveFcmToken(uid: string, token: string): Promise<void> {
    await updateDoc(doc(db, "users", uid), { fcmToken: token, updatedAt: serverTimestamp() });
}


// ----------- Stories -----------

export interface StoryComment {
    id: string;
    uid: string;
    name: string;
    avatar: string;
    text: string;
    createdAt: Timestamp | null;
}

export interface Story {
    id: string;
    name: string;
    image: string;           // avatar/thumbnail of the poster
    mediaUrl: string;        // the story image or video URL
    mediaType: "image" | "video";
    caption?: string;
    isUser?: boolean;
    authorUid: string;
    likes: number;
    likedBy: string[];       // array of uids
    comments: number;
    createdAt: Timestamp | null;
    expiresAt: Timestamp | null;
}

/** Returns only stories that have not expired (within last 24h) */
export async function getActiveStories(): Promise<Story[]> {
    const { where, Timestamp: TS } = await import("firebase/firestore");
    const now = TS.now();
    const snap = await getDocs(
        query(
            collection(db, "stories"),
            where("expiresAt", ">", now),
            orderBy("expiresAt", "desc")
        )
    );
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Story, "id">) }));
}

/** Kept for legacy compatibility */
export async function getStories(): Promise<Story[]> {
    return getActiveStories();
}

export async function addStory(data: {
    name: string;
    image: string;        // poster avatar
    mediaUrl: string;
    mediaType: "image" | "video";
    caption?: string;
    authorUid: string;
}): Promise<string> {
    const { Timestamp: TS } = await import("firebase/firestore");
    const now = TS.now();
    // expires 24 hours from now
    const expiresAt = new TS(now.seconds + 86400, now.nanoseconds);

    const ref = await addDoc(collection(db, "stories"), {
        ...data,
        isUser: false,
        likes: 0,
        likedBy: [],
        comments: 0,
        createdAt: serverTimestamp(),
        expiresAt,
    });
    return ref.id;
}

export async function likeStory(storyId: string, uid: string): Promise<void> {
    const { arrayUnion } = await import("firebase/firestore");
    await updateDoc(doc(db, "stories", storyId), {
        likes: increment(1),
        likedBy: arrayUnion(uid),
    });
}

export async function unlikeStory(storyId: string, uid: string): Promise<void> {
    const { arrayRemove } = await import("firebase/firestore");
    await updateDoc(doc(db, "stories", storyId), {
        likes: increment(-1),
        likedBy: arrayRemove(uid),
    });
}

export async function addStoryComment(storyId: string, data: { uid: string; name: string; avatar: string; text: string }): Promise<void> {
    await addDoc(collection(db, "stories", storyId, "comments"), {
        ...data,
        createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "stories", storyId), { comments: increment(1) });
}

export async function getStoryComments(storyId: string): Promise<StoryComment[]> {
    const snap = await getDocs(
        query(collection(db, "stories", storyId, "comments"), orderBy("createdAt", "asc"))
    );
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<StoryComment, "id">) }));
}

export async function getStoriesByUser(uid: string): Promise<Story[]> {
    const { Timestamp: TS } = await import("firebase/firestore");
    const now = TS.now();
    const snap = await getDocs(
        query(
            collection(db, "stories"),
            where("authorUid", "==", uid),
            where("expiresAt", ">", now),
            orderBy("expiresAt", "desc")
        )
    );
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Story, "id">) }));
}

// ----------- User Profiles -----------

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    bio: string;
    location: string;
    joinedAt: Timestamp | null;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    tripsCount: number;
}

/**
 * Creates or updates user profile in Firestore on login.
 * Uses setDoc with merge:true so existing fields are preserved.
 */
export async function upsertUserProfile(
    uid: string,
    data: { displayName: string; email: string; photoURL: string }
): Promise<void> {
    const { setDoc, serverTimestamp: sts } = await import("firebase/firestore");
    await setDoc(
        doc(db, "users", uid),
        {
            uid,
            displayName: data.displayName || "Musafir User",
            email: data.email || "",
            photoURL: data.photoURL || "",
            updatedAt: sts(),
        },
        { merge: true }
    );

    // Set joinedAt only if doc is new (won't overwrite existing)
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.data()?.joinedAt) {
        const { updateDoc: upd, serverTimestamp: sts2 } = await import("firebase/firestore");
        await upd(doc(db, "users", uid), { joinedAt: sts2() });
    }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return { uid: snap.id, ...(snap.data() as Omit<UserProfile, "uid">) };
}

export async function updateUserProfile(
    uid: string,
    data: Partial<Pick<UserProfile, "displayName" | "bio" | "location" | "photoURL">>
): Promise<void> {
    await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

// ----------- Direct Messages (DMs) -----------

export interface DMConversation {
    id: string;              // sorted uid1_uid2
    participantUids: string[];
    participants: Record<string, { name: string; avatar: string }>;
    lastMessage?: string;
    lastMessageAt?: Timestamp | null;
}

export interface DMMessage {
    id: string;
    text: string;
    senderUid: string;
    senderName: string;
    senderAvatar: string;
    createdAt: Timestamp | null;
    /** If this message is a join-trip request, metadata is provided */
    joinTripRequest?: {
        tripTitle: string;
        destination: string;
        date: string;
        type: string;
    } | null;
}

/** Returns (or creates) a DM conversation between two users. */
export async function getOrCreateDM(
    myUid: string,
    myInfo: { name: string; avatar: string },
    otherUid: string,
    otherInfo: { name: string; avatar: string }
): Promise<string> {
    const dmId = [myUid, otherUid].sort().join("_");
    const ref = doc(db, "directMessages", dmId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        const { setDoc } = await import("firebase/firestore");
        await setDoc(ref, {
            participantUids: [myUid, otherUid],
            participants: {
                [myUid]: myInfo,
                [otherUid]: otherInfo,
            },
            createdAt: serverTimestamp(),
            lastMessage: "",
            lastMessageAt: null,
        });
    }
    return dmId;
}

/** Subscribe to all DM conversations the user is part of */
export function subscribeToDMs(
    uid: string,
    callback: (dms: DMConversation[]) => void
): () => void {
    const q = query(
        collection(db, "directMessages"),
        where("participantUids", "array-contains", uid),
        orderBy("lastMessageAt", "desc")
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DMConversation, "id">) })));
    });
}

/** Subscribe to real-time messages in a DM conversation */
export function subscribeToDMMessages(
    dmId: string,
    callback: (msgs: DMMessage[]) => void
): () => void {
    const q = query(
        collection(db, "directMessages", dmId, "messages"),
        orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DMMessage, "id">) })));
    });
}

/** Send a message in a DM conversation. Optionally tag as join-trip-request. */
export async function sendDM(
    dmId: string,
    text: string,
    sender: { uid: string; name: string; avatar: string },
    joinTripRequest?: DMMessage["joinTripRequest"]
): Promise<void> {
    await addDoc(collection(db, "directMessages", dmId, "messages"), {
        text,
        senderUid: sender.uid,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        joinTripRequest: joinTripRequest ?? null,
        createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "directMessages", dmId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
    });
}

// ----------- User Search -----------

/** Search users by displayName prefix (case-insensitive best-effort) */
export async function searchUsers(nameQuery: string): Promise<UserProfile[]> {
    if (!nameQuery.trim()) return [];
    const q = query(collection(db, "users"), orderBy("displayName"), where("displayName", ">=", nameQuery), where("displayName", "<=", nameQuery + "\uf8ff"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<UserProfile, "uid">) }));
}

