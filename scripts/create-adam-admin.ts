import { hashSync } from 'bcryptjs';
import prisma from '../src/lib/prisma'; // Adjust path if needed

async function createAdamSuperAdmin() {
    const adamName = 'Transcontinentaladam'; // Admin name – CHANGE THIS if needed
    const adamPasswordPlain = 'Transdev2025!'; // Replace with a strong password – CHANGE THIS
    const adamEmail = 'Transcontinentallog@hotmail.com'; // Admin email – CHANGE THIS
    const hashedPassword = hashSync(adamPasswordPlain, 12);

    try {
        const adamAdmin = await prisma.admin.create({
            data: {
                email: adamEmail,
                password: hashedPassword,
                name: adamName,
                isAdmin: true,
                isSuperAdmin: true,
            },
        });
        console.log('Adam super admin user created:', adamAdmin);
    } catch (error) {
        console.error('Error creating Adam super admin user:', error);
    }
}

createAdamSuperAdmin()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    }) 