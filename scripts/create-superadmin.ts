
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

async function createSuperAdmin() {
    try {
        console.log('🚀 Creating Super Admin User');
        console.log('---------------------------');

        const name = await askQuestion('Enter Name: ');
        const email = await askQuestion('Enter Email: ');
        const password = await askQuestion('Enter Password: ');

        if (!name || !email || !password) {
            console.error('❌ Error: All fields are required to create a super admin.');
            process.exit(1);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.error(`❌ Error: User with email "${email}" already exists.`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
            },
        });

        console.log('\n✅ Super Admin created successfully!');
        console.log(`🆔 ID: ${user.id}`);
        console.log(`👤 Name: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Role: ${user.role}`);

    } catch (error) {
        console.error('❌ Error creating super admin:', error);
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

createSuperAdmin();
