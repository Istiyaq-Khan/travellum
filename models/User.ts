import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    profile: {
        location?: string;
        age?: number;
        groupType?: 'Solo' | 'Friends' | 'Family' | 'Couple';
        travelDocuments?: string[]; // e.g., ['Passport', 'Visa-USA']
        health?: string[];
    };
    moodLogs: {
        date: Date;
        mood: string;
        note?: string;
    }[];
    searchHistory: {
        countryName: string;
        slug: string;
        searchedAt: Date;
    }[];
    recommendations?: {
        data: any[];
        generatedAt: Date;
    };
    isProfileComplete?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        uid: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        displayName: { type: String },
        photoURL: { type: String },
        profile: {
            location: String,
            age: Number,
            groupType: { type: String, enum: ['Solo', 'Friends', 'Family', 'Couple'] },
            travelDocuments: [String],
            health: [String],
        },
        moodLogs: [
            {
                date: { type: Date, default: Date.now },
                mood: String,
                note: String,
            }
        ],
        searchHistory: [
            {
                countryName: String,
                slug: String,
                searchedAt: { type: Date, default: Date.now }
            }
        ],
        recommendations: {
            data: [Schema.Types.Mixed], // storing the flexible recommendation data
            generatedAt: { type: Date }
        },
        isProfileComplete: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
