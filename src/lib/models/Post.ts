import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPost extends Document {
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage?: string;
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
    ogImage?: string;
  };
  published: boolean;
  publishedAt?: Date;
  readingTimeMinutes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    slug: { type: String, unique: true, required: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    coverImage: { type: String },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
      ogImage: { type: String },
    },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    readingTimeMinutes: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for listing query
PostSchema.index({ published: 1, publishedAt: -1 });

// Prevent model re-registration in dev hot reloads
export const Post: Model<IPost> =
  (mongoose.models.Post as Model<IPost>) || mongoose.model<IPost>("Post", PostSchema);

// Serialisable shape passed to client components / page props
export interface PostData {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  coverImage?: string;
  seo: {
    title?: string;
    description?: string;
    keywords: string[];
    ogImage?: string;
  };
  published: boolean;
  publishedAt?: string;
  readingTimeMinutes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export function serializePost(post: IPost): PostData {
  // Support both Mongoose documents (have .toObject) and plain lean() objects
  const obj = (typeof (post as unknown as { toObject?: () => unknown }).toObject === "function"
    ? (post as unknown as { toObject: (o: object) => unknown }).toObject({ versionKey: false })
    : post) as IPost & { _id: mongoose.Types.ObjectId };

  return {
    _id: obj._id.toString(),
    slug: obj.slug,
    title: obj.title,
    summary: obj.summary,
    content: obj.content ?? "",
    tags: obj.tags ?? [],
    coverImage: obj.coverImage,
    seo: {
      title: obj.seo?.title,
      description: obj.seo?.description,
      keywords: obj.seo?.keywords ?? [],
      ogImage: obj.seo?.ogImage,
    },
    published: obj.published,
    publishedAt: obj.publishedAt ? new Date(obj.publishedAt).toISOString() : undefined,
    readingTimeMinutes: obj.readingTimeMinutes ?? 1,
    views: obj.views ?? 0,
    createdAt: new Date(obj.createdAt).toISOString(),
    updatedAt: new Date(obj.updatedAt).toISOString(),
  };
}
