
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available models:', Object.keys(prisma).filter(key => key[0] !== '_' && key[0] !== '$'));

async function main() {
    try {
        if (prisma.option) {
            console.log('prisma.option exists');
        } else {
            console.log('prisma.option DOES NOT exist');
            // Check for similar names
            const keys = Object.keys(prisma);
            const similar = keys.filter(k => k.toLowerCase().includes('option'));
            console.log('Similar keys:', similar);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
