import mongoose, { Schema, Document, Model } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
    username: string
    email: string
    password: string
    role: "admin" | "user"
    resetToken?: string
    resetTokenExpiry?: Date
    magicLinkToken?: string
    magicLinkExpiry?: Date
    createdAt: Date
    updatedAt: Date
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        resetToken: {
            type: String,
            select: false,
        },
        resetTokenExpiry: {
            type: Date,
            select: false,
        },
        magicLinkToken: {
            type: String,
            select: false,
        },
        magicLinkExpiry: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
)

// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
