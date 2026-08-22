const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

//  مسار تسجيل مستخدم جديد 
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // التحقق مما إذا كان البريد الإلكتروني مسجل مسبقاً 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email is already registered', 400));
    }

    // تشفير كلمة المرور باستخدام bcrypt 
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء المستخدم الجديد في قاعدة البيانات
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'attendee'
    });

    // إنشاء الـ JWT Token للمستخدم الجديد
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // إرسال الاستجابة بنجاح العملية كود 201
    res.status(201).json({
        status: 'success',
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// 2. مسار تسجيل الدخول (Login Endpoint) 
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // البحث عن المستخدم وتضمين حقل كلمة المرور المخفي افتراضياً
    const user = await User.findOne({ email }).select('+password');

    // إذا لم يكن المستخدم موجوداً، يتم إرجاع خطأ عام غير محدد لحماية النظام 
    if (!user) {
        return next(new AppError('Invalid email or password', 401));
    }

    // التحقق من صحة كلمة المرور ومقارنتها بالمشفرة 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError('Invalid email or password', 401));
    }

    // إنشاء الـ JWT Token عند نجاح الدخول
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // إرسال استجابة النجاح كود 200 
    res.status(200).json({
        status: 'success',
        token
    });
});