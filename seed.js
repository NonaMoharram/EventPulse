const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// استدعاء الموديلز التي أنشأناها
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Message = require('./models/Message');

// تحميل متغيرات البيئة
dotenv.config();

const seedDatabase = async () => {
    try {
        // 1. الاتصال بقاعدة البيانات
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // 2. مسح البيانات القديمة بالترتيب الصحيح لمنع مشاكل العلاقات
        await Message.deleteMany();
        await Registration.deleteMany();
        await Event.deleteMany();
        await Category.deleteMany();
        await User.deleteMany();
        console.log('Old data cleared successfully.');

        // 3. إنشاء كلمة مرور مشفرة للمستخدمين التجريبيين
        const hashedPassword = await bcrypt.hash('password123', 10);

        // 4. إدخال مستخدمين (يتضمن مسؤول Admin وحاضرين Attendee)
        const users = await User.create([
            { name: 'Admin User', email: 'admin@eventpulse.com', password: hashedPassword, role: 'admin' },
            { name: 'John Doe', email: 'john@eventpulse.com', password: hashedPassword, role: 'attendee' },
            { name: 'Jane Smith', email: 'jane@eventpulse.com', password: hashedPassword, role: 'attendee' }
        ]);
        console.log('Users seeded.');

        const adminId = users[0]._id;
        const johnId = users[1]._id;

        // 5. إدخال الفئات (أكثر من 3 فئات كما هو مطلوب في الـ Mind Map)
        const categories = await Category.create([
            { name: 'Tech & AI', description: 'Technology and Artificial Intelligence workshops' },
            { name: 'Music & Art', description: 'Concerts, festivals, and gallery openings' },
            { name: 'Business', description: 'Networking events and corporate seminars' },
            { name: 'Sports', description: 'Local tournaments and fitness activities' }
        ]);
        console.log('Categories seeded.');

        // 6. إدخال الفعاليات (أكثر من 4 فعاليات مع ربطها بالمسؤول والفئة المناسبة)
        await Event.create([
            {
                title: 'AI Revolution Summit',
                description: 'A summit discussing the future of generative AI.',
                category: categories[0]._id,
                date: new Date('2026-10-15'),
                city: 'Alexandria',
                venue: 'Bibliotheca Alexandrina',
                capacity: 200,
                organizer: adminId
            },
            {
                title: 'Web Dev Workshop 2026',
                description: 'Hands-on Node.js and Express backend development.',
                category: categories[0]._id,
                date: new Date('2026-11-20'),
                city: 'Cairo',
                venue: 'Creativa Hub',
                capacity: 50,
                organizer: adminId
            },
            {
                title: 'Jazz Night Symphony',
                description: 'Live performance by top local jazz musicians.',
                category: categories[1]._id,
                date: new Date('2026-09-05'),
                city: 'Alexandria',
                venue: 'Opera House',
                capacity: 150,
                organizer: adminId
            },
            {
                title: 'Startup Growth Seminar',
                description: 'Learn how to scale your startup business efficiently.',
                category: categories[2]._id,
                date: new Date('2026-12-01'),
                city: 'Cairo',
                venue: 'AUC Tahrir Square',
                capacity: 100,
                organizer: adminId
            },
            {
                title: 'Annual Marathon 2026',
                description: 'Run for health in the heart of the city.',
                category: categories[3]._id,
                date: new Date('2026-08-25'),
                city: 'Alexandria',
                venue: 'Corniche',
                capacity: 500,
                organizer: adminId
            }
        ]);
        console.log('Events seeded.');

        console.log('Database Seeding Completed Successfully! 🌱');
        process.exit();
    } catch (error) {
        console.error('Error during database seeding:', error);
        process.exit(1);
    }
};

seedDatabase();
