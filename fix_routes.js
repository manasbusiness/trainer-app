const fs = require('fs');
const path = require('path');

const projectRoot = 'd:\\manas-learnings\\frontend\\trainer-app';

const moveDir = (src, dest) => {
    const srcPath = path.join(projectRoot, src);
    const destPath = path.join(projectRoot, dest);

    console.log(`Checking source: ${srcPath}`);
    if (!fs.existsSync(srcPath)) {
        console.log(`Source does not exist: ${src}`);
        return;
    }

    console.log(`Checking destination: ${destPath}`);
    if (!fs.existsSync(destPath)) {
        console.log(`Creating directory: ${dest}`);
        fs.mkdirSync(destPath, { recursive: true });
    }

    const items = fs.readdirSync(srcPath);
    items.forEach(item => {
        const srcItem = path.join(srcPath, item);
        const destItem = path.join(destPath, item);
        console.log(`Moving ${srcItem} to ${destItem}`);
        try {
            fs.renameSync(srcItem, destItem);
        } catch (err) {
            console.error(`Failed to move ${srcItem}: ${err.message}`);
        }
    });

    // Remove source directory if empty
    try {
        fs.rmdirSync(srcPath);
        console.log(`Removed empty directory: ${src}`);
    } catch (e) {
        console.log(`Directory not empty or could not be removed: ${src}`);
    }
};

console.log('Starting route restructure...');

// Admin Routes
moveDir('app/(admin)/dashboard', 'app/(admin)/admin/dashboard');
moveDir('app/(admin)/tests', 'app/(admin)/admin/tests');
moveDir('app/(admin)/students', 'app/(admin)/admin/students');

// Student Routes
moveDir('app/(student)/dashboard', 'app/(student)/student/dashboard');
moveDir('app/(student)/tests', 'app/(student)/student/tests');
moveDir('app/(student)/analytics', 'app/(student)/student/analytics');
moveDir('app/(student)/profile', 'app/(student)/student/profile');

console.log('Route restructure complete.');
