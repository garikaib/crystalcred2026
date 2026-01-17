import mongoose from "mongoose"
import { User } from "../models/User"
import dbConnect from "../lib/mongodb"
import crypto from "crypto"
import { ensureSafeToRun } from "./utils/safeguard"

ensureSafeToRun();

// Generate a secure random password
function generatePassword(length = 12): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    const randomBytes = crypto.randomBytes(length)
    for (let i = 0; i < length; i++) {
        password += charset[randomBytes[i] % charset.length]
    }
    return password
}

const users = [
    {
        username: "innocent",
        email: "innocent@crystalcred.co.zw",
        role: "admin" as const,
    },
    {
        username: "garikaib",
        email: "garikaib@gmail.com",
        role: "admin" as const,
    },
]

async function seedUsers() {
    try {
        await dbConnect()
        console.log("Connected to MongoDB")

        // Clear existing users
        await User.deleteMany({})
        console.log("Cleared existing users")

        console.log("\n" + "=".repeat(60))
        console.log("           NEW USER CREDENTIALS - SAVE THESE!            ")
        console.log("=".repeat(60) + "\n")

        for (const userData of users) {
            const password = generatePassword(16)

            const user = new User({
                username: userData.username,
                email: userData.email,
                password: password,
                role: userData.role,
            })

            await user.save()

            console.log(`User: ${userData.username}`)
            console.log(`Email: ${userData.email}`)
            console.log(`Password: ${password}`)
            console.log(`Role: ${userData.role}`)
            console.log("-".repeat(40))
        }

        console.log("\n" + "=".repeat(60))
        console.log("  ⚠️  IMPORTANT: Save these credentials securely NOW!     ")
        console.log("     They will NOT be shown again.                        ")
        console.log("=".repeat(60) + "\n")

        console.log(`Seeded ${users.length} users successfully`)
        process.exit(0)
    } catch (error) {
        console.error("Error seeding users:", error)
        process.exit(1)
    }
}

seedUsers()
