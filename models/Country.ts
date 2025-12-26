import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICountry extends Document {
    name: string;
    slug: string; // url-friendly name, unique
    overview: string;

    // Costs
    estimatedCost: {
        budget: string; // e.g., "$50/day"
        medium: string;
        luxury: string;
        currency: string;
    };

    // Safety from AI
    safety: {
        score: number; // 0-100
        details: {
            crime: string;
            transport: string;
            women: string;
            lgbtq: string;
            health: string;
            political: string;
        };
    };

    // Travel Info
    bestSeason: string;
    visaRequirements: string;
    culturalWarnings: string[];
    localLaws: string[];
    emergencyNumbers: {
        police: string;
        ambulance: string;
    };
    internetAvailability: string;

    // AI Generated Content
    advisoryText: string; // Detailed advisory
    historyText: string; // Storytelling

    // Cache Tracking
    lastUpdated: Date;
}

const CountrySchema = new Schema<ICountry>(
    {
        name: { type: String, required: true, index: true },
        slug: { type: String, required: true, unique: true },
        overview: String,

        estimatedCost: {
            budget: String,
            medium: String,
            luxury: String,
            currency: String,
        },

        safety: {
            score: Number,
            details: {
                crime: String,
                transport: String,
                women: String,
                lgbtq: String,
                health: String,
                political: String,
            },
        },

        bestSeason: String,
        visaRequirements: String,
        culturalWarnings: [String],
        localLaws: [String],
        emergencyNumbers: {
            police: String,
            ambulance: String,
        },
        internetAvailability: String,

        advisoryText: String,
        historyText: String,

        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true } // adds createdAt, updatedAt
);

const Country: Model<ICountry> = mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);

export default Country;
