/**
 * Data Migration Script: MySQL → Supabase PostgreSQL
 *
 * Usage:
 *   1. Set MYSQL_DATABASE_URL in your .env to point to the old MySQL database
 *   2. Set DATABASE_URL and DIRECT_URL in your .env to point to Supabase
 *   3. Run: npx ts-node --project tsconfig.json scripts/migrate-data.ts
 *
 * This script migrates data in dependency order to preserve foreign key integrity:
 *   User → Test → Question → TestAttempt → Answer
 */

import "dotenv/config";
import { PrismaClient as PostgresClient } from "@prisma/client";
import { PrismaClient as MysqlClient } from "@prisma/client";

if (!process.env.MYSQL_DATABASE_URL) {
    throw new Error("MYSQL_DATABASE_URL is not set in .env");
}

// Postgres client uses DATABASE_URL from .env (Supabase)
const postgres = new PostgresClient();

// MySQL client uses MYSQL_DATABASE_URL from .env
const mysql = new MysqlClient({
    datasources: {
        db: { url: process.env.MYSQL_DATABASE_URL },
    },
});

async function migrate() {
    console.log("🚀 Starting data migration: MySQL → Supabase PostgreSQL\n");

    try {
        // ── 1. Users ──────────────────────────────────────────────────────────────
        console.log("📦 Migrating Users...");
        const users = await mysql.user.findMany();
        for (const user of users) {
            await postgres.user.upsert({
                where: { id: user.id },
                update: {},
                create: user,
            });
        }
        console.log(`   ✅ ${users.length} users migrated`);

        // ── 2. Tests ──────────────────────────────────────────────────────────────
        console.log("📦 Migrating Tests...");
        const tests = await mysql.test.findMany();
        for (const test of tests) {
            await postgres.test.upsert({
                where: { id: test.id },
                update: {},
                create: test,
            });
        }
        console.log(`   ✅ ${tests.length} tests migrated`);

        // ── 3. Questions ──────────────────────────────────────────────────────────
        console.log("📦 Migrating Questions...");
        const questions = await mysql.question.findMany();
        for (const question of questions) {
            await postgres.question.upsert({
                where: { id: question.id },
                update: {},
                create: question,
            });
        }
        console.log(`   ✅ ${questions.length} questions migrated`);

        // ── 4. TestAttempts ───────────────────────────────────────────────────────
        console.log("📦 Migrating TestAttempts...");
        const attempts = await mysql.testAttempt.findMany();
        for (const attempt of attempts) {
            await postgres.testAttempt.upsert({
                where: { id: attempt.id },
                update: {},
                create: attempt,
            });
        }
        console.log(`   ✅ ${attempts.length} test attempts migrated`);

        // ── 5. Answers ────────────────────────────────────────────────────────────
        console.log("📦 Migrating Answers...");
        const answers = await mysql.answer.findMany();
        for (const answer of answers) {
            await postgres.answer.upsert({
                where: { id: answer.id },
                update: {},
                create: answer,
            });
        }
        console.log(`   ✅ ${answers.length} answers migrated`);

        console.log("\n🎉 Migration complete! All records transferred successfully.");
    } catch (error) {
        console.error("\n❌ Migration failed:", error);
        process.exit(1);
    } finally {
        await mysql.$disconnect();
        await postgres.$disconnect();
    }
}

migrate();
